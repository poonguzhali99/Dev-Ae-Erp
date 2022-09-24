import React, { lazy } from 'react';

const Dashboard = lazy(() => import('./src/pages/private/dashboard'));
const AssesmentMarksEntry = lazy(() => import('./src/pages/private/assesment'));
export const routes = [
	{
		path: '/dashboard',
		name: 'Dashboard',
		icon: 'home',
		element: () => <Dashboard />
	},
	{
		path: '/AssesmentMarksEntry',
		name: 'AssesmentMarksEntry',
		icon: 'home',
		element: () => <AssesmentMarksEntry />
	}
];
