import express from 'express';
import { AcademicSession } from '../model/AcademicSession.js';
import { verifyUserToken, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

// Apply auth middleware
router.use(verifyUserToken);

// Get all sessions for a school
router.get('/', async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    const sessions = await AcademicSession.find({ school: schoolId })
      .sort({ startDate: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get active session
router.get('/active', async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    const session = await AcademicSession.findOne({ 
      school: schoolId, 
      isActive: true 
    });
    if (!session) {
      return res.status(404).json({ message: 'No active session found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create session (admin only)
router.post('/', authorizeRoles('admin'), async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    const session = new AcademicSession({
      ...req.body,
      school: schoolId,
    });
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update session
router.patch('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    const session = await AcademicSession.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Set active session (deactivates others)
router.post('/:id/set-active', authorizeRoles('admin'), async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    
    // Deactivate all sessions for this school
    await AcademicSession.updateMany(
      { school: schoolId },
      { isActive: false }
    );
    
    // Activate the selected session
    const session = await AcademicSession.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    
    res.json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete session
router.delete('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    const session = await AcademicSession.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json({ message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
