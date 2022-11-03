import React, { lazy } from 'react';

const Dashboard = lazy(() => import('./src/pages/private/dashboard'));
const AssesmentMarksEntry = lazy(() => import('./src/pages/private/assesment'));
const ReportCard = lazy(() => import('./src/pages/private/assesment/ReportCard'));
const AssesmentMarksEntryStatus = lazy(() => import('./src/pages/private/assesment/MarksEntryStatus'));
export const routes = [
	{
		path: '/Dashboard',
		name: 'Dashboard',
		icon: 'home',
		element: () => <Dashboard />
	},
	{
		path: '/AssesmentMarksEntry',
		name: 'AssesmentMarksEntry',
		icon: 'home',
		element: () => <AssesmentMarksEntry />
	},
	{
		path: '/ReportCard',
		name: 'Report Card',
		icon: 'home',
		element: () => <ReportCard />
	},
	{
		path: '/AssesmentMarksEntryStatus',
		name: 'AssesmentMarksEntryStatus',
		icon: 'home',
		element: () => <AssesmentMarksEntryStatus />
	}
];
