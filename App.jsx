import React, { useState, useEffect, Fragment, Suspense, lazy, useCallback } from 'react';
import { Route, Routes, Switch, Navigate } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import { load, save } from 'react-cookies';

//antd
import { Layout, ConfigProvider, Spin } from 'antd';

// Pages
const Login = lazy(() => import('./src/pages/public/login'));
const Home = lazy(() => import('./src/pages/public/home'));
const AboutUs = lazy(() => import('./src/pages/public/static-content/about-us'));
const Privacy = lazy(() => import('./src/pages/public/static-content/privacy'));
const Terms = lazy(() => import('./src/pages/public/static-content/terms'));
const ContactUs = lazy(() => import('./src/pages/public/static-content/terms'));

// Components

// Actions

// Others
import { routes } from './routes';

// import 'antd/dist/antd.variable.min.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './src/assets/common_styles/antdOverrideStyles.scss';
import 'assets/common_styles/fluent-ui.scss';
import 'assets/common_styles/style.scss';
import 'assets/common_styles/responsive.scss';
import 'react-datetime/css/react-datetime.css';
import './src/assets/theams/leetmp.scss';
import './src/assets/theams/slesks.scss';
import './src/assets/theams/wma.scss';
import './src/assets/theams/slesak.scss';

// import '~antd/es/style/themes/default.less';
// import '~antd/dist/antd.less'; // Import Ant Design styles by less entry
// import './src/assets/theams/default.less';
// @import 'your-theme-file.less'; // variables to override above

import { logIn, logOut } from './src/services/auth/action';
// import Header from './src/components/header';
import AntSidebar from './src/components/ant-sidebar';
import AntHeader from './src/components/ant-header';
import {
	getAcademicYear,
	getBranch,
	setActiveAcademicYear,
	setActiveBranch
} from './src/services/academic-details/action';
import { getUserDetails } from './src/services/user-details/action';

const { Content } = Layout;
const App = React.memo(() => {
	const [ expand, setExpand ] = useState(true);
	const dispatch = useDispatch();
	const {
		authReducer: { isLoggedIn },
		academicYearList,
		userDetails
	} = useSelector(({ authReducer, userDetailsReducer, academicYearReducer }) => {
		return {
			authReducer,
			academicYearList: academicYearReducer.response.availableAcademicYear,
			userDetails: userDetailsReducer.response
		};
	}, shallowEqual);

	useEffect(() => {
		// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
		let vh = window.innerHeight * 0.01;
		// Then we set the value in the --vh custom property to the root of the document
		document.documentElement.style.setProperty('--vh', `${vh}px`);
		// We listen to the resize event
		window.addEventListener('resize', () => {
			// We execute the same script as before
			let vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		});
		// getAcademicYear();
		dispatch(getAcademicYear());
		validateAuth();
	}, []);
	const validateAuth = () => {
		const session = load('session');
		// console.log('session', session);
		let userdetails = load('userdetails');
		save('userdetails', userdetails);
		// console.log('userdetails', userdetails);
		!_isEmpty(userdetails) && dispatch(getUserDetails(userdetails));
		if (session) {
			dispatch(getBranch());
			dispatch(logIn(session));
			// userdetails && dispatch(setActiveBranch(userdetails.Userbranch));
		} else {
			dispatch(logOut());
		}
	};
	useEffect(
		() => {
			if (Array.isArray(academicYearList) && academicYearList.length > 0) {
				dispatch(setActiveAcademicYear(academicYearList[1].U_VALUS));
			}
		},
		[ academicYearList ]
	);

	useEffect(
		() => {
			if (!_isEmpty(userDetails)) {
				dispatch(getBranch());
				dispatch(setActiveBranch(userDetails.Userbranch));
			}
		},
		[ userDetails ]
	);

	useEffect(
		() => {
			if (isLoggedIn) {
			}
		},
		[ isLoggedIn ]
	);
	const onCollapse = useCallback(
		() => {
			setExpand((prevCollapse) => !prevCollapse);
		},
		[ expand ]
	);

	const renderSection = () =>
		isLoggedIn ? (
			<Layout>
				<AntHeader expand={expand} />
				<Layout>
					{/* <AntSidebar expand={expand} onCollapse={onCollapse} /> */}
					<Content className="site-layout-background">
						<div className="content-layout">
							<Routes>
								{routes.map((route, index) => (
									<Route key={index} path={route.path} element={<route.element />} />
								))}
								<Route path="/" element={<Navigate to="/Dashboard" replace />} />
							</Routes>
						</div>
					</Content>
				</Layout>
			</Layout>
		) : (
			<Layout className="public-routes">
				<AntHeader expand={expand} />
				<Content>
					<Routes>
						<Route path="/Welcome" element={<Home />} />
						<Route path="/SLESBP" element={<Login />} />
						<Route path="/LEETMP" element={<Login />} />
						<Route path="/SLESAK" element={<Login />} />
						<Route path="/SLESKS" element={<Login />} />
						<Route path="/WMA" element={<Login />} />
						<Route path="/About" element={<AboutUs />} />
						<Route path="/Privacy" element={<Privacy />} />
						<Route path="/Terms" element={<Terms />} />
						{/* <Route index path="*" element={<Login />} /> */}
						<Route path="/" element={<Navigate to="/Welcome" replace />} />
					</Routes>
				</Content>
			</Layout>
		);
	return (
		<ConfigProvider>
			<Suspense
				fallback={
					<div className=" d-flex justify-content-center app-spin">
						<Spin size="large" spinning={true} />
					</div>
				}
			>
				{renderSection()}
			</Suspense>
		</ConfigProvider>
	);
});

export default App;
