import mongoose from 'mongoose';

// Fee Structure - defines what fees are applicable
const feeStructureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      // e.g., "Tuition Fee", "Lab Fee", "Sports Fee"
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
    // If class is null, applies to all classes
    appliesToAllClasses: {
      type: Boolean,
      default: false,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      required: true,
    },
    academicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicSession',
      required: true,
    },
    feeType: {
      type: String,
      enum: ['monthly', 'quarterly', 'half-yearly', 'yearly', 'one-time'],
      required: true,
    },
    dueDay: {
      type: Number,
      min: 1,
      max: 31,
      default: 10,
      // Day of month when fee is due
    },
    isOptional: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const FeeStructure = mongoose.model('FeeStructure', feeStructureSchema);

// Fee Payment - tracks actual payments
const feePaymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    feeStructure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FeeStructure',
      required: true,
    },
    amountDue: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    discountReason: {
      type: String,
      trim: true,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ['cash', 'online', 'cheque', 'upi', 'bank_transfer'],
      required: true,
    },
    transactionId: {
      type: String,
      trim: true,
    },
    receiptNo: {
      type: String,
      required: true,
      unique: true,
    },
    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      required: true,
    },
    academicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicSession',
      required: true,
    },
    month: {
      type: Number,
      min: 1,
      max: 12,
      // For monthly fees
    },
    status: {
      type: String,
      enum: ['paid', 'partial', 'pending', 'overdue'],
      default: 'paid',
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for payment lookup
feePaymentSchema.index({ student: 1, academicSession: 1 });
feePaymentSchema.index({ school: 1, paymentDate: 1 });

export const FeePayment = mongoose.model('FeePayment', feePaymentSchema);

// Fee Due - tracks pending fees per student
const feeDueSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    feeStructure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FeeStructure',
      required: true,
    },
    amountDue: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    month: {
      type: Number,
      min: 1,
      max: 12,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      required: true,
    },
    academicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicSession',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'overdue', 'waived'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

feeDueSchema.index({ student: 1, status: 1 });

export const FeeDue = mongoose.model('FeeDue', feeDueSchema);
