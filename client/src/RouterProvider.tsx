import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Outlet, createBrowserRouter } from 'react-router-dom';
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
import CollegeDetails from './pages/dashboard/admin/CollegeDetails';
import CoursesOverview from './pages/dashboard/admin/CourseOverview';
import CourseForm from './components/Admin/CourseForm';
import NewDepartmentForm from './components/Admin/NewDepartmentForm';
import FacultyAccessManagement from './pages/dashboard/admin/FacultyAccessManage';
import Profile from './pages/dashboard/student/Profile';
import Settings from './pages/dashboard/student/Settings';
import ManageCorrectionRequest from './pages/dashboard/faculty/ManageCorrectionRequest';
import FacultyProfile from './pages/dashboard/faculty/FacultyProfile';
import { FacultyAccess, FacultyAccessDialog } from './components/Admin/FacultyAccessComp';

// School ERP Pages
import AcademicSessionManagement from './pages/dashboard/admin/AcademicSessionManagement';
import ClassManagement from './pages/dashboard/admin/ClassManagement';
import AttendanceManagement from './pages/dashboard/admin/AttendanceManagement';
import FeeManagement from './pages/dashboard/admin/FeeManagement';


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


import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return null; // this component does not render anything
}

const ThemeWrapper = () => (
  <ThemeProvider>
    <ScrollToTop/>
    <Toaster
      richColors
      expand
      closeButton
      toastOptions={{
        classNames: {
          toast: "toast",
        },
      }}
    />
    <Outlet />
  </ThemeProvider>
);
const router = createBrowserRouter([
  {
    element: <ThemeWrapper />,
    children: [
      { path: "/", element: <Navigate to="/login" replace /> },

      {
        element: <AuthLayout />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/register", element: <Register /> },
          { path: "/forgot-password", element: <ForgotPassword /> },
        ],
      },

      {
        element: <DashboardLayout />,
        children: [
          // Superadmin Routes
          {
            path: "/dashboard/superadmin",
            element: (
              <ProtectedRoute allowedRoles={["superadmin"]}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            ),
          },

          // Admin Routes
          {
            path: "/dashboard/admin",
            element: <ProtectedRoute allowedRoles={["admin"]}><Outlet /></ProtectedRoute>,
            children: [
              { index: true, element: <AdminDashboard /> },
              { path: "users", element: <ManageUsers /> },
              { path: "departments", element: <ManageDepartments /> },
              { path: "departments/add", element: <NewDepartmentForm /> },
              { path: "colleges", element: <ManageColleges /> },
              { path: "colleges/:collegeId", element: <CollegeDetails /> },
               {
                path:"colleges/departments/courses",
                element:<Outlet/>,

                children:[{
                  path:"",
                  element:<CoursesOverview/>
                },{
                  path:"create",
                  element:<CourseForm onSubmit={function (data: { departmentId: string; name: string; collegeId: string; universityId: string; duration: number; programType: 'Undergraduate' | 'Postgraduate' | 'Diploma' | 'Certificate'; batches: { batchYear: number; years: { yearNumber: number; sections: { name: string; capacity: number; classTeacherId?: string | undefined; }[]; }[]; endYear?: number | undefined; }[]; description?: string | undefined; }): void {
                    throw new Error('Function not implemented.');
                  } }/>
                }]
               },
               {
                path:"faculty/scope",
            element: <ProtectedRoute allowedRoles={["admin"]}><Outlet /></ProtectedRoute>,
               
                children:[{ index:true,element:<FacultyAccessManagement/>,},{

                  path:"add",
                  element:<FacultyAccess faculty={[{
    id: '3',
    name: 'Dr. James Wilson',
    email: 'james.wilson@university.edu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    department: 'Physics'
  }]} open={true} onOpenChange={function (open: boolean): void {
                    throw new Error('Function not implemented.');
                  } } onSave={function (accessScope: AccessScope): void {
                    throw new Error('Function not implemented.');
                  } } existingAccess={[]} />
                }]
               },
              // School ERP Routes
              { path: "academic-sessions", element: <AcademicSessionManagement /> },
              { path: "classes", element: <ClassManagement /> },
              { path: "attendance", element: <AttendanceManagement /> },
              { path: "fees", element: <FeeManagement /> },
            ],
          },

          // Faculty Routes
          {
            path: "/dashboard/faculty",
            element: <ProtectedRoute allowedRoles={["faculty"]}><Outlet /></ProtectedRoute>,
            children: [
              { index: true, element: <FacultyDashboard /> },
              { path: "students", element: <ManageStudents /> },
              { path: "design-id-card", element: <DesignIDCard /> },
              { path: "generate-id-cards", element: <GenerateIDCards /> },
              {path:"manage-Correction-request",element:<ManageCorrectionRequest/>},
              {path:"profile",element:<FacultyProfile/>}
            ],
          },

          // Student Routes
          {
            path: "/dashboard/student",
            element: <ProtectedRoute allowedRoles={["student"]}><Outlet /></ProtectedRoute>,
            children: [
              { index: true, element: <StudentDashboard /> },
              { path: "view-id-card", element: <ViewIDCard /> },
              { path: "request-correction", element: <RequestCorrection /> },
              {path:"profile",element:<Profile/>},
              {path:"setting",element:<Settings/>}
            ],
          },

          // College Routes (optional)
          {
            path: "/dashboard/college",
            element: <ProtectedRoute allowedRoles={["college"]}><Outlet /></ProtectedRoute>,
            children: [
              { index: true, element: <>College Dashboard.</>},
              // add more college-specific routes here
            ],
          },
        ],
      },

      // 404 Not Found
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;

