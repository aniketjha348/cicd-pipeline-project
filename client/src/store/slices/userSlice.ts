import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'faculty' | 'student';
  department?: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

// Mock initial users
const initialUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
    status: 'active',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'faculty',
    department: 'Computer Science',
    createdAt: new Date().toISOString(),
    status: 'active',
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'faculty',
    department: 'Electrical Engineering',
    createdAt: new Date().toISOString(),
    status: 'active',
  },
  {
    id: '4',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'student',
    department: 'Computer Science',
    createdAt: new Date().toISOString(),
    status: 'active',
  },
];

const initialState: UserState = {
  users: initialUsers,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUsersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      state.loading = false;
    },
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addUser: (state, action: PayloadAction<Omit<User, 'id' | 'createdAt'>>) => {
      const newUser: User = {
        ...action.payload,
        id: (state.users.length + 1).toString(),
        createdAt: new Date().toISOString(),
      };
      state.users.push(newUser);
    },
    updateUser: (state, action: PayloadAction<{ id: string; updates: Partial<User> }>) => {
      const { id, updates } = action.payload;
      const userIndex = state.users.findIndex((user) => user.id === id);
      if (userIndex !== -1) {
        state.users[userIndex] = { ...state.users[userIndex], ...updates };
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
  },
});

export const {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  addUser,
  updateUser,
  deleteUser,
} = userSlice.actions;

export default userSlice.reducer;