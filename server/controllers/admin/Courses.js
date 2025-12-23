
import { courseSchema } from "../../model/Zod.schema.js";


import deepEqual from "fast-deep-equal"; 
import { ZodError } from "zod";
import { Course, Department } from "../../model/institudeModel.js";
import { badResponse } from "../../utils/response.js";

class CourseController {

  async create(req, res, next) {
    try {
      const validated = courseSchema.parse(req.body);
      if(await Course.findOne({collegeId:validated?.collegeId,departmentId:validated?.departmentId,universityId:validated?.universityId,code:validated.code,name:validated?.name})) return badResponse({res,message:`${validated?.name} course already exist.`})
      const course = await Course(validated);
    if(await Department.findOneAndUpdate({_id:validated?.departmentId},{

      $addToSet:{
        courses:course?._id
      }
    },{new:true})){
      await course.save()
    }else{
      return badResponse({ res, error, message: error.message });
    }
      res.status(201).json({ success: true, course });
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ success: false, message: err.errors });
      }
      console.log(err);
      
      return badResponse({res,message:err?.message,statusCode:500})
    }
  }

  async getAll(req, res){
  try {
    const {
      collegeId,
      departmentId,
      batchYear,
      name,
      code,
      programType,
      search
    } = req.body;
    console.log(req.body);
    
    const universityId="";
    const query = {};

     if (collegeId) query.collegeId = collegeId;
    if (universityId) query.universityId = universityId;
    if (departmentId) query.departmentId = departmentId;
    if (programType) query.programType = programType;
    if (batchYear) query['batches.batchYear'] = Number(batchYear);
    if (name) query.name = { $regex: name, $options: 'i' };
    if (code) query.code = { $regex: code, $options: 'i' };


    if(search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { programType: { $regex: search, $options: 'i' } },
        {
          'batches.batchYear': !isNaN(search) ? Number(search) : undefined,
        },
      ]
      // .filter(condition => {
      //   // filter out undefined values (e.g., NaN batchYear)
      //   console.log(condition,"condition");
        
      //   return !Object.values(condition)[0]?.$regex === undefined &&
      //          !Object.values(condition)[0] === undefined;
      // });
    }
    console.log(query);
    const courses = await Course.find(query)
      .populate('departmentId', 'name')
      .populate('collegeId', 'name')
      .populate('universityId', 'name')
      .populate('batches.years.sections.classTeacherId', 'name email');

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error('Error in getFilteredCourses:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

  async getOne(req, res, next) {
    try {
      const course = await Course.findById(req.params.id).populate("collegeId departmentId universityId");
      if (!course) return res.status(404).json({ success: false, message: "Course not found" });
      res.json({ success: true, course });
    } catch (err) {
      next(err);
    }
  }

async update(req, res, next) {
  try {
    const courseId = req.params.id;
    const updatedData = req.body;

    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const fieldsToUpdate = {};

    // Compare top-level fields
    const keysToCompare = [
      "name",
      "departmentId",
      "collegeId",
      "universityId",
      "duration",
      "description",
      "programType",
    ];

    for (const key of keysToCompare) {
      if (updatedData[key] !== undefined && updatedData[key] !== existingCourse[key]?.toString()) {
        fieldsToUpdate[key] = updatedData[key];
      }
    }

    // Deep compare for batches (array of objects)
    if (
      updatedData.batches &&
      !deepEqual(updatedData.batches, existingCourse.batches)
    ) {
      fieldsToUpdate.batches = updatedData.batches;
    }

    // If no changes, return early
    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(200).json({ success: true, message: "No changes detected" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(courseId, fieldsToUpdate, {
      new: true,
    });

    res.json({ success: true, message: "Course updated", course: updatedCourse });
  } catch (err) {
    next(err);
  }
}

async delete(req, res, next) {
    try {
      const course = await Course.findByIdAndDelete(req.params.id);
      if (!course) return res.status(404).json({ success: false, message: "Course not found" });
      res.json({ success: true, message: "Course deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}

export default new CourseController();
