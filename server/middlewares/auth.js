// middleware/verifyUserToken.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
// import { User } from '../models/User.js';
const isProd= process.env.NODE_ENV === 'production';
import { generateAccessToken as createAccessToken, generateRefreshToken as createRefreshToken } from '../utils/jwt.utils.js';
import { badResponse } from '../utils/response.js';
import { User } from '../model/AuthModels.js';
import { getDeviceInfo } from '../controllers/Auth.js';

export const updateRefreshToken = async (req, decoded, token) => {
  try {
    const { id, sessionId } = decoded;

    if (!id || !sessionId) throw new Error("Invalid token owner");

    const user = await User.findById(id);
    if (!user) throw new Error("Invalid token owner");

    const unUsedSessionLimit = 15 * 24 * 60 * 60 * 1000; // 15 days
    const now = Date.now();
    const deviceInfo = await getDeviceInfo(req);

    const session = user.sessions.find(s => s?.id?.toString() === sessionId);
    if (!session) throw new Error("Session not found");

    if (session.ip !== deviceInfo.ip || session.userAgent !== deviceInfo.userAgent) {
      throw new Error("Unauthorized: Device mismatch");
    }

    const isValid = await bcrypt.compare(token, session.refreshTokenHash);
    if (!isValid) throw new Error("Invalid refresh token");

    // Generate new session id & tokens
    const newSessionId = new mongoose.Types.ObjectId().toHexString();
    const newRefreshToken = createRefreshToken({ id: user._id, sessionId: newSessionId ,role:user?.role});
    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
    const newAccessToken = createAccessToken({ id: user._id, sessionId: newSessionId ,role:user?.role});

    // Remove old session and expired sessions
    user.sessions = user.sessions.filter(
      s => now - new Date(s.lastUsed).getTime() < unUsedSessionLimit && s?.id?.toString() !== sessionId
    );

    // Add new session with updated device info and lastUsed timestamp
    user.sessions.push({
      id: newSessionId,
      refreshTokenHash: newRefreshTokenHash,
      ...deviceInfo,
      lastUsed: new Date(),
      location: session.location || {}
    });

    await user.save();

    // Attach new tokens to req for cookie setting
    req.newAccessToken = newAccessToken;
    req.newRefreshToken = newRefreshToken;

    return { user, decoded: { id: user._id, sessionId: newSessionId } };
  } catch (err) {
    throw err;
  }
};

export const verifyUserToken = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.cookies;

    if (!refreshToken && !accessToken) {
      return badResponse({ res, message: "No token provided", statusCode: 401 });
    }

    let decoded;
    let user;

    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (accessErr) {
      // if (accessErr.name !== 'TokenExpiredError') {
      //   return badResponse({ res, message: "Invalid access token", statusCode: 403 });
      // }

      try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const result = await updateRefreshToken(req, decoded, refreshToken);
        user = result.user;
        decoded = result.decoded;
      } catch (refreshErr) {
        return badResponse({ res, message: refreshErr.message || "Unauthorized: Invalid or expired refresh token", statusCode: 401 });
      }
    }

    // if (!user) {

      // console.log(decoded,"decode");
      // if(decoded?.role=="admin"){
        user = await User.findById(decoded.id).select('-password').populate("institution");   
        // console.log(user);
        
      // }
      if (!user) {
        return badResponse({ res, message: "User not found", statusCode: 401 });
      }
    // }

    req.user = user;
    req.decoded = decoded;

    if (req.newAccessToken && req.newRefreshToken) {
      res.cookie("accessToken", req.newAccessToken, {
        httpOnly: true,
      secure:isProd,
      sameSite: isProd?'None':"Strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      res.cookie("refreshToken", req.newRefreshToken, {
         httpOnly: true,
      secure:isProd,
      sameSite: isProd?'None':"Strict",
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      });
    }

    next();
  } catch (err) {
    console.error("Token verification failed", err);
    return badResponse({ res, message: "Unauthorized", statusCode: 401 });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Role not allowed" });
    }
    next();
  };
};