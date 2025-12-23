import express from 'express';
import { FeeStructure, FeePayment, FeeDue } from '../model/Fee.js';
import { verifyUserToken, authorizeRoles } from '../middlewares/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

router.use(verifyUserToken);

// ============ FEE STRUCTURE ROUTES ============

// Get all fee structures
router.get('/structures', async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    const { classId, academicSession } = req.query;
    
    const query = { school: schoolId, isActive: true };
    if (classId) query.class = classId;
    if (academicSession) query.academicSession = academicSession;
    
    const structures = await FeeStructure.find(query)
      .populate('class', 'name')
      .populate('academicSession', 'name');
    
    res.json(structures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create fee structure
router.post('/structures', authorizeRoles('admin'), async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    const structure = new FeeStructure({
      ...req.body,
      school: schoolId,
    });
    await structure.save();
    res.status(201).json(structure);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update fee structure
router.patch('/structures/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    const structure = await FeeStructure.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!structure) {
      return res.status(404).json({ message: 'Fee structure not found' });
    }
    res.json(structure);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete fee structure
router.delete('/structures/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    await FeeStructure.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Fee structure deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ FEE PAYMENT ROUTES ============

// Generate receipt number
const generateReceiptNo = (schoolId) => {
  const date = new Date();
  const prefix = 'RCP';
  const timestamp = date.getTime().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Collect fee payment
router.post('/payments', authorizeRoles('admin'), async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    const { studentId, feeStructureId, amountPaid, discount, discountReason, paymentMode, transactionId, month, remarks } = req.body;
    
    const feeStructure = await FeeStructure.findById(feeStructureId);
    if (!feeStructure) {
      return res.status(404).json({ message: 'Fee structure not found' });
    }
    
    const payment = new FeePayment({
      student: studentId,
      feeStructure: feeStructureId,
      amountDue: feeStructure.amount,
      amountPaid,
      discount: discount || 0,
      discountReason,
      paymentDate: new Date(),
      dueDate: new Date(), // Calculate based on structure
      paymentMode,
      transactionId,
      receiptNo: generateReceiptNo(schoolId),
      collectedBy: req.user._id,
      school: schoolId,
      academicSession: feeStructure.academicSession,
      month,
      status: amountPaid >= (feeStructure.amount - (discount || 0)) ? 'paid' : 'partial',
      remarks,
    });
    
    await payment.save();
    
    // Update fee due if exists
    await FeeDue.findOneAndUpdate(
      { student: studentId, feeStructure: feeStructureId, month },
      {
        $inc: { amountPaid: amountPaid },
        status: payment.status,
      }
    );
    
    const populatedPayment = await FeePayment.findById(payment._id)
      .populate('student', 'name rollNo')
      .populate('feeStructure', 'name amount')
      .populate('collectedBy', 'name');
    
    res.status(201).json(populatedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get payments
router.get('/payments', async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    const { studentId, startDate, endDate, status } = req.query;
    
    const query = { school: schoolId };
    if (studentId) query.student = studentId;
    if (status) query.status = status;
    if (startDate && endDate) {
      query.paymentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    
    const payments = await FeePayment.find(query)
      .populate('student', 'name rollNo class')
      .populate('feeStructure', 'name amount feeType')
      .populate('collectedBy', 'name')
      .sort({ paymentDate: -1 });
    
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get payment by receipt
router.get('/payments/receipt/:receiptNo', async (req, res) => {
  try {
    const payment = await FeePayment.findOne({ receiptNo: req.params.receiptNo })
      .populate('student', 'name rollNo class section')
      .populate('feeStructure', 'name amount feeType')
      .populate('collectedBy', 'name')
      .populate('school', 'name address');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ FEE DUE ROUTES ============

// Get pending fees for a student
router.get('/dues/student/:studentId', async (req, res) => {
  try {
    const dues = await FeeDue.find({
      student: req.params.studentId,
      status: { $in: ['pending', 'partial', 'overdue'] },
    })
      .populate('feeStructure', 'name amount feeType')
      .sort({ dueDate: 1 });
    
    const totalDue = dues.reduce((sum, d) => sum + (d.amountDue - d.amountPaid), 0);
    
    res.json({ dues, totalDue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all pending fees (admin view)
router.get('/dues', authorizeRoles('admin'), async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    const { classId, status, academicSession } = req.query;
    
    const query = {
      school: schoolId,
      status: { $in: ['pending', 'partial', 'overdue'] },
    };
    if (academicSession) query.academicSession = academicSession;
    
    const dues = await FeeDue.find(query)
      .populate({
        path: 'student',
        select: 'name rollNo class section',
        match: classId ? { class: classId } : {},
      })
      .populate('feeStructure', 'name amount')
      .sort({ dueDate: 1 });
    
    // Filter out null students (from class filter)
    const filteredDues = dues.filter(d => d.student);
    
    res.json(filteredDues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate fee dues for all students (bulk)
router.post('/dues/generate', authorizeRoles('admin'), async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    const { feeStructureId, month, dueDate } = req.body;
    
    const feeStructure = await FeeStructure.findById(feeStructureId);
    if (!feeStructure) {
      return res.status(404).json({ message: 'Fee structure not found' });
    }
    
    // Get all students for the class (or all if applies to all)
    const studentQuery = { school: schoolId, role: 'student', isActive: true };
    if (feeStructure.class) {
      studentQuery.class = feeStructure.class;
    }
    
    const Student = mongoose.model('User');
    const students = await Student.find(studentQuery).select('_id');
    
    const dues = students.map(s => ({
      student: s._id,
      feeStructure: feeStructureId,
      amountDue: feeStructure.amount,
      dueDate: new Date(dueDate),
      month,
      school: schoolId,
      academicSession: feeStructure.academicSession,
    }));
    
    await FeeDue.insertMany(dues, { ordered: false }).catch(() => {});
    
    res.json({ message: 'Fee dues generated', count: dues.length });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Fee collection summary
router.get('/summary', authorizeRoles('admin'), async (req, res) => {
  try {
    const schoolId = req.user.institution?._id;
    const { academicSession, month } = req.query;
    
    const matchQuery = { school: new mongoose.Types.ObjectId(schoolId) };
    if (academicSession) matchQuery.academicSession = new mongoose.Types.ObjectId(academicSession);
    if (month) matchQuery.month = parseInt(month);
    
    const summary = await FeePayment.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalCollected: { $sum: '$amountPaid' },
          totalDiscount: { $sum: '$discount' },
          count: { $sum: 1 },
        },
      },
    ]);
    
    const pendingDues = await FeeDue.aggregate([
      {
        $match: {
          school: new mongoose.Types.ObjectId(schoolId),
          status: { $in: ['pending', 'partial', 'overdue'] },
        },
      },
      {
        $group: {
          _id: null,
          totalPending: { $sum: { $subtract: ['$amountDue', '$amountPaid'] } },
          count: { $sum: 1 },
        },
      },
    ]);
    
    res.json({
      collected: summary[0] || { totalCollected: 0, totalDiscount: 0, count: 0 },
      pending: pendingDues[0] || { totalPending: 0, count: 0 },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
