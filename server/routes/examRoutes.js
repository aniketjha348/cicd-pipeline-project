import express from 'express';
import { Exam, Result } from '../model/Exam.js';
import { Student } from '../model/AuthModels.js';
import { verifyUserToken, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

router.use(verifyUserToken);

// ============ EXAM ROUTES ============

// Get all exams
router.get('/', async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    const { classId, academicSession, status } = req.query;
    
    const query = { school: schoolId };
    if (classId) query.class = classId;
    if (academicSession) query.academicSession = academicSession;
    if (status) query.status = status;
    
    const exams = await Exam.find(query)
      .populate('class', 'name')
      .populate('academicSession', 'name')
      .populate('subjects.subject', 'name code')
      .sort({ startDate: -1 });
    
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single exam
router.get('/:id', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('class', 'name sections')
      .populate('academicSession', 'name')
      .populate('subjects.subject', 'name code');
    
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create exam
router.post('/', authorizeRoles('admin'), async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    const exam = new Exam({
      ...req.body,
      school: schoolId,
    });
    await exam.save();
    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update exam
router.patch('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update exam status
router.patch('/:id/status', authorizeRoles('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete exam
router.delete('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    // Also delete associated results
    await Result.deleteMany({ exam: req.params.id });
    res.json({ message: 'Exam deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ RESULT ROUTES ============

// Get results for an exam
router.get('/:examId/results', async (req, res) => {
  try {
    const { section } = req.query;
    const query = { exam: req.params.examId };
    if (section) query.section = section;
    
    const results = await Result.find(query)
      .populate('student', 'name rollNo profilePic')
      .populate('marks.subject', 'name code')
      .sort({ rank: 1 });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get result for a student
router.get('/results/student/:studentId', async (req, res) => {
  try {
    const { academicSession, examId } = req.query;
    const query = { student: req.params.studentId };
    if (academicSession) query.academicSession = academicSession;
    if (examId) query.exam = examId;
    
    const results = await Result.find(query)
      .populate('exam', 'name examType')
      .populate('marks.subject', 'name code')
      .sort({ createdAt: -1 });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enter marks for a student
router.post('/:examId/results', authorizeRoles('admin', 'faculty'), async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    const exam = await Exam.findById(req.params.examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    const { studentId, section, marks } = req.body;
    
    // Check if result already exists
    let result = await Result.findOne({
      student: studentId,
      exam: req.params.examId,
    });
    
    if (result) {
      // Update existing
      result.marks = marks;
      await result.save();
    } else {
      // Create new
      result = new Result({
        student: studentId,
        exam: req.params.examId,
        class: exam.class,
        section,
        school: schoolId,
        academicSession: exam.academicSession,
        marks,
      });
      await result.save();
    }
    
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Bulk enter marks
router.post('/:examId/results/bulk', authorizeRoles('admin', 'faculty'), async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    const exam = await Exam.findById(req.params.examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    const { results } = req.body;
    // results: [{ studentId, section, marks: [{ subject, marksObtained, maxMarks, passingMarks }] }]
    
    const operations = results.map(r => ({
      updateOne: {
        filter: { student: r.studentId, exam: req.params.examId },
        update: {
          $set: {
            class: exam.class,
            section: r.section,
            school: schoolId,
            academicSession: exam.academicSession,
            marks: r.marks,
          },
        },
        upsert: true,
      },
    }));
    
    await Result.bulkWrite(operations);
    
    // Recalculate all results
    const allResults = await Result.find({ exam: req.params.examId });
    for (const result of allResults) {
      await result.save(); // Triggers pre-save hook
    }
    
    res.json({ message: 'Results saved', count: results.length });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Calculate and publish rankings
router.post('/:examId/results/publish', authorizeRoles('admin'), async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.examId,
      { status: 'results-declared' },
      { new: true }
    );
    
    // Get all results for this exam, grouped by section
    const results = await Result.find({ exam: req.params.examId }).sort({ percentage: -1 });
    
    // Calculate overall rank
    let rank = 1;
    for (const result of results) {
      result.rank = rank++;
      result.publishedAt = new Date();
    }
    
    // Calculate section ranks
    const sectionResults = {};
    results.forEach(r => {
      if (!sectionResults[r.section]) {
        sectionResults[r.section] = [];
      }
      sectionResults[r.section].push(r);
    });
    
    for (const section in sectionResults) {
      let sectionRank = 1;
      sectionResults[section]
        .sort((a, b) => b.percentage - a.percentage)
        .forEach(r => {
          r.sectionRank = sectionRank++;
        });
    }
    
    // Save all
    await Promise.all(results.map(r => r.save()));
    
    res.json({ message: 'Results published', count: results.length });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get exam statistics
router.get('/:examId/statistics', async (req, res) => {
  try {
    const results = await Result.find({ exam: req.params.examId });
    
    if (results.length === 0) {
      return res.json({ message: 'No results found' });
    }
    
    const stats = {
      totalStudents: results.length,
      passed: results.filter(r => r.isPassed).length,
      failed: results.filter(r => !r.isPassed).length,
      highestPercentage: Math.max(...results.map(r => r.percentage)),
      lowestPercentage: Math.min(...results.map(r => r.percentage)),
      averagePercentage: Math.round(
        results.reduce((sum, r) => sum + r.percentage, 0) / results.length * 100
      ) / 100,
      gradeDistribution: {},
    };
    
    // Grade distribution
    results.forEach(r => {
      stats.gradeDistribution[r.grade] = (stats.gradeDistribution[r.grade] || 0) + 1;
    });
    
    stats.passPercentage = Math.round((stats.passed / stats.totalStudents) * 100 * 100) / 100;
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
