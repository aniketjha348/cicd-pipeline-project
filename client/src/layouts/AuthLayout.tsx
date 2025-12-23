import React from 'react';
import { Outlet } from 'react-router-dom';
import { School } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 flex flex-col md:flex-row">
      {/* Left side with branding */}
      <div className="w-full md:w-1/2 bg-blue-600 dark:bg-blue-800 text-white p-8 flex flex-col justify-center items-center">
        <div className="max-w-md mx-auto text-center">
          <School className="w-20 h-20 mb-6 mx-auto" />
          <h1 className="text-4xl font-bold mb-4">College ID Card Management</h1>
          <p className="text-xl mb-8">
            A secure platform for colleges to manage student data and generate ID cards
          </p>
          <div className="space-y-4 text-left bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <div className="flex items-start">
              <div className="bg-blue-500 dark:bg-blue-700 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Secure Role-Based Access</h3>
                <p className="text-white/80">Different access levels for admins, faculty, and students</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-500 dark:bg-blue-700 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Drag-and-Drop Template Builder</h3>
                <p className="text-white/80">Create custom ID card templates for your institution</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-500 dark:bg-blue-700 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Export ID Cards</h3>
                <p className="text-white/80">Download ID cards in multiple formats (PDF, PNG/JPG)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;