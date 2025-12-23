import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Department {
  id: string;
  name: string;
  code: string;
  facultyCount: number;
  studentCount: number;
  createdAt: string;
}

interface DepartmentState {
  departments: Department[];
  loading: boolean;
  error: string | null;
}

// Mock initial departments
const initialDepartments: Department[] = [
  {
    id: '1',
    name: 'Computer Science',
    code: 'CS',
    facultyCount: 15,
    studentCount: 120,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Electrical Engineering',
    code: 'EE',
    facultyCount: 12,
    studentCount: 95,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Mechanical Engineering',
    code: 'ME',
    facultyCount: 10,
    studentCount: 85,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Civil Engineering',
    code: 'CE',
    facultyCount: 8,
    studentCount: 75,
    createdAt: new Date().toISOString(),
  },
];

const initialState: DepartmentState = {
  departments: initialDepartments,
  loading: false,
  error: null,
};

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    fetchDepartmentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDepartmentsSuccess: (state, action: PayloadAction<Department[]>) => {
      state.departments = action.payload;
      state.loading = false;
    },
    fetchDepartmentsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addDepartment: (state, action: PayloadAction<Omit<Department, 'id' | 'createdAt'>>) => {
      const newDepartment: Department = {
        ...action.payload,
        id: (state.departments.length + 1).toString(),
        createdAt: new Date().toISOString(),
      };
      state.departments.push(newDepartment);
    },
    updateDepartment: (state, action: PayloadAction<{ id: string; updates: Partial<Department> }>) => {
      const { id, updates } = action.payload;
      const departmentIndex = state.departments.findIndex((dept) => dept.id === id);
      if (departmentIndex !== -1) {
        state.departments[departmentIndex] = { ...state.departments[departmentIndex], ...updates };
      }
    },
    deleteDepartment: (state, action: PayloadAction<string>) => {
      state.departments = state.departments.filter((dept) => dept.id !== action.payload);
    },
  },
});

export const {
  fetchDepartmentsStart,
  fetchDepartmentsSuccess,
  fetchDepartmentsFailure,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} = departmentSlice.actions;

export default departmentSlice.reducer;