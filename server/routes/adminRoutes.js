import express from 'express'
import { authorizeRoles, verifyUserToken } from '../middlewares/auth.js';
import {  DepartmentController } from '../controllers/admin/Department.js';
import { Faculty } from '../controllers/admin/Faculty.js';
import CollegeController from '../controllers/admin/Institution.js'
const adminRoute=express.Router();

import CourseController from '../controllers/admin/Courses.js'
import { AuthDashboard } from '../controllers/Auth.js';
adminRoute.use(verifyUserToken,authorizeRoles('admin'));


adminRoute.route("/users").post(AuthDashboard.createUser).get(AuthDashboard.getUsers);
adminRoute.route("/users/:id").patch(AuthDashboard.updateUser).delete(AuthDashboard.deleteUser);
// Faculty manage routes
adminRoute
  .route("/users/faculty/scope")
  .post(Faculty.addAccessScope) 



//  All static routes first
adminRoute.get('/colleges/departments', DepartmentController.getDepartment);
adminRoute.delete('/colleges/departments/:id', DepartmentController.deleteDepartment);
adminRoute.post('/colleges/departments/add', DepartmentController.createDepartment);
adminRoute.post("/faculty/add", Faculty.createFaculty);

//  Dynamic search route LAST
adminRoute.get('/colleges/search',DepartmentController.getInstitutionDetails);
adminRoute.post('/colleges/add', CollegeController.create);       
adminRoute.get('/colleges', CollegeController.getInstitutionDetails);         
adminRoute.route('/colleges/c1/:id').get(CollegeController.getById).put( CollegeController.update).delete(CollegeController.deleteColleges);

// courses 
adminRoute
  .route("/college/department/course")
  .post(CourseController.create)  

adminRoute
  .route("/college/department/course/search").post(CourseController.getAll);  

adminRoute
  .route("/college/department/course/:id")
  .get(CourseController.getOne)  
  .put(CourseController.update).delete( CourseController.delete);  




export default adminRoute