import React, { lazy } from 'react';

const Dashboard = lazy(() => import('./src/pages/private/dashboard'));
const AssesmentMarksEntry = lazy(() => import('./src/pages/private/assesment'));
const ReportCard = lazy(() => import('./src/pages/private/assesment/ReportCard'));
const AssesmentMarksEntryStatus = lazy(() => import('./src/pages/private/assesment/MarksEntryStatus'));
const ConsolidatedStagesReport = lazy(() => import('./src/pages/private/admission/ConsolidatedStagesReport'));
const AdmissionCount = lazy(() => import('./src/pages/private/admission/AdmissionCount'));
const AdmissionSetup = lazy(() => import('./src/pages/private/admission/AdmissionSetup'));
const AdmissionPlanningView = lazy(() => import('./src/pages/private/admission/AdmissionPlanningView'));
const DetailedStagesReport = lazy(() => import('./src/pages/private/admission/DetailedStagesReport'));
const AdmissionVerification = lazy(() => import('./src/pages/private/admission/AdmissionVerification'));
const StudentManagement = lazy(() => import('./src/pages/private/student-management'));
const StudentDetails = lazy(() => import('./src/components/student-form'));
const AttendanceInstructions = lazy(() => import('./src/pages/private/attendance/instructions'));
const MarkAttendance = lazy(() => import('./src/pages/private/attendance/mark-attendance'));
const TeacherMapping = lazy(() => import('./src/pages/private/teacher-mapping'));

export const routes = [
	{
		path: '/Dashboard',
		name: 'Dashboard',
		element: () => <Dashboard />
	},
	{
		path: '/AssesmentMarksEntry',
		name: 'AssesmentMarksEntry',
		element: () => <AssesmentMarksEntry />
	},
	{
		path: '/ReportCard',
		name: 'Report Card',
		element: () => <ReportCard />
	},
	{
		path: '/AssesmentMarksEntryStatus',
		name: 'AssesmentMarksEntryStatus',
		element: () => <AssesmentMarksEntryStatus />
	},
	{
		path: '/ConsolidatedStagesReport',
		name: 'ConsolidatedStagesReport',
		element: () => <ConsolidatedStagesReport />
	},
	{
		path: '/AdmissionCount',
		name: 'AdmissionCount',
		element: () => <AdmissionCount />
	},
	{
		path: '/AdmissionSetup',
		name: 'AdmissionSetup',
		element: () => <AdmissionSetup />
	},
	{
		path: '/AdmissionPlanningView',
		name: 'AdmissionPlanningView',
		element: () => <AdmissionPlanningView />
	},
	{
		path: '/DetailedStagesReport',
		name: 'DetailedStagesReport',
		element: () => <DetailedStagesReport />
	},
	{
		path: '/AdmissionVerification',
		name: 'AdmissionVerification',
		element: () => <AdmissionVerification />
	},
	{
		path: '/StudentManagement',
		name: 'StudentManagement',
		element: () => <StudentManagement />
	},
	{
		path: '/StudentDetails/*',
		name: 'StudentDetails',
		element: () => <StudentDetails />
	},
	{
		path: '/AttendanceInstructions',
		name: 'AttendanceInstructions',
		element: () => <AttendanceInstructions />
	},
	{
		path: '/MarkAttendance',
		name: 'MarkAttendance',
		element: () => <MarkAttendance />
	},
	{
		path: '/TeacherMapping',
		name: 'TeacherMapping',
		element: () => <TeacherMapping />
	}
];
