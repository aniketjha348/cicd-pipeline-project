

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Plus, Clock, CheckCircle, XCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/shared/Toast';


const RequestCorrection = () => {

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    field: '',
    currentValue: '',
    correctValue: '',
    reason: '',
    priority: 'medium'
  });

  const existingRequests = [
    {
      id: 1,
      field: 'Phone Number',
      currentValue: '+91 98765XXXXX',
      correctValue: '+91 98765XXXXX',
      reason: 'Wrong phone number in profile',
      status: 'pending',
      date: '2024-12-20',
      priority: 'high'
    },
    {
      id: 2,
      field: 'Address',
      currentValue: 'Old Address',
      correctValue: 'New Updated Address',
      reason: 'Address change required',
      status: 'approved',
      date: '2024-12-18',
      priority: 'medium'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (!formData.field || !formData.correctValue || !formData.reason) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Request Submitted",
      description: "Your correction request has been submitted successfully.",
    });
    
    setFormData({
      field: '',
      currentValue: '',
      correctValue: '',
      reason: '',
      priority: 'medium'
    });
    setShowForm(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-12xl w-full primary-p space-y-6 bg-color text-color">
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold ">Request Correction</h1>
          <p className="text-color-thin">Submit requests to correct your profile information</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Request</span>
        </Button>
      </motion.div>

      {/* New Request Form */}
      {showForm && (
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span>New Correction Request</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="field">Field to Correct *</Label>
                <Select value={formData.field} onValueChange={(value) => setFormData({...formData, field: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Full Name</SelectItem>
                    <SelectItem value="email">Email Address</SelectItem>
                    <SelectItem value="phone">Phone Number</SelectItem>
                    <SelectItem value="address">Address</SelectItem>
                    <SelectItem value="dob">Date of Birth</SelectItem>
                    <SelectItem value="student-id">Student ID</SelectItem>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="currentValue">Current Value</Label>
                <Input
                  id="currentValue"
                  name="currentValue"
                  value={formData.currentValue}
                  onChange={handleInputChange}
                  placeholder="Current incorrect value"
                />
              </div>

              <div>
                <Label htmlFor="correctValue">Correct Value *</Label>
                <Input
                  id="correctValue"
                  name="correctValue"
                  value={formData.correctValue}
                  onChange={handleInputChange}
                  placeholder="Enter correct value"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reason">Reason for Correction *</Label>
                <Textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Explain why this correction is needed"
                  rows={5}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex items-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Submit Request</span>
            </Button>
          </div>
        </motion.div>
      )}

      {/* Existing Requests */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-gray-900">Your Requests</h2>
        
        {existingRequests.map((request, index) => (
          <motion.div
            key={request.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{request.field}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)} border`}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(request.status)}
                      <span className="capitalize">{request.status}</span>
                    </div>
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                    {request.priority.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Value:</p>
                    <p className="text-gray-900">{request.currentValue}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Requested Value:</p>
                    <p className="text-gray-900">{request.correctValue}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-600">Reason:</p>
                  <p className="text-gray-900">{request.reason}</p>
                </div>

                <p className="text-sm text-gray-500">Submitted on {new Date(request.date).toLocaleDateString()}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};


export default RequestCorrection