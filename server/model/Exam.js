import mongoose from 'mongoose';

// Exam Schema - defines exam structure
const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      // e.g., "Mid-Term Exam", "Final Exam", "Unit Test 1"
    },
    examType: {
      type: String,
      enum: ['unit-test', 'mid-term', 'final', 'quarterly', 'half-yearly', 'annual'],
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
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
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    subjects: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',
          required: true,
        },
        maxMarks: {
          type: Number,
          required: true,
          default: 100,
        },
        passingMarks: {
          type: Number,
          required: true,
          default: 33,
        },
        examDate: {
          type: Date,
        },
        startTime: {
          type: String,
        },
        duration: {
          type: Number,
          // Duration in minutes
        },
      },
    ],
    status: {
      type: String,
      enum: ['scheduled', 'ongoing', 'completed', 'results-declared'],
      default: 'scheduled',
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

examSchema.index({ school: 1, academicSession: 1, class: 1 });

export const Exam = mongoose.model('Exam', examSchema);

// Result Schema - stores student results
const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
    },
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
    marks: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',
          required: true,
        },
        marksObtained: {
          type: Number,
          required: true,
          min: 0,
        },
        maxMarks: {
          type: Number,
          required: true,
        },
        passingMarks: {
          type: Number,
          required: true,
        },
        grade: {
          type: String,
          // A+, A, B+, B, C, D, F
        },
        remarks: {
          type: String,
          trim: true,
        },
        isPassed: {
          type: Boolean,
        },
      },
    ],
    totalMarksObtained: {
      type: Number,
      default: 0,
    },
    totalMaxMarks: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    grade: {
      type: String,
    },
    rank: {
      type: Number,
    },
    classRank: {
      type: Number,
    },
    sectionRank: {
      type: Number,
    },
    isPassed: {
      type: Boolean,
    },
    attendance: {
      totalDays: Number,
      presentDays: Number,
      percentage: Number,
    },
    remarks: {
      type: String,
      trim: true,
    },
    publishedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Unique result per student per exam
resultSchema.index({ student: 1, exam: 1 }, { unique: true });
resultSchema.index({ exam: 1, class: 1, section: 1 });

// Grade calculation helper
resultSchema.methods.calculateGrade = function (percentage) {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
};

// Pre-save to calculate totals
resultSchema.pre('save', function (next) {
  if (this.marks && this.marks.length > 0) {
    this.totalMarksObtained = this.marks.reduce((sum, m) => sum + m.marksObtained, 0);
    this.totalMaxMarks = this.marks.reduce((sum, m) => sum + m.maxMarks, 0);
    this.percentage = this.totalMaxMarks > 0 
      ? Math.round((this.totalMarksObtained / this.totalMaxMarks) * 100 * 100) / 100 
      : 0;
    this.grade = this.calculateGrade(this.percentage);
    
    // Check if passed in all subjects
    this.isPassed = this.marks.every(m => m.marksObtained >= m.passingMarks);
    
    // Calculate individual subject pass/fail and grade
    this.marks.forEach(m => {
      m.isPassed = m.marksObtained >= m.passingMarks;
      const subjectPercentage = (m.marksObtained / m.maxMarks) * 100;
      m.grade = this.calculateGrade(subjectPercentage);
    });
  }
  next();
});

export const Result = mongoose.model('Result', resultSchema);
