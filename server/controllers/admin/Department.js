// controllers/admin/createDepartment.ts
import mongoose from 'mongoose';
import { Institution } from '../../model/AuthModels.js';
import { Course, Department } from '../../model/institudeModel.js';
import { badResponse, goodResponse } from '../../utils/response.js';
import { isEmpty } from '../../utils/validate.js';

export class DepartmentController {
  static createDepartment = async (req, res) => {
    try {
      let { collegeId, universityId,name,shortName,headOfDepartment ,...other } = req.body;
      universityId=""
      const {user}=req;
      if (!collegeId || !name || !shortName ) {
        return badResponse({ res, message: 'All required fields must be provided' })
      }
       universityId=user?.institution?._id
    
      const type = universityId ? "college" : "university";

      const existing = await Department.findOne({ collegeId, shortName });
      if (existing) {
        return goodResponse({ res, message: "Department with this short name already exists in the college", statusCode: 409 })
      }

      console.log(universityId);

      const department = await Department({
        collegeId,
        name,
        shortName,
        type,
        createdBy: req.user?._id || null,
        universityId,
        ...other
        // assumes you’ve middleware that populates req.user
      });
console.log(department);

      if (department) {
        try {
          await Institution.findOneAndUpdate(
            { _id: department?.collegeId, },
            { $addToSet: { departments: department._id } },
            { new: true }
          );
          await department.save();
        } catch (error) {
          return badResponse({ res, error, message: error.message });
        }
      }


      return goodResponse({ res, message: `${name} has been added.` })
    } catch (error) {
      console.error('Error creating department:', error);
      return badResponse({ res, message: error?.message, statusCode: 500 });
      // res.status(500).json({ message: 'Internal server error' });
    }
  };
  static getDepartment = async (req, res) => {
    try {
      const {user}=req;
      const {search,departmentId}=req.query;
      console.log(req.query,req.param);
      
      const id=user?.institution?._id ;
    if(!(id) )  return res.status(400).json({ message: 'Invalid institution ID' });

       const query = {
        // universityId: id,
        $or: []
      };

      if (!isEmpty(departmentId)) {
        query.$or = [
          { _id: departmentId }
        ]; 
      } else if (search) {
        // If search is provided → search by name/code (case-insensitive)
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { shortName: { $regex: search, $options: 'i' } }
        ];
      } else {
        delete query.$or;
      }

      console.log(query,search,"hjjghgggggggggg");
      
      const department = await Department.find(query).populate([
  { path: 'collegeId' },
  { path: 'courses' }
]);
      console.log(department);

      if (!department || department.length <= 0) return badResponse({ res, message: "user not fount!",data: { department:[] }  })

      return goodResponse({ res, message: "Department founded.", data: { department } })
    } catch (error) {
      console.error('Error creating department:', error);
      return badResponse({ res, message: error?.message, statusCode: 500 });
    }
  }
static deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query; // "disable" or "delete"

    if (!id) {
      return res.status(400).json({ message: "Department ID is required" });
    }

    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    if (type === "disable") {
      // SOFT DELETE (isActive: false)
      department.isActive = false;
      await department.save();

      await Course.updateMany(
        { _id: { $in: department.courses } },
        { $set: { isActive: false } }
      );

      return res.status(200).json({ message: "Department and courses disabled (soft delete)" });
    } else if (type === "delete") {
      // HARD DELETE (remove from DB)
      await Course.deleteMany({ _id: { $in: department.courses } });
      await Department.findByIdAndDelete(id);

      return res.status(200).json({ message: "Department and courses deleted (hard delete)" });
    } else {
      return res.status(400).json({ message: "Invalid delete type. Use 'disable' or 'delete'" });
    }
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



  static getInstitutionDetails = async (req, res) => {
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
            // select: "name",,
            populate:{
              path:"courses",
            },
            options: { sort: { name: 1 } }
          }).lean();
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

}
