import express from 'express';
import { Subject } from '../model/Subject.js';
import { Class } from '../model/Class.js';
import { verifyUserToken, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

router.use(verifyUserToken);

// Get all subjects
router.get('/', async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    const { classId } = req.query;
    
    const query = { school: schoolId };
    if (classId) {
      query.class = classId;
    }
    
    const subjects = await Subject.find(query)
      .populate('class', 'name')
      .populate('teacher', 'name email');
    
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get subjects by class
router.get('/by-class/:classId', async (req, res) => {
  try {
    const subjects = await Subject.find({ class: req.params.classId })
      .populate('teacher', 'name email');
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create subject
router.post('/', authorizeRoles('admin'), async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    const subject = new Subject({
      ...req.body,
      school: schoolId,
    });
    await subject.save();
    
    // Add subject to class
    if (req.body.class) {
      await Class.findByIdAndUpdate(
        req.body.class,
        { $push: { subjects: subject._id } }
      );
    }
    
    res.status(201).json(subject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Bulk create subjects for a class
router.post('/bulk', authorizeRoles('admin'), async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    const { classId, subjects } = req.body;
    
    const subjectsToCreate = subjects.map(s => ({
      ...s,
      class: classId,
      school: schoolId,
    }));
    
    const createdSubjects = await Subject.insertMany(subjectsToCreate);
    
    // Add all subjects to class
    await Class.findByIdAndUpdate(
      classId,
      { $push: { subjects: { $each: createdSubjects.map(s => s._id) } } }
    );
    
    res.status(201).json(createdSubjects);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update subject
router.patch('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json(subject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Assign teacher to subject
router.patch('/:id/assign-teacher', authorizeRoles('admin'), async (req, res) => {
  try {
    const { teacherId } = req.body;
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { teacher: teacherId },
      { new: true }
    ).populate('teacher', 'name email');
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json(subject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete subject
router.delete('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    // Remove from class
    await Class.findByIdAndUpdate(
      subject.class,
      { $pull: { subjects: subject._id } }
    );
    
    await subject.deleteOne();
    res.json({ message: 'Subject deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
