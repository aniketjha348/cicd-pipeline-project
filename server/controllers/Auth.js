
// controllers/auth.controller.js
import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.utils.js';
import { goodResponse, badResponse } from '../utils/response.js';
import { Admin, User,Student,Faculty } from '../model/AuthModels.js';
import {UAParser} from 'ua-parser-js'
import axios from 'axios'
import mongoose from 'mongoose';
const getLocation = async (quardinate) => {
  const { latitude, longitude}=quardinate
  const apiKey = "164407c11c2b43538012e5cbc3929918"; // get free key from OpenCage

  if(!(latitude || longitude)) return {}
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const results = response.data.results;
    if (results.length > 0) {
      const components = results[0].components;
      console.log("City:", components.city || components.town || components.village);
      console.log("State:", components.state);
      console.log("Country:", components.country);
      return components;
    } else {
      console.log("No results found");
      return null;
    }
  } catch (error) {
    console.error("Reverse geocoding error:");
    return {}
  }
};
// 164407c11c2b43538012e5cbc3929918
export const getDeviceInfo = async (req) => {
  const parser = new UAParser();
  const userAgent = req.headers['user-agent'];
  const uaResult = parser.setUA(userAgent).getResult();
const forwarded = req.headers['x-forwarded-for'];
 const  ip = forwarded
    ? forwarded.split(',')[0].trim()
    : req.socket.remoteAddress;
  // const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // console.log(req.headers['x-forwarded-for'],req.socket.remoteAddress);\
  // const location=await getLocation("47.31.255.141");
  // console.log(location);
  


  return ({
    ip,
    userAgent,
    browser: uaResult.browser.name,
    os: uaResult.os.name,
    device: uaResult.device.type || 'Desktop',
    // location
  })
}

function parseBrowser(ua) {
  const match = ua.match(/(Firefox|Chrome|Safari|Edg|Opera)/);
  return match ? match[0] : 'Unknown';
}

function parseOS(ua) {
  const match = ua.match(/\(([^)]+)\)/);
  return match ? match[1] : 'Unknown';
}
const isProd= process.env.NODE_ENV === 'production';
const RoleModelMap = {
  admin: Admin,
  faculty: Faculty,
  student: Student
};
export class Auth{

static login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip;
    const userAgent = req.headers['user-agent'] || 'unknown';

