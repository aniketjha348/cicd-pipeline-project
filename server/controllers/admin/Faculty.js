import mongoose from "mongoose";
import { Faculty as FacultyUser } from "../../model/AuthModels.js";
import { Department } from "../../model/institudeModel.js";
import { badResponse, goodResponse } from "../../utils/response.js";
import bcrypt from 'bcrypt';


export class Faculty{

  
static normalizeAccessScope = (input = []) => {
  return input.map(scope => ({
    collegeId: new mongoose.Types.ObjectId(scope.collegeId),
    collegeName: scope.collegeName,
    departments: scope.departments?.map(dept => ({
      departmentId: new mongoose.Types.ObjectId(dept.departmentId),
      departmentName: dept.departmentName,
      courses: dept.courses?.map(course => ({
        courseId: new mongoose.Types.ObjectId(course.courseId),
        courseName: course.courseName,
        batchAccess: course.batchAccess || []
      }))
    }))
  }));
};

static    createFaculty = async (req, res) => {
  try {
    let {
      email,
      name,
      password,
      institutionId,
      designation,
      employeeId,
      accessScope // [{ departmentId, courses: [{ courseId, sections: ['A', 'B'] }] }]
    } = req.body;
  
    const {user}=req;
    // console.log("\n\n",user,"\n\n");
    institutionId=institutionId ?? user?.institution?._id

    
    // Check for duplicate email
    const existing = await FacultyUser.findOne({ email });
    if (existing) {
      return badResponse({ res, message: "Faculty with this email already exists." });
    }

    // Validate departments and courses
    for (const access of accessScope) {
      const department = await Department.findById(access.departmentId);
      if (!department) {
        return badResponse({ res, message: `Invalid department ID: ${access.departmentId}` });
      }

      for (const courseAccess of access.courses) {
        const course = department.courses.id(courseAccess.courseId);
        if (!course) {
          return badResponse({ res, message: `Invalid course ID: ${courseAccess.courseId}` });
        }

        const invalidSections = courseAccess.sections.filter(
        
          
        //   section => !course.sections.some(s =>{
        //     console.log(s,section,s._id.toHexString() === section);
             
        //     s._id.toHexString() === section})
        // );
         section => !course.sections.some(s =>  s._id.toHexString() === section)
        );
        if (invalidSections.length > 0) {
          return badResponse({ res, message: `Invalid section(s): ${invalidSections.join(', ')}` });
        }
      }
    }

       const hashedPassword = await bcrypt.hash(password, 10);
    // Create faculty user
    const faculty = new FacultyUser({
      email,
      password:hashedPassword, // hash in real app
      name,
      institution: institutionId,
      role: 'faculty',
      designation,
      employeeId,
      accessScope
    });

    await faculty.save();

    return goodResponse({ res, message: 'Faculty created successfully', data: { faculty } });
  } catch (err) {
    console.error(err);
    return badResponse({ res, message: 'Failed to create faculty', error: err });
  }
};


static addAccessScope = async (req, res) => {
  try {
    const { id:facultyId, scope:accessScope } = req.body;

    const faculty = await FacultyUser.findById(facultyId);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });

    const newScopeMap = new Map();

    // Prepare new scope as Map for fast lookup
    for (const scope of accessScope) {
      newScopeMap.set(scope.collegeId.toString(), scope);
    }

    const updatedScope = [];

    for (const [collegeId, newCollege] of newScopeMap.entries()) {
      const existingCollege = faculty.accessScope.find(
        c => c.collegeId.toString() === collegeId
      );

      if (!existingCollege) {
        // Add new college completely
        updatedScope.push(newCollege);
      } else {
        // Sync departments
        const newDepartmentsMap = new Map();
        newCollege.departments.forEach(dept =>
          newDepartmentsMap.set(dept.departmentId.toString(), dept)
        );

        const syncedDepartments = [];

        for (const [deptId, newDept] of newDepartmentsMap.entries()) {
          const existingDept = existingCollege.departments.find(
            d => d.departmentId.toString() === deptId
          );

          if (!existingDept) {
            syncedDepartments.push(newDept); // add new department
          } else {
            // Sync courses
            const newCoursesMap = new Map();
            newDept.courses.forEach(c => newCoursesMap.set(c.courseId.toString(), c));

            const syncedCourses = [];

            for (const [courseId, newCourse] of newCoursesMap.entries()) {
              const existingCourse = existingDept.courses.find(
                c => c.courseId.toString() === courseId
              );

              if (!existingCourse) {
                syncedCourses.push(newCourse);
              } else {
                // Sync batchAccess
                const syncedBatches = newCourse.batchAccess.map(batch => {
                  const existingBatch = existingCourse.batchAccess.find(
                    b => b.batchYear === batch.batchYear
                  );

                  if (!existingBatch) return batch;

                  // Sync sections
                  return {
                    batchYear: batch.batchYear,
                    sections: batch.sections,
                  };
                });

                syncedCourses.push({
                  courseId: newCourse.courseId,
                  courseName: newCourse.courseName,
                  batchAccess: syncedBatches,
                });
              }
            }

            syncedDepartments.push({
              departmentId: newDept.departmentId,
              departmentName: newDept.departmentName,
              courses: syncedCourses,
            });
          }
        }

        updatedScope.push({
          collegeId: newCollege.collegeId,
          collegeName: newCollege.collegeName,
          departments: syncedDepartments,
        });
      }
    }

