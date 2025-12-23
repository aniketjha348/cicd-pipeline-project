import React, { useState } from 'react';
import { 
  useGetClassesQuery,
  useGetActiveSessionQuery,
  useGetStudentsForAttendanceQuery,
  useMarkAttendanceMutation,
  useGetAttendanceReportQuery
} from '@/services/SchoolErpService';
import { Check, X, Clock, Minus, Loader2, Users, Calendar, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

interface Student {
  _id: string;
  name: string;
  rollNo: string;
  profilePic?: string;
  currentStatus?: 'present' | 'absent' | 'late' | 'half-day' | null;
}

const AttendanceManagement: React.FC = () => {
  const { data: activeSession } = useGetActiveSessionQuery({});
  const { data: classes } = useGetClassesQuery(
    { academicSession: activeSession?._id },
    { skip: !activeSession }
  );

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'mark' | 'report'>('mark');
  const [attendance, setAttendance] = useState<Record<string, string>>({});

  const selectedClassData = classes?.find((c: any) => c._id === selectedClass);

  const { data: students, isLoading: loadingStudents } = useGetStudentsForAttendanceQuery(
    { classId: selectedClass, section: selectedSection, date: selectedDate },
    { skip: !selectedClass || !selectedSection }
  );

  const { data: report } = useGetAttendanceReportQuery(
    { classId: selectedClass, section: selectedSection, academicSession: activeSession?._id },
    { skip: !selectedClass || !selectedSection || viewMode !== 'report' }
  );

  const [markAttendance, { isLoading: isMarking }] = useMarkAttendanceMutation();

  // Initialize attendance from existing data
  React.useEffect(() => {
    if (students) {
      const initial: Record<string, string> = {};
      students.forEach((s: Student) => {
        initial[s._id] = s.currentStatus || 'present';
      });
      setAttendance(initial);
    }
  }, [students]);

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status: string) => {
    if (!students) return;
    const all: Record<string, string> = {};
    students.forEach((s: Student) => {
      all[s._id] = status;
    });
    setAttendance(all);
  };

  const handleSubmit = async () => {
    if (!selectedClass || !selectedSection || !selectedDate) {
      toast.error('Please select class, section and date');
      return;
    }

    const attendanceData = Object.entries(attendance).map(([studentId, status]) => ({
      studentId,
      status,
    }));

    try {
      await markAttendance({
        classId: selectedClass,
        section: selectedSection,
        date: selectedDate,
        academicSession: activeSession?._id,
        attendanceData,
      }).unwrap();
      toast.success('Attendance marked successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to mark attendance');
    }
  };

  const statusConfig = {
    present: { icon: Check, color: 'bg-green-100 text-green-700 border-green-300', label: 'P' },
    absent: { icon: X, color: 'bg-red-100 text-red-700 border-red-300', label: 'A' },
    late: { icon: Clock, color: 'bg-yellow-100 text-yellow-700 border-yellow-300', label: 'L' },
    'half-day': { icon: Minus, color: 'bg-orange-100 text-orange-700 border-orange-300', label: 'H' },
  };

  if (!activeSession) {
    return (
      <div className="p-6">
        <div className="text-center py-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
          <p className="text-yellow-700 dark:text-yellow-400 font-medium">
            Please create and activate an academic session first
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Mark and view student attendance</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('mark')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              viewMode === 'mark'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Users className="w-4 h-4" /> Mark
          </button>
          <button
            onClick={() => setViewMode('report')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              viewMode === 'report'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedSection('');
              }}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Class</option>
              {classes?.map((c: any) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={!selectedClass}
            >
              <option value="">Select Section</option>
              {selectedClassData?.sections?.map((s: any) => (
                <option key={s._id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          {viewMode === 'mark' && selectedClass && selectedSection && (
            <div className="flex items-end gap-2">
              <button
                onClick={() => handleMarkAll('present')}
                className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200"
              >
                All Present
              </button>
              <button
                onClick={() => handleMarkAll('absent')}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
              >
                All Absent
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mark Attendance View */}
      {viewMode === 'mark' && (
        <>
          {loadingStudents ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : students && students.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Roll No</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Student</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {students.map((student: Student) => (
                      <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{student.rollNo}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {student.profilePic ? (
                              <img src={student.profilePic} alt="" className="w-8 h-8 rounded-full" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-medium">
                                {student.name?.charAt(0)}
                              </div>
                            )}
                            <span className="font-medium text-gray-900 dark:text-white">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            {Object.entries(statusConfig).map(([status, config]) => (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(student._id, status)}
                                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${
                                  attendance[student._id] === status
                                    ? config.color + ' border-current'
                                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-400'
                                }`}
                              >
                                <config.icon className="w-5 h-5" />
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Present: {Object.values(attendance).filter(s => s === 'present').length}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Absent: {Object.values(attendance).filter(s => s === 'absent').length}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    Late: {Object.values(attendance).filter(s => s === 'late').length}
                  </span>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isMarking}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isMarking ? 'Saving...' : 'Save Attendance'}
                </button>
              </div>
            </div>
          ) : selectedClass && selectedSection ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No students found in this class/section</p>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Select a class and section to mark attendance</p>
            </div>
          )}
        </>
      )}

      {/* Report View */}
      {viewMode === 'report' && report && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Student</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Present</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Absent</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Late</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Total</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {report.map((r: any) => (
                  <tr key={r.student._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900 dark:text-white">{r.student.name}</span>
                      <span className="text-sm text-gray-500 ml-2">({r.student.rollNo})</span>
                    </td>
                    <td className="px-4 py-3 text-center text-green-600">{r.present}</td>
                    <td className="px-4 py-3 text-center text-red-600">{r.absent}</td>
                    <td className="px-4 py-3 text-center text-yellow-600">{r.late}</td>
                    <td className="px-4 py-3 text-center">{r.total}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        r.percentage >= 75 ? 'bg-green-100 text-green-700' :
                        r.percentage >= 50 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {r.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
