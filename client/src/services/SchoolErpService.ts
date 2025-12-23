import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./index";

export const schoolErpApi = createApi({
  reducerPath: "schoolErpApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl + "/api",
    credentials: "include",
  }),
  tagTypes: [
    "AcademicSession",
    "Class",
    "Subject",
    "Attendance",
    "Fee",
    "Exam",
    "Result",
    "Timetable",
  ],
  endpoints: (builder) => ({
    // ============ ACADEMIC SESSION ============
    getSessions: builder.query({
      query: () => "/academic-sessions",
      providesTags: ["AcademicSession"],
    }),
    getActiveSession: builder.query({
      query: () => "/academic-sessions/active",
      providesTags: ["AcademicSession"],
    }),
    createSession: builder.mutation({
      query: (data) => ({
        url: "/academic-sessions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AcademicSession"],
    }),
    updateSession: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/academic-sessions/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AcademicSession"],
    }),
    setActiveSession: builder.mutation({
      query: (id) => ({
        url: `/academic-sessions/${id}/set-active`,
        method: "POST",
      }),
      invalidatesTags: ["AcademicSession"],
    }),

    // ============ CLASS ============
    getClasses: builder.query({
      query: (params) => ({
        url: "/classes",
        params,
      }),
      providesTags: ["Class"],
    }),
    getClass: builder.query({
      query: (id) => `/classes/${id}`,
      providesTags: ["Class"],
    }),
    createClass: builder.mutation({
      query: (data) => ({
        url: "/classes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Class"],
    }),
    updateClass: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/classes/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Class"],
    }),
    addSection: builder.mutation({
      query: ({ classId, ...data }) => ({
        url: `/classes/${classId}/sections`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Class"],
    }),
    deleteClass: builder.mutation({
      query: (id) => ({
        url: `/classes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Class"],
    }),

    // ============ SUBJECT ============
    getSubjects: builder.query({
      query: (params) => ({
        url: "/subjects",
        params,
      }),
      providesTags: ["Subject"],
    }),
    getSubjectsByClass: builder.query({
      query: (classId) => `/subjects/by-class/${classId}`,
      providesTags: ["Subject"],
    }),
    createSubject: builder.mutation({
      query: (data) => ({
        url: "/subjects",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subject", "Class"],
    }),
    bulkCreateSubjects: builder.mutation({
      query: (data) => ({
        url: "/subjects/bulk",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subject", "Class"],
    }),
    assignTeacher: builder.mutation({
      query: ({ subjectId, teacherId }) => ({
        url: `/subjects/${subjectId}/assign-teacher`,
        method: "PATCH",
        body: { teacherId },
      }),
      invalidatesTags: ["Subject"],
    }),

    // ============ ATTENDANCE ============
    getAttendance: builder.query({
      query: (params) => ({
        url: "/attendance",
        params,
      }),
      providesTags: ["Attendance"],
    }),
    getStudentAttendance: builder.query({
      query: ({ studentId, ...params }) => ({
        url: `/attendance/student/${studentId}`,
        params,
      }),
      providesTags: ["Attendance"],
    }),
    getStudentsForAttendance: builder.query({
      query: ({ classId, section, date }) => ({
        url: `/attendance/students/${classId}/${section}`,
        params: { date },
      }),
    }),
    markAttendance: builder.mutation({
      query: (data) => ({
        url: "/attendance/mark",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Attendance"],
    }),
    getAttendanceReport: builder.query({
      query: ({ classId, ...params }) => ({
        url: `/attendance/report/class/${classId}`,
        params,
      }),
      providesTags: ["Attendance"],
    }),

    // ============ FEE ============
    getFeeStructures: builder.query({
      query: (params) => ({
        url: "/fees/structures",
        params,
      }),
      providesTags: ["Fee"],
    }),
    createFeeStructure: builder.mutation({
      query: (data) => ({
        url: "/fees/structures",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Fee"],
    }),
    collectFee: builder.mutation({
      query: (data) => ({
        url: "/fees/payments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Fee"],
    }),
    getPayments: builder.query({
      query: (params) => ({
        url: "/fees/payments",
        params,
      }),
      providesTags: ["Fee"],
    }),
    getPaymentByReceipt: builder.query({
      query: (receiptNo) => `/fees/payments/receipt/${receiptNo}`,
    }),
    getStudentDues: builder.query({
      query: (studentId) => `/fees/dues/student/${studentId}`,
      providesTags: ["Fee"],
    }),
    getPendingDues: builder.query({
      query: (params) => ({
        url: "/fees/dues",
        params,
      }),
      providesTags: ["Fee"],
    }),
    generateFeeDues: builder.mutation({
      query: (data) => ({
        url: "/fees/dues/generate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Fee"],
    }),
    getFeeSummary: builder.query({
      query: (params) => ({
        url: "/fees/summary",
        params,
      }),
      providesTags: ["Fee"],
    }),

    // ============ EXAM ============
    getExams: builder.query({
      query: (params) => ({
        url: "/exams",
        params,
      }),
      providesTags: ["Exam"],
    }),
    getExam: builder.query({
      query: (id) => `/exams/${id}`,
      providesTags: ["Exam"],
    }),
    createExam: builder.mutation({
      query: (data) => ({
        url: "/exams",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Exam"],
    }),
    updateExam: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/exams/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Exam"],
    }),
    getExamResults: builder.query({
      query: ({ examId, ...params }) => ({
        url: `/exams/${examId}/results`,
        params,
      }),
      providesTags: ["Result"],
    }),
    getStudentResults: builder.query({
      query: ({ studentId, ...params }) => ({
        url: `/exams/results/student/${studentId}`,
        params,
      }),
      providesTags: ["Result"],
    }),
    enterMarks: builder.mutation({
      query: ({ examId, ...data }) => ({
        url: `/exams/${examId}/results`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Result"],
    }),
    bulkEnterMarks: builder.mutation({
      query: ({ examId, results }) => ({
        url: `/exams/${examId}/results/bulk`,
        method: "POST",
        body: { results },
      }),
      invalidatesTags: ["Result"],
    }),
    publishResults: builder.mutation({
      query: (examId) => ({
        url: `/exams/${examId}/results/publish`,
        method: "POST",
      }),
      invalidatesTags: ["Exam", "Result"],
    }),
    getExamStatistics: builder.query({
      query: (examId) => `/exams/${examId}/statistics`,
      providesTags: ["Result"],
    }),

    // ============ TIMETABLE ============
    getTimetables: builder.query({
      query: (params) => ({
        url: "/timetable",
        params,
      }),
      providesTags: ["Timetable"],
    }),
    getTimetable: builder.query({
      query: (id) => `/timetable/${id}`,
      providesTags: ["Timetable"],
    }),
    getTeacherTimetable: builder.query({
      query: ({ teacherId, ...params }) => ({
        url: `/timetable/teacher/${teacherId}`,
        params,
      }),
      providesTags: ["Timetable"],
    }),
    createTimetable: builder.mutation({
      query: (data) => ({
        url: "/timetable",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Timetable"],
    }),
    updateTimetable: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/timetable/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Timetable"],
    }),
    updateDaySchedule: builder.mutation({
      query: ({ id, day, periods }) => ({
        url: `/timetable/${id}/day/${day}`,
        method: "PATCH",
        body: { periods },
      }),
      invalidatesTags: ["Timetable"],
    }),
    copyTimetable: builder.mutation({
      query: ({ id, targetSection }) => ({
        url: `/timetable/${id}/copy`,
        method: "POST",
        body: { targetSection },
      }),
      invalidatesTags: ["Timetable"],
    }),
  }),
});

export const {
  // Academic Session
  useGetSessionsQuery,
  useGetActiveSessionQuery,
  useCreateSessionMutation,
  useUpdateSessionMutation,
  useSetActiveSessionMutation,
  // Class
  useGetClassesQuery,
  useGetClassQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useAddSectionMutation,
  useDeleteClassMutation,
  // Subject
  useGetSubjectsQuery,
  useGetSubjectsByClassQuery,
  useCreateSubjectMutation,
  useBulkCreateSubjectsMutation,
  useAssignTeacherMutation,
  // Attendance
  useGetAttendanceQuery,
  useGetStudentAttendanceQuery,
  useGetStudentsForAttendanceQuery,
  useMarkAttendanceMutation,
  useGetAttendanceReportQuery,
  // Fee
  useGetFeeStructuresQuery,
  useCreateFeeStructureMutation,
  useCollectFeeMutation,
  useGetPaymentsQuery,
  useGetPaymentByReceiptQuery,
  useGetStudentDuesQuery,
  useGetPendingDuesQuery,
  useGenerateFeeDuesMutation,
  useGetFeeSummaryQuery,
  // Exam
  useGetExamsQuery,
  useGetExamQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useGetExamResultsQuery,
  useGetStudentResultsQuery,
  useEnterMarksMutation,
  useBulkEnterMarksMutation,
  usePublishResultsMutation,
  useGetExamStatisticsQuery,
  // Timetable
  useGetTimetablesQuery,
  useGetTimetableQuery,
  useGetTeacherTimetableQuery,
  useCreateTimetableMutation,
  useUpdateTimetableMutation,
  useUpdateDayScheduleMutation,
  useCopyTimetableMutation,
} = schoolErpApi;