    // ✅ Set the entire accessScope to the new structure
    faculty.accessScope = updatedScope;
    faculty.hasAccess="active"
    await faculty.save();

    return res.status(200).json({ message: "Access scope updated successfully" });

  } catch (error) {
    console.error("AccessScope Sync Error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};


// static addAccessScope = async (req, res) => {
//   try {
//     const { id:facultyId, scope:accessScope } = req.body;
//     console.log(req.body);
    
// const scope = this.normalizeAccessScope(accessScope);

// console.log(scope[0]?.departments);

//     if (!facultyId || !accessScope) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const faculty = await FacultyUser.findById(facultyId);
//     if (!faculty) return res.status(404).json({ message: "Faculty not found" });

//     faculty.accessScope.push(accessScope);
//     await faculty.save();

//     res.status(200).json({ message: "Access scope added successfully", data: faculty });
//   } catch (err) {
//     console.log(err);
    
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
static updateAccessScope = async (req, res) => {
  try {
    const { facultyId, scopeIndex } = req.params;
    const updatedScope = req.body;

    const faculty = await Faculty.findById(facultyId);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });

    if (!faculty.accessScope[scopeIndex]) {
      return res.status(404).json({ message: "Access scope not found" });
    }

    faculty.accessScope[scopeIndex] = updatedScope;
    await faculty.save();

    res.status(200).json({ message: "Access scope updated", data: faculty.accessScope });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

static deleteAccessScope = async (req, res) => {
  try {
    const { facultyId, scopeIndex } = req.params;

    const faculty = await Faculty.findById(facultyId);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });

    if (!faculty.accessScope[scopeIndex]) {
      return res.status(404).json({ message: "Access scope not found" });
    }

    faculty.accessScope.splice(scopeIndex, 1);
    await faculty.save();

    res.status(200).json({ message: "Access scope deleted", data: faculty.accessScope });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


static setAccessPermissionAndStatus = async (req, res) => {
  try {
    const { facultyId, scopeIndex } = req.params;
    const { level, departmentIndex, courseIndex, batchIndex, sectionIndex, permissions, status } = req.body;

    const faculty = await Faculty.findById(facultyId);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });

    const scope = faculty.accessScope[scopeIndex];
    if (!scope) return res.status(404).json({ message: "AccessScope not found" });

    let target;

    switch (level) {
      case 'college':
        if (permissions) scope.collegePermissions = permissions;
        if (status) scope.status = status;
        break;

      case 'department':
        target = scope.departments?.[departmentIndex];
        if (!target) return res.status(404).json({ message: "Department not found" });
        if (permissions) target.departmentPermissions = permissions;
        if (status) target.status = status;
        break;

      case 'course':
        target = scope.departments?.[departmentIndex]?.courses?.[courseIndex];
        if (!target) return res.status(404).json({ message: "Course not found" });
        if (permissions) target.coursePermissions = permissions;
        if (status) target.status = status;
        break;

      case 'batch':
        target = scope.departments?.[departmentIndex]?.courses?.[courseIndex]?.batchAccess?.[batchIndex];
        if (!target) return res.status(404).json({ message: "Batch not found" });
        if (permissions) target.batchPermissions = permissions;
        if (status) target.status = status;
        break;

      case 'section':
        target = scope.departments?.[departmentIndex]?.courses?.[courseIndex]?.batchAccess?.[batchIndex]?.sections?.[sectionIndex];
        if (!target) return res.status(404).json({ message: "Section not found" });
        if (permissions) target.sectionPermissions = permissions;
        if (status) target.status = status;
        break;

      default:
        return res.status(400).json({ message: "Invalid level specified" });
    }

    await faculty.save();
    res.status(200).json({ message: `${level} permission/status updated`, data: faculty.accessScope[scopeIndex] });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



}