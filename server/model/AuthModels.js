import mongoose from "mongoose";
const sessionSchema = new mongoose.Schema({
  id:{type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId,required: true,unique:true

  },
  refreshTokenHash: String,
  ip: String,
  userAgent: String,
  browser:String,
  device:String,
  os:String,
  location:Object,
  createdAt: { type: Date, default: Date.now },
 lastUsed: {
  type: Date,
  default: Date.now // Helpful for new sessions
}
},{_id: false});


const institutionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['university', 'college',"selfCollege"],
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    address: {
      line1: { type: String, required: false },
      line2: { type: String },
      city: { type: String, required: false },
      state: { type: String, required: false },
      country: { type: String, default: 'India' },
      postalCode: { type: String },
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
    },
    website: {
      type: String,
    },
    logoUrl: {
      type: String,
    },

    // 📌 If college, link to university
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      required: function () {
        return this.type === 'college';
      },
    },

    // 📌 If university, array of linked colleges
    collegeIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
    }],

    departments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Optional      : filter out collegeIds unless type === university
institutionSchema.pre('save', function (next) {
  if (this.type === 'college') {
    this.collegeIds = []; // clear it if not a university
  }
  next();
});

export const Institution = mongoose.model('Institution', institutionSchema);


// // common schema & model of admin,student and faculty. 
// const userSchema = new mongoose.Schema({
//  email: { 
//     type: String, 
//     required: true, 
//     unique: true,
//     lowercase: true,
//     trim: true,
//     match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
//   },
//   password: String,
//   name: { type: String,  },
//   profilePic: String,
//   twoFA: {
//     enabled: { type: Boolean, default: false },
//     secret: String // TOTP secret
//   },
//   sessions: [sessionSchema],
//   institution: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Institution',
//     // required: true
//   },
//   role: { type: String, enum: ['admin', 'faculty', 'student','superAdmin'], required: true },
//       createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },


// },{ discriminatorKey: 'role', timestamps: true });

// export const User = mongoose.model('User', userSchema);

// // student schema & model
// const studentSchema = new mongoose.Schema({
//   rollNo: String,
//   college: {type:mongoose.Schema.Types.ObjectId,
//     required:true,
//     ref:"Institution"
//   },
//   department: {type:mongoose.Schema.Types.ObjectId,
//     required:true,
//     ref:"Department"
//   },
//   course: {type:mongoose.Schema.Types.ObjectId,
//     required:true,
//     ref:"Course"
//   },
//   batch: String,
//   photo: String,
// });

// export const Student = User.discriminator('student', studentSchema);
// // faculty schema & model
// const accessScopeSchema = new mongoose.Schema({
//   collegeId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Institution',
//     required: true,
//   },
//   departments: [
//     {
//       departmentId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Department',
//         required: true,
//       },
//       courses: [
//         {
//           courseId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Course',
//             required: true,
//           },
//           batchAccess: [
//             {
//               batchYear: {
//                 type: Number,
//                 required: true,
//               },
//               sections: [
//                 {
//                   type: String, // e.g., "A", "B", "C"
//                   required: true,
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// });

// const facultySchema = new mongoose.Schema({
//   department: String,
//   designation: String,
//   employeeId: String,
//   accessScope: [
//     accessScopeSchema
//   ],
// });

// export const Faculty = User.discriminator('faculty', facultySchema);
// // admin schema & model
// const adminSchema = new mongoose.Schema({
//   accessLevel: { type: String, default: 'super' },
// });

// export const Admin = User.discriminator('admin', adminSchema);



const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: String,
    name: { type: String },
    profilePic: String,
    twoFA: {
      enabled: { type: Boolean, default: false },
      secret: String,
    },
    sessions: [sessionSchema],
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
    },
    role: {
      type: String,
      enum: ['admin', 'faculty', 'student', 'superAdmin'],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    discriminatorKey: 'role',
    timestamps: true,
    collection: 'users', // base collection
  }
);

export const User = mongoose.model('User', userSchema);
const studentSchema = new mongoose.Schema({
  rollNo: String,
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  hasAccess:{
    type:String,
    enum: ['active', 'pending', 'denied'],
    default: 'pending',
  },
  batch: String,
  photo: String,
});

// Store in "students" collection
export const Student = User.discriminator(
  'student',
  studentSchema,
  undefined,
  { collection: 'students' }
);
const accessScopeSchema = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true,
  },
  collegePermissions: {
    type: [String],
    enum: ['create', 'read', 'update', 'delete'],
    default: ['read'],
  },
  collegeName:{
    type:String,
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'denied'],
    default: 'pending',
  },
  departments: [
    {
      departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
      },
        departmentName:{
    type:String,
  },
      departmentPermissions: {
        type: [String],
        enum: ['create', 'read', 'update', 'delete'],
        default: ['read'],
      },
      status: {
        type: String,
        enum: ['active', 'pending', 'denied'],
        default: 'pending',
      },
      courses: [
        {courseName:String
          ,
          courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
          },
          coursePermissions: {
            type: [String],
            enum: ['create', 'read', 'update', 'delete'],
            default: ['read'],
          },
          status: {
            type: String,
            enum: ['active', 'pending', 'denied'],
            default: 'pending',
          },
          batchAccess: [
            {
              batchYear: { type: Number, required: true },
              batchPermissions: {
                type: [String],
                enum: ['create', 'read', 'update', 'delete'],
                default: ['read'],
              },
              status: {
                type: String,
                enum: ['active', 'pending', 'denied'],
                default: 'pending',
              },
              sections: [
                {
                  name: { type: String, required: true },
                  sectionPermissions: {
                    type: [String],
                    enum: ['create', 'read', 'update', 'delete'],
                    default: ['read'],
                  },
                  status: {
                    type: String,
                    enum: ['active', 'pending', 'denied'],
                    default: 'pending',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});


const facultySchema = new mongoose.Schema({
  department: String,
  designation: String,
  employeeId: String,
  accessScope: [accessScopeSchema],
});

// Store in "faculties" collection
export const Faculty = User.discriminator(
  'faculty',
  facultySchema,
  undefined,
  { collection: 'faculties' }
);
const adminSchema = new mongoose.Schema({
  accessLevel: { type: String, default: 'super' },
});

// Store in "admins" collection
export const Admin = User.discriminator(
  'admin',
  adminSchema,
  undefined,
  { collection: 'admins' }
);
