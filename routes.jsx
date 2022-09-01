import React, { lazy } from 'react';

const Dashboard = lazy(() => import('./src/pages/private/dashboard'));

export const routes = [
	{
		path: '/dashboard',
		name: 'Dashboard',
		icon: 'home',
		element: () => <Dashboard />
	}
];
