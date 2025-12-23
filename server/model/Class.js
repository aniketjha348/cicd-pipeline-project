import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    // e.g., "A", "B", "C"
  },
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  capacity: {
    type: Number,
    default: 40,
  },
});

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      // e.g., "Class 1", "Class 10", "Grade 5"
    },
    displayOrder: {
      type: Number,
      default: 0,
      // For sorting classes in order
    },
    sections: [sectionSchema],
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
    subjects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
    }],
    monthlyFee: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Unique class name per school per session
classSchema.index({ school: 1, academicSession: 1, name: 1 }, { unique: true });

export const Class = mongoose.model('Class', classSchema);
