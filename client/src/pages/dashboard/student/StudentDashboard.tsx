import React from 'react';
import { motion } from 'framer-motion';
import { User, AlertTriangle, CreditCard, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const stats = [
    { label: 'Profile Status', value: 'Incomplete', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'ID Card Status', value: 'Pending', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Correction Requests', value: '2', color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const quickActions = [
    {
      title: 'Complete Profile',
      description: 'Fill in your personal information',
      icon: User,
      color: 'bg-blue-500',
      path: './profile'
    },
    {
      title: 'View ID Card',
      description: 'Download your digital ID card',
      icon: CreditCard,
      color: 'bg-green-500',
      path: './view-id-card'
    },
    {
      title: 'Request Correction',
      description: 'Submit correction requests',
      icon: AlertTriangle,
      color: 'bg-orange-500',
      path: './request-correction'
    },
    {
      title: 'Settings',
      description: 'Manage your account settings',
      icon: Settings,
      color: 'bg-purple-500',
      path: './setting'
    },
  ];

  return (
    <div className="space-y-6 primary-p w-full bg-color ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
        <p className="text-gray-600">Welcome back, Manish Maurya</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className={`${stat.bg} p-6 rounded-xl border border-gray-200`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Profile Warning */}
      <motion.div
        className="bg-yellow-50 border border-yellow-200 rounded-xl p-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-800">No Profile Found</h3>
            <p className="text-yellow-700 mt-1">
              We couldn't find your profile information. Please contact your department administration or complete your profile.
            </p>
            <Link
              to="./profile"
              className="inline-flex items-center mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Complete Profile
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={action.path}
                className="block bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
