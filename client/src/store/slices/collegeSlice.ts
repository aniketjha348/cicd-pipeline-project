import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface College {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  logo?: string;
  studentCount: number;
  facultyCount: number;
  departmentCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface CollegeState {
  colleges: College[];
  loading: boolean;
  error: string | null;
}

const initialColleges: College[] = [
  {
    id: '1',
    name: 'Engineering College of Technology',
    code: 'ECT',
    address: '123 Tech Street',
    city: 'Silicon Valley',
    state: 'California',
    country: 'USA',
    phone: '+1-555-0123',
    email: 'info@ect.edu',
    website: 'www.ect.edu',
    logo: 'https://example.com/logo.png',
    studentCount: 5000,
    facultyCount: 200,
    departmentCount: 8,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Institute of Science and Research',
    code: 'ISR',
    address: '456 Science Avenue',
    city: 'Boston',
    state: 'Massachusetts',
    country: 'USA',
    phone: '+1-555-0124',
    email: 'info@isr.edu',
    website: 'www.isr.edu',
    studentCount: 3000,
    facultyCount: 150,
    departmentCount: 6,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const initialState: CollegeState = {
  colleges: initialColleges,
  loading: false,
  error: null,
};

const collegeSlice = createSlice({
  name: 'colleges',
  initialState,
  reducers: {
    fetchCollegesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCollegesSuccess: (state, action: PayloadAction<College[]>) => {
      state.colleges = action.payload;
      state.loading = false;
    },
    fetchCollegesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addCollege: (state, action: PayloadAction<Omit<College, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const now = new Date().toISOString();
      const newCollege: College = {
        ...action.payload,
        id: (state.colleges.length + 1).toString(),
        createdAt: now,
        updatedAt: now,
      };
      state.colleges.push(newCollege);
    },
    updateCollege: (state, action: PayloadAction<{ id: string; updates: Partial<College> }>) => {
      const { id, updates } = action.payload;
      const collegeIndex = state.colleges.findIndex((college) => college.id === id);
      if (collegeIndex !== -1) {
        state.colleges[collegeIndex] = {
          ...state.colleges[collegeIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteCollege: (state, action: PayloadAction<string>) => {
      state.colleges = state.colleges.filter((college) => college.id !== action.payload);
    },
  },
});

export const {
  fetchCollegesStart,
  fetchCollegesSuccess,
  fetchCollegesFailure,
  addCollege,
  updateCollege,
  deleteCollege,
} = collegeSlice.actions;

export default collegeSlice.reducer;