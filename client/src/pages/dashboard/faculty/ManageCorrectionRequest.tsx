import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {  Bell, User, Calendar, FileText, Eye, Check, X } from 'lucide-react';

import { RequestCorrectionList,RequestCorrectionDetails } from '@/components/Faculty/ManageCorrectionReqComp';
import { BiIdCard } from 'react-icons/bi';

interface CorrectionRequest {
  id: string;
  studentName: string;
  studentId: string;
  fieldToCorrect: string;
  currentValue: string;
  requestedValue: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  idCardType: 'student' | 'faculty' | 'staff';
}

const ManageCorrectionRequest = () => {
  const [selectedRequest, setSelectedRequest] = useState<CorrectionRequest | null>(null);
  const [activeTab, setActiveTab] = useState('requests');

  const mockRequests: CorrectionRequest[] = [
    {
      id: '1',
      studentName: 'John Smith',
      studentId: 'CS2021001',
      fieldToCorrect: 'Phone Number',
      currentValue: '+91 98765XXXXX',
      requestedValue: '+91 98765YYYYY',
      reason: 'Wrong phone number in profile',
      priority: 'high',
      status: 'pending',
      submittedDate: '2024-01-15',
      idCardType: 'student'
    },
    {
      id: '2',
      studentName: 'Jane Doe',
      studentId: 'CS2021002',
      fieldToCorrect: 'Address',
      currentValue: 'Old Address',
      requestedValue: 'New Updated Address',
      reason: 'Address change required',
      priority: 'medium',
      status: 'approved',
      submittedDate: '2024-01-14',
      idCardType: 'student'
    },
    {
      id: '3',
      studentName: 'Mike Johnson',
      studentId: 'CS2021003',
      fieldToCorrect: 'Email',
      currentValue: 'old.email@example.com',
      requestedValue: 'new.email@example.com',
      reason: 'Email update needed',
      priority: 'low',
      status: 'pending',
      submittedDate: '2024-01-13',
      idCardType: 'student'
    }
  ];

  const handleRequestAction = (requestId: string, action: 'approve' | 'reject') => {
    console.log(`${action} request ${requestId}`);
    // Implement request action logic here
  };

  const pendingRequests = mockRequests.filter(req => req.status === 'pending');
  const approvedRequests = mockRequests.filter(req => req.status === 'approved');
  const rejectedRequests = mockRequests.filter(req => req.status === 'rejected');

  return (
    <div className="min-h-screen bg-color text-color w-full  p-6">
      <div className="max-w-14xl w-full ">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BiIdCard className="text-blue-600" />
              Faculty Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage ID card correction requests</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="hover-scale">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              <Badge variant="destructive" className="ml-2">
                {pendingRequests.length}
              </Badge>
            </Button>
            <Button className="hover-scale">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover-scale animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                  <p className="text-3xl font-bold text-orange-600">{pendingRequests.length}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{approvedRequests.length}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{rejectedRequests.length}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <X className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-3xl font-bold text-blue-600">{mockRequests.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <BiIdCard className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Request Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="requests">All Requests</TabsTrigger>
                    <TabsTrigger value="pending">
                      Pending ({pendingRequests.length})
                    </TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="requests" className="mt-6">
                    <RequestCorrectionList 
                      requests={mockRequests}
                      onSelectRequest={setSelectedRequest}
                      onRequestAction={handleRequestAction}
                    />
                  </TabsContent>
                  
                  <TabsContent value="pending" className="mt-6">
                    <RequestCorrectionList 
                      requests={pendingRequests}
                      onSelectRequest={setSelectedRequest}
                      onRequestAction={handleRequestAction}
                    />
                  </TabsContent>
                  
                  <TabsContent value="history" className="mt-6">
                    <RequestCorrectionList 
                      requests={[...approvedRequests, ...rejectedRequests]}
                      onSelectRequest={setSelectedRequest}
                      onRequestAction={handleRequestAction}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Request Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedRequest ? (
                  <RequestCorrectionDetails 
                    request={selectedRequest}
                    onApprove={() => handleRequestAction(selectedRequest.id, 'approve')}
                    onReject={() => handleRequestAction(selectedRequest.id, 'reject')}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Select a request to view details
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};



export default ManageCorrectionRequest