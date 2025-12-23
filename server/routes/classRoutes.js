import express from 'express';
import { Class } from '../model/Class.js';
import { verifyUserToken, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

router.use(verifyUserToken);

// Get all classes for the school
router.get('/', async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    const { academicSession } = req.query;
    
    const query = { school: schoolId };
    if (academicSession) {
      query.academicSession = academicSession;
    }
    
    const classes = await Class.find(query)
      .populate('academicSession', 'name')
      .populate('sections.classTeacher', 'name email')
      .populate('subjects', 'name code')
      .sort({ displayOrder: 1 });
    
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single class with details
router.get('/:id', async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate('academicSession')
      .populate('sections.classTeacher', 'name email profilePic')
      .populate('subjects');
    
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(classData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create class (admin only)
router.post('/', authorizeRoles('admin'), async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    const classData = new Class({
      ...req.body,
      school: schoolId,
    });
    await classData.save();
    res.status(201).json(classData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update class
router.patch('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    const classData = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(classData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add section to class
router.post('/:id/sections', authorizeRoles('admin'), async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    classData.sections.push(req.body);
    await classData.save();
    res.json(classData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update section
router.patch('/:classId/sections/:sectionId', authorizeRoles('admin'), async (req, res) => {
  try {
    const classData = await Class.findById(req.params.classId);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    const section = classData.sections.id(req.params.sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    
    Object.assign(section, req.body);
    await classData.save();
    res.json(classData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete section
router.delete('/:classId/sections/:sectionId', authorizeRoles('admin'), async (req, res) => {
  try {
    const classData = await Class.findById(req.params.classId);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    classData.sections.pull(req.params.sectionId);
    await classData.save();
    res.json(classData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete class
router.delete('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    const classData = await Class.findByIdAndDelete(req.params.id);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json({ message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
