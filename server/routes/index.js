import express from 'express';
import adminRoute from './adminRoutes.js';
import authRoute from './authRoutes.js';

// School ERP Routes
import academicSessionRoutes from './academicSessionRoutes.js';
import classRoutes from './classRoutes.js';
import subjectRoutes from './subjectRoutes.js';
import attendanceRoutes from './attendanceRoutes.js';
import feeRoutes from './feeRoutes.js';
import examRoutes from './examRoutes.js';
import timetableRoutes from './timetableRoutes.js';

const router = express.Router();

// Auth routes
router.use("/auth", authRoute);

// Admin routes (existing)
router.use("/admin", adminRoute);

// School ERP routes
router.use("/academic-sessions", academicSessionRoutes);
router.use("/classes", classRoutes);
router.use("/subjects", subjectRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/fees", feeRoutes);
router.use("/exams", examRoutes);
router.use("/timetable", timetableRoutes);

export default router;