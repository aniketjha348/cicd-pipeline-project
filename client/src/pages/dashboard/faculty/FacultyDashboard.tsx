import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Users, FileText, Clock, CheckCircle, 
  Printer, Plus, BarChart2, Image
} from 'lucide-react';
import { RootState } from '../../../store';

const FacultyDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { students } = useSelector((state: RootState) => state.students);
  const { templates } = useSelector((state: RootState) => state.templates);
  
  // Filter students by faculty's department
  const departmentStudents = students.filter(
    (student) => user?.department && student.department === user.department
  );
  
  // Count by ID card status
  const pendingCount = departmentStudents.filter(student => student.idCardStatus === 'pending').length;
  const approvedCount = departmentStudents.filter(student => student.idCardStatus === 'approved').length;
  const printedCount = departmentStudents.filter(student => student.idCardStatus === 'printed').length;

  return (
    <div className='primary-p'>
      <header className="mb-8 ">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Faculty Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back, manage students and ID cards for {user?.department}
        </p>
      </header>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-transform hover:scale-105 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 mr-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{departmentStudents.length}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/dashboard/faculty/students"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Manage students →
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-transform hover:scale-105 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-500 dark:text-yellow-300 mr-4">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/dashboard/faculty/students?status=pending"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Review pending →
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-transform hover:scale-105 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-300 mr-4">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Approved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{approvedCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/dashboard/faculty/generate-id-cards"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Generate ID cards →
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-transform hover:scale-105 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-500 dark:text-purple-300 mr-4">
              <Printer className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Printed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{printedCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round((printedCount / departmentStudents.length) * 100) || 0}% completion rate
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently added students */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recently Added Students</h2>
            <Link 
              to="/dashboard/faculty/students"
              className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Roll No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Added On
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {departmentStudents.slice(0, 5).map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {student.photo ? (
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={student.photo} 
                              alt={student.name} 
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-500 dark:text-blue-300">
                              {student.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {student.rollNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        student.idCardStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : student.idCardStatus === 'approved'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {student.idCardStatus.charAt(0).toUpperCase() + student.idCardStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {departmentStudents.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No students found. Add students to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ID Card Templates */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">ID Card Templates</h2>
            <Link 
              to="/dashboard/faculty/design-id-card"
              className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
            >
              Create new
            </Link>
          </div>
          <div className="p-6">
            {templates.length > 0 ? (
              <div className="space-y-4">
                {templates.map((template) => (
                  <div 
                    key={template.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{template.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {template.orientation.charAt(0).toUpperCase() + template.orientation.slice(1)} · 
                          {template.department || 'All Departments'}
                        </p>
                      </div>
                      <Link 
                        to={`/dashboard/faculty/design-id-card?template=${template.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </Link>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Last modified: {new Date(template.updatedAt).toLocaleDateString()}
                      </span>
                      <Link 
                        to={`/dashboard/faculty/generate-id-cards?template=${template.id}`}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Generate ID cards
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Image className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No templates yet</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Get started by creating a new ID card template.
                </p>
                <div className="mt-6">
                  <Link
                    to="/dashboard/faculty/design-id-card"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Template
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/dashboard/faculty/students"
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center"
          >
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mr-3">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Add Student</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Create a new student profile</p>
            </div>
          </Link>
          
          <Link 
            to="/dashboard/faculty/design-id-card"
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center"
          >
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 mr-3">
              <Image className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Design Template</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Create a new ID card template</p>
            </div>
          </Link>
          
          <Link 
            to="/dashboard/faculty/generate-id-cards"
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center"
          >
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 mr-3">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Generate ID Cards</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Create printable ID cards</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;