
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, User, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ViewIDCard = () => {
  const [showPreview, setShowPreview] = useState(false);

  const studentData = {
    name: 'MANISH MAURYA',
    studentId: 'IIMT/2024/CSE/001',
    course: 'B.Tech Computer Science',
    semester: '5th Semester',
    year: '2024-2025',
    validTill: '2025-06-30'
  };

  return (
    <div className="max-w-14xl flex flex-col w-full primary-p bg-color text-color space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold  mb-2">Digital ID Card</h1>
        <p className="text-color-thin">View and download your digital student ID card</p>
      </motion.div>

      {/* ID Card Preview */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative">
          {/* Front Side */}
          <motion.div
            className="w-96 h-60 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-xl p-6 text-white relative overflow-hidden"
            whileHover={{ rotateY: showPreview ? 0 : 5 }}
            style={{ perspective: 1000 }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-white rounded-full"></div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-800">IU</span>
                </div>
                <div>
                  <p className="text-xs font-semibold">IIMT UNIVERSITY</p>
                  <p className="text-xs opacity-80">Student ID Card</p>
                </div>
              </div>
              <QrCode className="w-8 h-8 opacity-80" />
            </div>

            {/* Student Photo */}
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-lg leading-tight">{studentData.name}</h3>
                <p className="text-sm opacity-90 mb-1">{studentData.course}</p>
                <p className="text-xs opacity-80">ID: {studentData.studentId}</p>
                <p className="text-xs opacity-80">{studentData.semester} • {studentData.year}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 left-6 right-6">
              <p className="text-xs opacity-80">Valid till: {studentData.validTill}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        className="flex justify-center space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Button
          variant="outline"
          className="flex items-center space-x-2"
          onClick={() => setShowPreview(!showPreview)}
        >
          <Eye className="w-4 h-4" />
          <span>Preview</span>
        </Button>
        
        <Button className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Download ID Card</span>
        </Button>
      </motion.div>

      {/* Card Details */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Card Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Student Name</p>
              <p className="text-gray-900">{studentData.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Student ID</p>
              <p className="text-gray-900">{studentData.studentId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Course</p>
              <p className="text-gray-900">{studentData.course}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Semester</p>
              <p className="text-gray-900">{studentData.semester}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Academic Year</p>
              <p className="text-gray-900">{studentData.year}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Valid Until</p>
              <p className="text-gray-900">{studentData.validTill}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


export default ViewIDCard