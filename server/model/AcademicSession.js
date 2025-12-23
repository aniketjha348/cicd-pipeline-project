import mongoose from 'mongoose';

const academicSessionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      // e.g., "2024-25", "2025-26"
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Ensure only one active session per school
academicSessionSchema.index({ school: 1, isActive: 1 });

// Ensure unique session name per school
academicSessionSchema.index({ school: 1, name: 1 }, { unique: true });

export const AcademicSession = mongoose.model('AcademicSession', academicSessionSchema);
