import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Student {
  id: string;
  name: string;
  rollNo: string;
  department: string;
  batch: string;
  email: string;
  phoneNumber: string;
  photo?: string;
  idCardStatus: 'pending' | 'approved' | 'printed';
  createdAt: string;
  updatedAt: string;
}

interface StudentState {
  students: Student[];
  loading: boolean;
  error: string | null;
}

// Mock initial students
const initialStudents: Student[] = [
  {
    id: '1',
    name: 'John Smith',
    rollNo: 'CS2023001',
    department: 'Computer Science',
    batch: '2023',
    email: 'john.smith@example.com',
    phoneNumber: '1234567890',
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
    idCardStatus: 'approved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Emily Johnson',
    rollNo: 'CS2023002',
    department: 'Computer Science',
    batch: '2023',
    email: 'emily.johnson@example.com',
    phoneNumber: '2345678901',
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
    idCardStatus: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Michael Davis',
    rollNo: 'EE2023001',
    department: 'Electrical Engineering',
    batch: '2023',
    email: 'michael.davis@example.com',
    phoneNumber: '3456789012',
    photo: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300',
    idCardStatus: 'printed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    rollNo: 'ME2023001',
    department: 'Mechanical Engineering',
    batch: '2023',
    email: 'sarah.wilson@example.com',
    phoneNumber: '4567890123',
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
    idCardStatus: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const initialState: StudentState = {
  students: initialStudents,
  loading: false,
  error: null,
};

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    fetchStudentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStudentsSuccess: (state, action: PayloadAction<Student[]>) => {
      state.students = action.payload;
      state.loading = false;
    },
    fetchStudentsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addStudent: (state, action: PayloadAction<Omit<Student, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const now = new Date().toISOString();
      const newStudent: Student = {
        ...action.payload,
        id: (state.students.length + 1).toString(),
        createdAt: now,
        updatedAt: now,
      };
      state.students.push(newStudent);
    },
    updateStudent: (state, action: PayloadAction<{ id: string; updates: Partial<Student> }>) => {
      const { id, updates } = action.payload;
      const studentIndex = state.students.findIndex((student) => student.id === id);
      if (studentIndex !== -1) {
        state.students[studentIndex] = { 
          ...state.students[studentIndex], 
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
    },
    deleteStudent: (state, action: PayloadAction<string>) => {
      state.students = state.students.filter((student) => student.id !== action.payload);
    },
    updateIdCardStatus: (state, action: PayloadAction<{ id: string; status: Student['idCardStatus'] }>) => {
      const { id, status } = action.payload;
      const studentIndex = state.students.findIndex((student) => student.id === id);
      if (studentIndex !== -1) {
        state.students[studentIndex].idCardStatus = status;
        state.students[studentIndex].updatedAt = new Date().toISOString();
      }
    },
    importStudents: (state, action: PayloadAction<Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'idCardStatus'>[]>) => {
      const now = new Date().toISOString();
      const newStudents = action.payload.map((student, index) => ({
        ...student,
        id: (state.students.length + index + 1).toString(),
        idCardStatus: 'pending' as const,
        createdAt: now,
        updatedAt: now,
      }));
      state.students = [...state.students, ...newStudents];
    },
  },
});

export const {
  fetchStudentsStart,
  fetchStudentsSuccess,
  fetchStudentsFailure,
  addStudent,
  updateStudent,
  deleteStudent,
  updateIdCardStatus,
  importStudents,
} = studentSlice.actions;

export default studentSlice.reducer;