import mongoose from 'mongoose';

const periodSchema = new mongoose.Schema({
  periodNo: {
    type: Number,
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  startTime: {
    type: String,
    required: true,
    // e.g., "08:00", "09:30"
  },
  endTime: {
    type: String,
    required: true,
  },
  isBreak: {
    type: Boolean,
    default: false,
  },
  breakName: {
    type: String,
    // e.g., "Lunch", "Short Break"
  },
});

const dayScheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  periods: [periodSchema],
});

const timetableSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    section: {
      type: String,
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
    schedule: [dayScheduleSchema],
    effectiveFrom: {
      type: Date,
      required: true,
    },
    effectiveTo: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Unique timetable per class/section/session
timetableSchema.index(
  { class: 1, section: 1, academicSession: 1, isActive: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

export const Timetable = mongoose.model('Timetable', timetableSchema);
