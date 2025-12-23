import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Users, School, Briefcase, FileText, 
  Printer, CheckCircle, Clock, AlertTriangle,
  BarChart2
} from 'lucide-react';
import { RootState } from '../../../store';

const AdminDashboard: React.FC = () => {
  const { departments } = useSelector((state: RootState) => state.departments);
  const { users } = useSelector((state: RootState) => state.users);
  const { students } = useSelector((state: RootState) => state.students);

  // Count by role
  const adminCount = users.filter(user => user.role === 'admin').length;
  const facultyCount = users.filter(user => user.role === 'faculty').length;
  const studentCount = students.length;

  // Count by ID card status
  const pendingCount = students.filter(student => student.idCardStatus === 'pending').length;
  const approvedCount = students.filter(student => student.idCardStatus === 'approved').length;
  const printedCount = students.filter(student => student.idCardStatus === 'printed').length;

  return (
    <div className='primary-p'>
      <header className="mb-8 ">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back, manage your college ID card system here
        </p>
      </header>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-transform hover:scale-105 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 mr-4">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Departments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{departments.length}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/dashboard/admin/departments"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all departments →
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-transform hover:scale-105 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-300 mr-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Faculty Members</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{facultyCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/dashboard/admin/users"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Manage users →
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-transform hover:scale-105 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-500 dark:text-purple-300 mr-4">
              <School className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{studentCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {pendingCount} pending approvals
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-transform hover:scale-105 border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-500 dark:text-orange-300 mr-4">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">ID Cards</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{printedCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {approvedCount} approved, ready to print
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status breakdown */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">ID Card Status</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Pending</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {Math.round((pendingCount / studentCount) * 100)}% of total
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${(pendingCount / studentCount) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Approved</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{approvedCount}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {Math.round((approvedCount / studentCount) * 100)}% of total
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(approvedCount / studentCount) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <Printer className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Printed</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{printedCount}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {Math.round((printedCount / studentCount) * 100)}% of total
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(printedCount / studentCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* <div className="mt-6">
              <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3">Department Breakdown</h3>
              <div className="space-y-3">
                {departments.map((dept) => (
                  <div key={dept.id} className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-48">{dept.name}</span>
                    <div className="flex-1">
                      <div className="relative overflow-hidden w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(dept.studentCount / studentCount) * 100}%` }}
                        ></div>
        
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-3">
                      {dept.studentCount}
                    </span>
                  </div>
                ))}
              </div>
            </div> */}
            <div className="mt-6">
  <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3">Department Breakdown</h3>
  <div className="space-y-3">
    {departments.map((dept) => {
      const total = dept.studentCount + dept.facultyCount;
      const studentPercent = (dept.studentCount / total) * 100;
      const facultyPercent = (dept.facultyCount / total) * 100;

      return (
        <div key={dept.id} className="flex items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400 w-48">{dept.name}</span>
          <div className="flex-1">
            <div className="relative overflow-hidden w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 flex">
              {/* Students part */}
              <div
                className="bg-blue-500 h-2"
                style={{ width: `${studentPercent}%` }}
                title={`Students: ${dept.studentCount}`}
              />
              {/* Faculty part */}
              <div
                className="bg-orange-500 h-2"
                style={{ width: `${facultyPercent}%` }}
                title={`Faculty: ${dept.facultyCount}`}
              />
            </div>
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-3">
            {dept.studentCount + dept.facultyCount}
          </span>
        </div>
      );
    })}
  </div>
</div>

          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
              View all
            </button>
          </div>
          <div className="p-6">
            <ul className="space-y-6">
              <li className="flex items-start">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-200">
                    <span className="font-medium">Computer Science Department</span> approved 12 new ID cards
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">10 minutes ago</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-200">
                    <span className="font-medium">John Doe</span> added 5 new students to Electrical Engineering
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 hour ago</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mr-3">
                  <School className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-200">
                    <span className="font-medium">New batch</span> added for Mechanical Engineering (2023)
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">3 hours ago</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full mr-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-200">
                    <span className="font-medium">System notification:</span> 8 student records need review
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">5 hours ago</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/dashboard/admin/users"
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center"
          >
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mr-3">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Add New User</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Create admin or faculty account</p>
            </div>
          </Link>
          
          <Link 
            to="/dashboard/admin/departments"
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center"
          >
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 mr-3">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Add Department</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Create a new department</p>
            </div>
          </Link>
          
          <Link 
            to="#"
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center"
          >
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 mr-3">
              <BarChart2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">View Reports</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Generate system reports</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;