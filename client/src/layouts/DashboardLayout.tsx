import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Menu, X, Bell, Search, Sun, Moon, LogOut, ChevronDown,
  Users, Briefcase, School, FileText, Settings, Home, User,
  Image, Printer, Book, HelpCircle, BarChart,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { AiFillSetting } from "react-icons/ai";
import { RootState } from '../store';
import { toggleSidebar, toggleTheme } from '../store/slices/uiSlice';
import { logout } from '../store/slices/authSlice';
import { useLazyLogoutQuery } from '@/services/AuthService';
import { FaBook, FaUser } from 'react-icons/fa';

const DashboardLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, theme, notifications } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);
  const [logout,{isLoading}]=useLazyLogoutQuery();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleLogout = async() => {
    await logout({}).unwrap();

    navigate('/login');
  };

  // Navigation items based on user role
  const getNavItems = () => {
    const items = [
      { to: `/dashboard/${user?.role.toLowerCase()}`, label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    ];

    if (user?.role === 'admin') {
      items.push(
        { to: '/dashboard/admin/users', label: 'Manage Users', icon: <Users className="w-5 h-5" /> },
       
        { to: '/dashboard/admin/colleges', label: 'Manage Colleges', icon: <School className="w-5 h-5" /> },
         { to: '/dashboard/admin/departments', label: 'Departments', icon: <Building2 className="w-5 h-5" /> },
            { to: '/dashboard/admin/colleges/departments/courses', label: 'Manage Courses', icon: <FaBook className="w-5 h-5" /> },
            { to: '/dashboard/admin/faculty/scope', label: 'Faculty Access', icon: <ShieldCheck className="w-5 h-5" /> },


      );
    } else if (user?.role === 'faculty') {
      items.push(
        { to: '/dashboard/faculty/students', label: 'Manage Students', icon: <Users className="w-5 h-5" /> },
        { to: '/dashboard/faculty/design-id-card', label: 'Design ID Card', icon: <Image className="w-5 h-5" /> },
        { to: '/dashboard/faculty/generate-id-cards', label: 'Generate ID Cards', icon: <Printer className="w-5 h-5" /> },
        { to: "/dashboard/faculty/manage-correction-request", label: 'Manage Requests', icon: <HelpCircle className="w-5 h-5" /> },
        { to: '/dashboard/faculty/profile', label: 'Profile', icon: <FaUser className="w-5 h-5" /> }
      );
    } else if (user?.role === 'student') {
      items.push(
        { to: '/dashboard/student/profile', label: 'Profile', icon: <FaUser className="w-5 h-5" /> },
        { to: '/dashboard/student/view-id-card', label: 'View ID Card', icon: <FileText className="w-5 h-5" /> },
        { to: '/dashboard/student/request-correction', label: 'Request Correction', icon: <HelpCircle className="w-5 h-5" /> },
        { to: '/dashboard/student/setting', label: 'Setting', icon: <AiFillSetting className="w-5 h-5" /> },
        

      );
    }

    return items;
  };

  return (
    <div className="flex w-screen min-h-screen bg-gray-100 dark:bg-gray-900 overflow-">
      {/* Sidebar */}
      <aside 
        className={`bg-white dark:bg-gray-800 fixed inset-y-0 z-50 flex flex-col transition-all duration-300 ease-in-out 
                   ${sidebarOpen ? 'left-0 w-64' : '-left-64 w-64 md:left-0 md:w-20'} shadow-lg`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          <Link 
            to={`/dashboard/${user?.role.toLowerCase()}`} 
            className="flex items-center space-x-3"
          >
            <School className={`h-8 w-8 text-blue-600 dark:text-blue-500 transition-all ${!sidebarOpen && 'mx-auto'}`} />
            {sidebarOpen && <span className="text-xl font-bold dark:text-white">ID Manager</span>}
          </Link>
          <button 
            className="md:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            onClick={() => dispatch(toggleSidebar())}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-2">
            {getNavItems().map((item, index) => (
              <li key={index} title={item?.label}>
                <NavLink
                  to={item.to}
                  end
                  className={({ isActive }) =>`flex items-center p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className={`${!sidebarOpen && 'mx-auto'}`}>{item.icon}</div>
                  {sidebarOpen && <span className="ml-3">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t dark:border-gray-700">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="flex items-center justify-center w-full p-2 text-gray-700 rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'dark' ? (
              <>
                <Sun className={`h-5 w-5 ${!sidebarOpen && 'mx-auto'}`} />
                {sidebarOpen && <span className="ml-3">Light Mode</span>}
              </>
            ) : (
              <>
                <Moon className={`h-5 w-5 ${!sidebarOpen && 'mx-auto'}`} />
                {sidebarOpen && <span className="ml-3">Dark Mode</span>}
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 w-full flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button
                onClick={() => dispatch(toggleSidebar())}
                className="text-gray-500 focus:outline-none focus:text-gray-700 dark:text-gray-400 dark:focus:text-white"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="relative ml-4 md:ml-6 flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex uppercase items-center gap-2">
              <img src={user?.institution?.logoUrl} className='dark:mix-blend-soft-light mix-blend-multiply  rounded-md size-[50px]' alt="" />
              {user?.institution?.name}</div>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-1 text-gray-500 rounded-full hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none"
                >
                  <Bell className="h-6 w-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
                {notificationsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1 divide-y divide-gray-200 dark:divide-gray-700">
                      <div className="px-4 py-2 flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">Notifications</h3>
                        <button
                          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          Mark all as read
                        </button>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div 
                              key={notification.id}
                              className={`px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 ${notification.read ? 'opacity-70' : ''}`}
                            >
                              <div className="flex items-start">
                                <div className={`h-3 w-3 rounded-full mt-1.5 mr-2 flex-shrink-0 ${
                                  notification.type === 'info' ? 'bg-blue-500' :
                                  notification.type === 'success' ? 'bg-green-500' :
                                  notification.type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}></div>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{notification.message}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                            No notifications
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white uppercase text-center flex items-center justify-center">
                    {user?.name.charAt(0)}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {user?.role}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
                {profileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Link
                        to="#"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        to="#"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex overflow-hidden   bg-gray-50 dark:bg-gray-900 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;