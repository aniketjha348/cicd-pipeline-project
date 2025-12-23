
import { Institution } from '../../model/AuthModels.js';
import mongoose from 'mongoose';
import { badResponse, goodResponse } from '../../utils/response.js';
import { Course, Department } from '../../model/institudeModel.js';

class CollegeController {
  // 📌 Create College
  static async create(req, res) {
    try {
      const { name, code, address, email, phone, website, logoUrl } = req.body;
      const {user}=req;
      console.log(req.body);
      
      let type="college";
      let universityId="";
      if(user && user?.institution?._id){
        universityId=user?.institution?._id;
        console.log(universityId);
        
      }
  
      if (!universityId || !mongoose.Types.ObjectId.isValid(universityId)) {
        return badResponse({
          res,
          message: 'Valid universityId is required for a college',
        });
      }
          if(await Institution.findOne({universityId,code,})){
            return badResponse({
          res,
          message:  `College already exist in your ${user?.institution?.name} records.`,
        });
          }


      const newCollege = await Institution({
        name,
        code,
        address:{
          line1:address
        },
        email,
        phone,
        website,
        logoUrl,
        type,
        universityId,
        createdBy: req.user?._id || null,
      });

        
   if (newCollege.type === 'college' && newCollege.universityId) {
    try {
       await Institution.findOneAndUpdate(
    { _id: newCollege.universityId, type: 'university' },
    { $addToSet: { collegeIds: newCollege._id } },
    { new: true }
  );

  await newCollege.save();

    } catch (error) {
      return badResponse({ res, error, message: error.message });
    }
 

}
      return goodResponse({
        res,
        message: 'College created successfully',
        data: { college: newCollege },
      });
    } catch (error) {
      return badResponse({ res, error, message: error.message });
    }
  }

  // 📌 Get All Colleges
  static getInstitutionDetails=async(req, res)=>{
    try {
      const { search = '', searchType = "deep", collegeId } = req.query;
      const { user } = req
      let colleges;
      const id = user?.institution?._id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid institution ID' });
      }
console.log(search,searchType,collegeId,isEmpty(collegeId));

      const institution = await Institution.findById(id);

      if (!institution) {
        return res.status(404).json({ message: 'Institution not found' });
      }
      const query = {
        universityId: id,
        $or: []
      };

      if (!isEmpty(collegeId)) {
        query.$or = [
          { _id: collegeId }
        ];
      } else if (!isEmpty(search)) {

        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } }
        ];
      } else {
        delete query.$or;
      }
      if (institution.type === 'university') {

        if (searchType === "deep") {
          colleges = await Institution.find(query).populate({
            path: "departments",
            match: { isActive: true },
            // select: "name",
            options: { sort: { name: 1 } }
          })
        }
        else {

          colleges = await Institution.find(query)
        }
        // console.log(colleges);


        return res.status(200).json({
          type: 'university',
          university: institution,
          colleges,
        });
      }

      // 👉 If it's a college, fetch linked university details
      if (institution.type === 'college') {
        const university = await Institution.findById(institution.universityId);

        return res.status(200).json({
          type: 'college',
          college: institution,
          university: university || null,
        });
      }

      return res.status(400).json({ message: 'Invalid institution type' });

    } catch (error) {
      console.error('Error fetching institution:', error?.message);
      return res.status(500).json({ message: 'Server error' });
    }
  };

  // 📌 Get College by ID
 static async getById(req, res) {
    try {
      const { id } = req.params;

      const college = await Institution.findOne({ _id: id, type: 'college' }).populate('universityId', 'name code');

      if (!college) {
        return badResponse({ res, statusCode: 404, message: 'College not found' });
      }

      return goodResponse({
        res,
        message: 'College fetched successfully',
        data: { college },
      });
    } catch (error) {
      return badResponse({ res, error, message: error.message });
    }
  }

  // 📌 Update College
  static async update(req, res) {
    try {
      const { id } = req.params;

      const updated = await Institution.findOneAndUpdate(
        { _id: id, type: 'college' },
        req.body,
        { new: true }
      );

      if (!updated) {
        return badResponse({ res, statusCode: 404, message: 'College not found' });
      }

      return goodResponse({
        res,
        message: 'College updated successfully',
        data: { college: updated },
      });
    } catch (error) {
      return badResponse({ res, error, message: error.message });
    }
  }

  // 📌 Delete College

static async deleteColleges(req, res) {
  try {
    const { id } = req.params;
    const { type } = req.query;

    const institution = await Institution.findById(id);
    if (!institution) {
      return res.status(404).json({ message: 'Institution not found' });
    }

    const departments = await Department.find({ collegeId: id }, '_id courses').lean();
    const departmentIds = departments.map(d => d._id);
    const courseIds = departments.flatMap(d => d.courses || []);

    if (type === 'disable') {
      if (courseIds.length > 0) {
        await Course.updateMany({ _id: { $in: courseIds } }, { $set: { isActive: false } });
      }

      if (departmentIds.length > 0) {
        await Department.updateMany({ _id: { $in: departmentIds } }, { $set: { isActive: false } });
      }

      await Institution.findByIdAndUpdate(id, { isActive: false });

    } else {
      if (courseIds.length > 0) {
        await Course.deleteMany({ _id: { $in: courseIds } });
      }

      if (departmentIds.length > 0) {
        await Department.deleteMany({ _id: { $in: departmentIds } });
      }

      if (institution.type === 'university') {
        await Institution.updateMany({ universityId: id }, { $unset: { universityId: "" } });
      }

      await Institution.findByIdAndDelete(id);
    }

    return res.status(200).json({
      message: type === 'disable'
        ? 'Institution and related data disabled successfully'
        : 'Institution and related data deleted successfully'
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


}


export default  CollegeController;
