import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., A, B
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'FacultyUser', default: null },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudentUser' }]
},);



const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // e.g., "BCA", "MBA"
  },
  code:{
    type:String,
    required:true,
    trim: true,
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true,
  },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true,
  },
  duration: {
    type: Number,
    required: true, // In years, e.g., 3 for BCA
  },
  description: {
    type: String,
    default: '',
  },
  programType: {
    type: String,
    enum: ['Undergraduate', 'Postgraduate', 'Diploma', 'Certificate'],
    default: 'Undergraduate',
  },
  batches: [
    {
      batchYear: Number, // e.g., 2023
      endYear: Number,   // Optional or auto-calculated from duration
      years: [
        {
          yearNumber: Number, // 1, 2, 3...
          sections: [
            {
              name: String, // A, B, C...
              capacity: Number,
              classTeacherId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // Assuming faculty are stored in the User model
              },
            },
          ],
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive:{
    type:Boolean,
    default:true
  }
});

const departmentSchema = new mongoose.Schema({
   name: {
    type: String,
    required: true,
    trim: true, // e.g., "Computer Science", "Mechanical Engineering"
  },
  shortName: {
    type: String,
    required: true,
    unique: true, // e.g., "CS", "ME", "EE"
    uppercase: true,
  },
    type: {
      type: String,
      enum: ['university', 'college'],
      required: true,
    },  
  description: {
    type: String,
    default: '',
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true,
  },
 universityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution',
        required: function () {
          return this.type === 'college';
        },
      },
  courses:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:"course"
  },
  headOfDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming 'faculty' are stored in the 'User' collection
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  contactPhone: {
    type: String,
  },
  officeRoomNumber: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
    
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


export const Course =mongoose.model("course",courseSchema)
export const Department = mongoose.model('Department', departmentSchema);
