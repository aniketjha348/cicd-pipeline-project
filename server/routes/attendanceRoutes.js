import express from 'express';
import { Attendance } from '../model/Attendance.js';
import { Student } from '../model/AuthModels.js';
import { verifyUserToken, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

router.use(verifyUserToken);

// Get attendance for a class/section on a date
router.get('/', async (req, res) => {
  try {
    const { classId, section, date, studentId } = req.query;
    const schoolId = req.user.institution?._id;
    
    const query = { school: schoolId };
    if (classId) query.class = classId;
    if (section) query.section = section;
    if (date) query.date = new Date(date);
    if (studentId) query.student = studentId;
    
    const attendance = await Attendance.find(query)
      .populate('student', 'name rollNo profilePic')
      .populate('markedBy', 'name')
      .sort({ date: -1 });
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance summary for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const { academicSession, month, year } = req.query;
    const query = { student: req.params.studentId };
    
    if (academicSession) query.academicSession = academicSession;
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    const attendance = await Attendance.find(query).sort({ date: 1 });
    
    const summary = {
      totalDays: attendance.length,
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      late: attendance.filter(a => a.status === 'late').length,
      halfDay: attendance.filter(a => a.status === 'half-day').length,
      records: attendance,
    };
    
    summary.percentage = summary.totalDays > 0 
      ? Math.round((summary.present / summary.totalDays) * 100 * 100) / 100 
      : 0;
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark attendance for a class (bulk)
router.post('/mark', authorizeRoles('admin', 'faculty'), async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    const { classId, section, date, academicSession, attendanceData } = req.body;
    // attendanceData: [{ studentId, status, remarks }]
    
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);
    
    const operations = attendanceData.map(data => ({
      updateOne: {
        filter: {
          student: data.studentId,
          date: attendanceDate,
        },
        update: {
          $set: {
            class: classId,
            section,
            status: data.status,
            remarks: data.remarks || '',
            markedBy: req.user._id,
            school: schoolId,
            academicSession,
          },
        },
        upsert: true,
      },
    }));
    
    await Attendance.bulkWrite(operations);
    
    res.json({ message: 'Attendance marked successfully', count: attendanceData.length });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update single attendance record
router.patch('/:id', authorizeRoles('admin', 'faculty'), async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { ...req.body, markedBy: req.user._id },
      { new: true }
    );
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get attendance report for class
router.get('/report/class/:classId', async (req, res) => {
  try {
    const { section, startDate, endDate, academicSession } = req.query;
    
    const query = { class: req.params.classId };
    if (section) query.section = section;
    if (academicSession) query.academicSession = academicSession;
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    
    const attendance = await Attendance.find(query)
      .populate('student', 'name rollNo');
    
    // Group by student
    const studentAttendance = {};
    attendance.forEach(a => {
      const studentId = a.student._id.toString();
      if (!studentAttendance[studentId]) {
        studentAttendance[studentId] = {
          student: a.student,
          present: 0,
          absent: 0,
          late: 0,
          halfDay: 0,
          total: 0,
        };
      }
      studentAttendance[studentId].total++;
      if (a.status === 'present') studentAttendance[studentId].present++;
      if (a.status === 'absent') studentAttendance[studentId].absent++;
      if (a.status === 'late') studentAttendance[studentId].late++;
      if (a.status === 'half-day') studentAttendance[studentId].halfDay++;
    });
    
    const report = Object.values(studentAttendance).map(s => ({
      ...s,
      percentage: s.total > 0 ? Math.round((s.present / s.total) * 100) : 0,
    }));
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get students for attendance marking
router.get('/students/:classId/:section', async (req, res) => {
  try {
    const { date } = req.query;
    const students = await Student.find({
      class: req.params.classId,
      section: req.params.section,
      isActive: true,
    }).select('name rollNo profilePic');
    
    // If date provided, get existing attendance
    let existingAttendance = {};
    if (date) {
      const attendanceDate = new Date(date);
      attendanceDate.setHours(0, 0, 0, 0);
      
      const records = await Attendance.find({
        class: req.params.classId,
        section: req.params.section,
        date: attendanceDate,
      });
      
      records.forEach(r => {
        existingAttendance[r.student.toString()] = r.status;
      });
    }
    
    const result = students.map(s => ({
      ...s.toObject(),
      currentStatus: existingAttendance[s._id.toString()] || null,
    }));
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
