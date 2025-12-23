import express from 'express';
import { Timetable } from '../model/Timetable.js';
import { verifyUserToken, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

router.use(verifyUserToken);

// Get timetable for a class/section
router.get('/', async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    const { classId, section, academicSession } = req.query;
    
    const query = { school: schoolId, isActive: true };
    if (classId) query.class = classId;
    if (section) query.section = section;
    if (academicSession) query.academicSession = academicSession;
    
    const timetables = await Timetable.find(query)
      .populate('class', 'name')
      .populate('academicSession', 'name')
      .populate('schedule.periods.subject', 'name code')
      .populate('schedule.periods.teacher', 'name');
    
    res.json(timetables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get timetable for a teacher
router.get('/teacher/:teacherId', async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    const { academicSession } = req.query;
    
    const query = {
      school: schoolId,
      isActive: true,
      'schedule.periods.teacher': req.params.teacherId,
    };
    if (academicSession) query.academicSession = academicSession;
    
    const timetables = await Timetable.find(query)
      .populate('class', 'name')
      .populate('schedule.periods.subject', 'name code');
    
    // Extract only periods for this teacher
    const teacherSchedule = [];
    timetables.forEach(tt => {
      tt.schedule.forEach(day => {
        day.periods.forEach(period => {
          if (period.teacher?.toString() === req.params.teacherId) {
            teacherSchedule.push({
              day: day.day,
              class: tt.class,
              section: tt.section,
              ...period.toObject(),
            });
          }
        });
      });
    });
    
    res.json(teacherSchedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single timetable
router.get('/:id', async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id)
      .populate('class', 'name')
      .populate('academicSession', 'name')
      .populate('schedule.periods.subject', 'name code')
      .populate('schedule.periods.teacher', 'name profilePic');
    
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create timetable
router.post('/', authorizeRoles('admin'), async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    
    // Deactivate existing timetable for same class/section
    await Timetable.updateMany(
      {
        school: schoolId,
        class: req.body.class,
        section: req.body.section,
        academicSession: req.body.academicSession,
      },
      { isActive: false }
    );
    
    const timetable = new Timetable({
      ...req.body,
      school: schoolId,
    });
    await timetable.save();
    res.status(201).json(timetable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update timetable
router.patch('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    res.json(timetable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update specific day schedule
router.patch('/:id/day/:day', authorizeRoles('admin'), async (req, res) => {
  try {
    const { periods } = req.body;
    const timetable = await Timetable.findById(req.params.id);
    
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    
    const dayIndex = timetable.schedule.findIndex(s => s.day === req.params.day);
    if (dayIndex === -1) {
      timetable.schedule.push({ day: req.params.day, periods });
    } else {
      timetable.schedule[dayIndex].periods = periods;
    }
    
    await timetable.save();
    res.json(timetable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete timetable
router.delete('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.json({ message: 'Timetable deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Copy timetable to another section
router.post('/:id/copy', authorizeRoles('admin'), async (req, res) => {
  try {
    const { targetSection } = req.body;
    const schoolId = req.user.institution?._id;
    
    const source = await Timetable.findById(req.params.id);
    if (!source) {
      return res.status(404).json({ message: 'Source timetable not found' });
    }
    
    // Deactivate existing
    await Timetable.updateMany(
      {
        school: schoolId,
        class: source.class,
        section: targetSection,
        academicSession: source.academicSession,
      },
      { isActive: false }
    );
    
    const newTimetable = new Timetable({
      class: source.class,
      section: targetSection,
      school: schoolId,
      academicSession: source.academicSession,
      schedule: source.schedule,
      effectiveFrom: source.effectiveFrom,
    });
    
    await newTimetable.save();
    res.status(201).json(newTimetable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
