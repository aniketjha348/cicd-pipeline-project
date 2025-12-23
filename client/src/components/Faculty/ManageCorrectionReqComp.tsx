import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

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

interface RequestCorrectionDetailsProps {
  request: CorrectionRequest;
  onApprove: () => void;
  onReject: () => void;
}

export const RequestCorrectionDetails: React.FC<RequestCorrectionDetailsProps> = ({
  request,
  onApprove,
  onReject
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <FileText className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Student Information */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{request.studentName}</h3>
              <p className="text-sm text-gray-600">{request.studentId}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">ID Card Type</p>
              <p className="font-medium capitalize">{request.idCardType}</p>
            </div>
            <div>
              <p className="text-gray-500">Submitted</p>
              <p className="font-medium">{new Date(request.submittedDate).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <h4 className="font-semibold">Request Details</h4>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Field to Correct</p>
            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{request.fieldToCorrect}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Current Value</p>
            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{request.currentValue}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Requested Value</p>
            <p className="text-sm text-gray-900 bg-blue-50 p-2 rounded border-l-4 border-blue-400">
              {request.requestedValue}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Reason for Correction</p>
            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{request.reason}</p>
          </div>
        </div>
      </div>

      {/* Priority and Status */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Priority</span>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getPriorityColor(request.priority)}`}>
            {getPriorityIcon(request.priority)}
            {request.priority.toUpperCase()}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Status</span>
          <Badge variant={request.status === 'pending' ? 'default' : request.status === 'approved' ? 'default' : 'destructive'}>
            {request.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Action Buttons */}
      {request.status === 'pending' && (
        <div className="flex gap-3">
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={onApprove}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve Request
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
            onClick={onReject}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject Request
          </Button>
        </div>
      )}

      {request.status !== 'pending' && (
        <div className="text-center py-4 text-gray-500">
          <p>This request has been {request.status}</p>
        </div>
      )}
    </div>
  );
};

import { Clock, AlertCircle } from 'lucide-react';

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

interface RequestCorrectionListProps {
  requests: CorrectionRequest[];
  onSelectRequest: (request: CorrectionRequest) => void;
  onRequestAction: (requestId: string, action: 'approve' | 'reject') => void;
}

export const RequestCorrectionList: React.FC<RequestCorrectionListProps> = ({
  requests,
  onSelectRequest,
  onRequestAction
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-4">
      {requests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No requests found
        </div>
      ) : (
        requests.map((request, index) => (
          <Card 
            key={request.id} 
            className="hover:shadow-md transition-all duration-200 cursor-pointer hover-scale animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => onSelectRequest(request)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-900">{request.studentName}</span>
                    <Badge variant="outline" className="text-xs">
                      {request.studentId}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Field:</span> {request.fieldToCorrect}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">From:</span> {request.currentValue}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">To:</span> {request.requestedValue}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={getPriorityColor(request.priority)}>
                      {request.priority.toUpperCase()}
                    </Badge>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      {request.status.toUpperCase()}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(request.submittedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {request.status === 'pending' && (
                  <div className="flex gap-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-green-600 hover:bg-green-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRequestAction(request.id, 'approve');
                      }}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRequestAction(request.id, 'reject');
                      }}
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
