import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  GraduationCap,
  Briefcase,
  Search,
  Plus,
  BarChart2,
  FileText,
  Download,
  School,
  MapPin,
  Mail,
  Phone,
  Globe,
  Edit2,
  Trash2,
} from 'lucide-react';
import { RootState } from '../../../store';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const SuperAdminDashboard: React.FC = () => {
  const { colleges } = useSelector((state: RootState) => state.colleges);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Calculate total statistics
  const totalStudents = colleges.reduce((sum, college) => sum + college.studentCount, 0);
  const totalFaculty = colleges.reduce((sum, college) => sum + college.facultyCount, 0);
  const totalDepartments = colleges.reduce((sum, college) => sum + college.departmentCount, 0);
  const activeColleges = colleges.filter(college => college.status === 'active').length;

  // Filter colleges based on search
  const filteredColleges = colleges.filter(
    college =>
      college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mock data for charts
  const collegeGrowthData = [
    { month: 'Jan', students: 8000, faculty: 400 },
    { month: 'Feb', students: 8200, faculty: 410 },
    { month: 'Mar', students: 8400, faculty: 415 },
    { month: 'Apr', students: 8600, faculty: 425 },
    { month: 'May', students: 8800, faculty: 430 },
    { month: 'Jun', students: 9000, faculty: 440 },
  ];

  const idCardStats = [
    { name: 'Engineering', pending: 45, approved: 150, printed: 800 },
    { name: 'Science', pending: 30, approved: 120, printed: 600 },
    { name: 'Arts', pending: 20, approved: 80, printed: 400 },
    { name: 'Commerce', pending: 25, approved: 100, printed: 500 },
  ];

  return (
    <div className="primary-p">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Super Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage all colleges and their ID card systems
        </p>
      </header>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
              <Building2 className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Colleges</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{colleges.length}</p>
              <p className="text-sm text-green-600 dark:text-green-400">{activeColleges} Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
              <GraduationCap className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalStudents}</p>
              <p className="text-sm text-green-600 dark:text-green-400">+12% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
              <Users className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Faculty</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalFaculty}</p>
              <p className="text-sm text-green-600 dark:text-green-400">+5% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300">
              <Briefcase className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Departments</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalDepartments}</p>
              <p className="text-sm text-green-600 dark:text-green-400">Across all colleges</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Growth Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={collegeGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="students"
                stroke="#3B82F6"
                name="Students"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="faculty"
                stroke="#8B5CF6"
                name="Faculty"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">ID Card Status by Department</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={idCardStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pending" fill="#FCD34D" name="Pending" />
              <Bar dataKey="approved" fill="#34D399" name="Approved" />
              <Bar dataKey="printed" fill="#60A5FA" name="Printed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Colleges List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">
              Managed Colleges
            </h2>
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search colleges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add College
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  College
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Statistics
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredColleges.map((college) => (
                <tr key={college.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {college.logo ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={college.logo}
                            alt={college.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <School className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {college.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Code: {college.code}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {college.city}, {college.state}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Globe className="h-4 w-4 text-gray-400 mr-2" />
                      <a
                        href={`https://${college.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {college.website}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {college.studentCount} Students
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {college.facultyCount} Faculty · {college.departmentCount} Departments
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        college.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {college.status.charAt(0).toUpperCase() + college.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;