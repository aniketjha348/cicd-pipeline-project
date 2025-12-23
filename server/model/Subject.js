import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      // e.g., "Mathematics", "English", "Science"
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      // e.g., "MATH", "ENG", "SCI"
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      required: true,
    },
    type: {
      type: String,
      enum: ['compulsory', 'optional', 'extracurricular'],
      default: 'compulsory',
    },
    maxMarks: {
      type: Number,
      default: 100,
    },
    passingMarks: {
      type: Number,
      default: 33,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Unique subject code per class
subjectSchema.index({ class: 1, code: 1 }, { unique: true });

export const Subject = mongoose.model('Subject', subjectSchema);
