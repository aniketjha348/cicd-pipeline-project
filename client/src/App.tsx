import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layout components
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Dashboard pages
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import FacultyDashboard from './pages/dashboard/faculty/FacultyDashboard';
import StudentDashboard from './pages/dashboard/student/StudentDashboard';

// Admin pages
import ManageUsers from './pages/dashboard/admin/ManageUsers';
import ManageDepartments from './pages/dashboard/admin/ManageDepartments';

// Faculty pages
import ManageStudents from './pages/dashboard/faculty/ManageStudents';
import DesignIDCard from './pages/dashboard/faculty/DesignIDCard';
import GenerateIDCards from './pages/dashboard/faculty/GenerateIDCards';

// Student pages
import ViewIDCard from './pages/dashboard/student/ViewIDCard';
import RequestCorrection from './pages/dashboard/student/RequestCorrection';

// Other components
import NotFound from './pages/NotFound';
import { RootState } from './store';
import ThemeProvider from './contexts/ThemeContext';
import { Toaster } from 'sonner';
import { useLazyVerifyUserQuery } from './services/AuthService';
import { Loader2 } from 'lucide-react';
import SuperAdminDashboard from './pages/dashboard/superadmin/SuperAdminDashboard';
import DepartmentForm from './components/Admin/DepartmentForm';
import ManageColleges from './pages/dashboard/admin/ManageColleges';


// Protected route component
const ProtectedRoute = ({
  children,
  allowedRoles = []
}: {
  children: React.ReactNode,
  allowedRoles?: string[]
}) => {
  // If not authenticated, redirect to login
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [verifyUser, { isLoading }] = useLazyVerifyUserQuery({
    refetchOnFocus: true,
    refetchOnReconnect: true
  })
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      verifyUser({}).unwrap().then(res => {
        console.log(res);

      }).catch(err => {
        console.log(err);
        navigate('/login')


      })

    } else {
      // navigate('/login')
    }

  }, [isAuthenticated])


  if (isLoading || !isAuthenticated) {
    return (<div className='fixed z-[1000] flex-col bg-slate-600/50 top-0 left-0 w-screen h-screen flex items-center gap-8 justify-center'>
      <h2 className='text-2xl text-blue-300'>Checking Credentials</h2>
      <p className='flex items-center gap-4 justify-center'> <Loader2 className='animate-spin mt-1' /> Waiting...</p>
    </div>)
  }

  // If no specific roles are required or user has the required role
  if (allowedRoles.length === 0 || (user && allowedRoles.includes(user?.role?.toLowerCase()))) {
    return <>{children}</>;
  }

  // If user doesn't have the required role, redirect to appropriate dashboard
  return <Navigate to={`/dashboard/${user?.role.toLowerCase()}`} replace />;
};
function App() {


  return (
    <ThemeProvider>
      <Toaster
        richColors
        expand={true}
        closeButton
        toastOptions={{
          classNames: {
            toast: "toast ",
            // title: "text-base font-semibold",
            // description: "text-sm opacity-90",
            // actionButton: "bg-primary text-white hover:bg-primary/80",
            // cancelButton: "bg-muted text-muted-foreground hover:bg-muted/80",
          },
        }}
      />
      <Router>
        <Routes>
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Dashboard routes */}
          <Route element={<DashboardLayout />}>
            {/* Admin routes */}
            <Route
              path="/dashboard/superadmin"
              element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin/departments"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageDepartments />
                </ProtectedRoute>
              }
            />
             <Route
              path="/dashboard/admin/collegs"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageColleges/>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/admin/departments/add"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DepartmentForm />
                </ProtectedRoute>
              }
            />



            {/* Faculty routes */}
            <Route
              path="/dashboard/faculty"
              element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <FacultyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/faculty/students"
              element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <ManageStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/faculty/design-id-card"
              element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <DesignIDCard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/faculty/generate-id-cards"
              element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <GenerateIDCards />
                </ProtectedRoute>
              }
            />

            {/* Student routes */}
            <Route
              path="/dashboard/student"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/student/view-id-card"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ViewIDCard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/student/request-correction"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <RequestCorrection />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Default redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;