    if (!email || !password) {
      return badResponse({ res, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).populate("institution");
    if (!user) {
      return badResponse({ res, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return badResponse({ res, message: 'Invalid credentials' });
    }

   
    const newSessionId = new mongoose.Types.ObjectId().toHexString();
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      sessionId:newSessionId
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    // Store hashed refresh token and login details in user doc
    const userdeviceInfo=await getDeviceInfo(req);
    user.sessions.push({
      id:newSessionId,
      refreshTokenHash: hashedRefreshToken,
    //   ip,
    //   userAgent,
    //   browser: parseBrowser(userAgent),
    //   device: /mobile/i.test(userAgent) ? 'Mobile' : 'Desktop',
    //   os: parseOS(userAgent),
    ...userdeviceInfo,
      createdAt: new Date(),
      lastUsed: new Date(),
    });

    await user.save();

    // Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure:isProd,
      sameSite: isProd?'None':"Strict",
      maxAge: 15 * 60 * 1000 // 15 min
    });

    res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
      secure:isProd,
      sameSite: isProd?'None':"Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return goodResponse({
      res,
      message: 'Login successful',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return badResponse({ res, message: 'Login failed', error });
  }
};

static registerUser = async (req, res) => {
  try {
    const { role } = req.body;

    // Check allowed roles
    if (!['student', 'faculty'].includes(role)) {
      return badResponse({ res, message: "Invalid role for registration", statusCode: 400 });
    }

    const isAdminRegistering = req.user && req.user.role === 'admin';

    // Only Admin can register faculty, student self-registration is allowed
    if (role === 'faculty' && !isAdminRegistering) {
      return badResponse({ res, message: "Only admin can register faculty", statusCode: 403 });
    }

    const {
      email,
      password,
      name,
      department,
      course,
      batch,
      rollNo,
      photo,
      designation,
      employeeId,
      nano,
      accessLevel, // optional for admin creation (if reused)
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return badResponse({ res, message: "Email already exists", statusCode: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const deviceInfo = await getDeviceInfo(req);

    const Model = RoleModelMap[role];

    const baseData = {
      email,
      password: hashedPassword,
      name,
      profilePic: photo,
      role,
      sessions: [],
    };

    const extraData = role === 'student'
      ? { department, course, batch, rollNo,nano }
      : role === 'faculty'
        ? { department, designation, employeeId }
        : { accessLevel };

    const newUser = new Model({
      ...baseData,
      ...extraData,
    });

    // Add first session
    
    const sessionId = new mongoose.Types.ObjectId().toHexString();
    const refreshToken = generateRefreshToken({ id: newUser._id, sessionId ,role:newUser?.role});
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const accessToken = generateAccessToken({ id: newUser._id, sessionId ,role:newUser?.role});

    newUser.sessions.push({
      id: sessionId,
      refreshTokenHash,
      ...deviceInfo,
      lastUsed: new Date(),
    });

    await newUser.save();

    // Set secure cookies
    res.cookie("accessToken", accessToken, {
     httpOnly: true,
      secure:isProd,
      sameSite: isProd?'None':"Strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
       httpOnly: true,
      secure:isProd,
      sameSite: isProd?'None':"Strict",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    return goodResponse({
      res,
      message: "Registration successful",
      data: {

          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          },
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return badResponse({ res, message: err.message || "Registration failed", statusCode: 500 });
  }
};

static verifyUser=async(req,res)=>{
  try {
    const {user}=req;
    if(!user) return badResponse({res,message:"unauthorised",statusCode:401});

    return goodResponse({res,message:"verified!",data:{user}})

  } catch (error) {
    return badResponse({res,message:"server error",statusCode:500});
  }
}
static logout=async(req,res)=>{
  try {
    

  } catch (error) {
    
  }
}
  // static logoutUser = async (req, res) => {
  //   const token = req.cookies.refreshToken;
  //   const decode=await verifyRefreshToken(token);
  //   console.log(decode);
    
  //   const user = await User.findOne({ _id:decode?.id,"sessions.token": token });
  
  //   if (user) {
  //     user.sessions = user.sessions.filter((s) => s.token !== token);
  //     await user.save();
  //   }
  
  //   res.clearCookie("accessToken",{
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: "None",
  //   });
  //   res.clearCookie("refreshToken",{
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: "None",
  //   });
  
  //   goodResponse({res,statusCode:200,message:"Logged out successfully",data:{isAuthenticated:false}})
  //   // res.status(200).json({ message: "Logged out successfully" });
  // };

  static logoutUser=async (req, res) => {
        const { refreshToken } = req.cookies;
        if (!refreshToken) return res.status(401).json({ message: "No refresh token" });
        const decoded = verifyRefreshToken(refreshToken);
        const { id, sessionId } = decoded;
        if (!id || !sessionId) return res.status(401).json({ message: "Invalid token owner" });
        const admin = await User.findById(id);
        if (!admin) return res.status(401).json({ message: "Invalid token owner" });
        admin.sessions = admin.sessions.filter(s => s?.id?.toString() !== sessionId);
        await admin.save();
        res.clearCookie("refreshToken",{ httpOnly: true,
      secure:isProd,
      sameSite: isProd?'None':"Strict",});
        res.clearCookie("accessToken",{  httpOnly: true,
      secure:isProd,
      sameSite: isProd?'None':"Strict",});
        // res.json({ message: "Logged out successfully" });
        return goodResponse({ res, statusCode: 200, message: "Logged out successfully" });
}
}

export class AuthDashboard {
  // Create faculty/student
  static createUser = async (req, res) => {
    try {
      const { role } = req.body;
      const institution = req?.user?.institution?._id;
      let hashedPassword;
      if(role==="faculty") hashedPassword= await bcrypt.hash("222222", 10);else hashedPassword= await bcrypt.hash("123456", 10);
      const data={...req.body,institution,password:hashedPassword}
      if (!role || !['faculty', 'student'].includes(role)) {
        return res.status(400).json({ message: "Invalid or missing role" });
      }

      let user;
      if (role === "faculty") {
        user = await Faculty.create(data);
      } else if (role === "student") {
        user = await Student.create(data);
      }

      return res.status(201).json(user);
    } catch (error) {
      console.error("Error in createUser:", error);
      return res.status(500).json({ message: error?.message, error: error.message });
    }
  };

  // Get users
  static getUsers = async (req, res) => {
    try {
      const {role,isActive,search} = req.query;

      
      let users;
      let query={};
      if(role){
        query.role=role
      }else {

      query.role = { $ne: 'admin' };
    }
      if(isActive) query.isActive=isActive;

      if(search){

      query.$or=[
      {name:{ $regex: search, $options: 'i' },},
      {email:{ $regex: search, $options: 'i' }}
        ]
      }
      console.log(query,req.query);
      users=await User.find(query,"-password -sessions").populate([{
        path:"college",
        model:"Institution",
        select:'name code',
      },{
          path:"course",
          model:"course",
          select:'name code'
        },{
          path:"department",
           model:"Department",
          select:'name courses',
        
        },]).lean();
      // if (role === "faculty") users = await Faculty.find();
      // else if (role === "student") users = await Student.find();
      // else users = await User.find();

      return res.status(200).json(users);
    } catch (error) {
      console.error("Error in getUsers:", error);
      return res.status(500).json({ message: error?.message, error: error.message });
    }
  };

  // Update user
  static updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await User.findByIdAndUpdate(id, req.body, { new: true });

      if (!updated) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(updated);
    } catch (error) {
      console.error("Error in updateUser:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };

  // Delete user
  static deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await User.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "User deleted" });
    } catch (error) {
      console.error("Error in deleteUser:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
}






export const facultyCanManageStudent = async (req, res, next) => {
  if (req.user.role !== 'faculty') return res.status(403).json({ message: 'Only faculty can access' });

  const faculty = await Faculty.findById(req.user._id);
  const student = await Student.findById(req.params.id);

  const hasAccess = faculty.accessScope.some(scope =>
    scope.departmentId.equals(student.departmentId) &&
    scope.courses.some(course =>
      course.courseId.equals(student.courseId) &&
      course.sections.includes(student.section)
    )
  );

  if (!hasAccess) return res.status(403).json({ message: "You don't have access to this student." });

  next();
};
