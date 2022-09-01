import React, { useState, useEffect, Fragment, Suspense, lazy, useCallback } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Sound from 'react-sound';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import { load } from 'react-cookies';

//antd
import { Layout, ConfigProvider, Spin } from 'antd';

// Pages
const Login = lazy(() => import('./src/pages/public/login'));
const Home = lazy(() => import('./src/pages/public/home'));

// Components

// Actions

// Others
import API_CALL from './src/services';
import { routes } from './routes';
import { constants } from './src/utils/constants';
import sound from './src/assets/sounds/pristine.mp3';

import 'antd/dist/antd.variable.min.css';
// import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
// import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
// import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
// import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './src/assets/common_styles/antdOverrideStyles.scss';
import 'assets/common_styles/fluent-ui.scss';
import 'assets/common_styles/style.scss';
import 'assets/common_styles/responsive.scss';
import 'react-datetime/css/react-datetime.css';

import { logIn, logOut } from './src/services/auth/action';

const { Content } = Layout;
const App = React.memo(() => {
	const dispatch = useDispatch();
	const { isLoggedIn } = useSelector(({ authReducer }) => {
		return {
			isLoggedIn: authReducer.isLoggedIn
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
		validateAuth();
	}, []);
	const validateAuth = () => {
		const session = load('session');
		let userdetails = load('userdetails');
		console.log('userdetails', userdetails);
		// dispatch(getUserDetails(userDetails));
		if (session) {
			dispatch(logIn(session));
		} else {
			dispatch(logOut());
		}
	};

	useEffect(
		() => {
			if (isLoggedIn) {
				// dispatch(getAccessControl());
				// dispatch(getUserDetails());
				// dispatch(getStaticContent());
			}
		},
		[ isLoggedIn ]
	);

	const renderSection = () =>
		isLoggedIn ? (
			<Layout>
				{/* <AntHeader expand={expand} /> */}
				<Layout>
					{/* <AntSidebar expand={expand} onCollapse={onCollapse} /> */}
					<Content className="site-layout-background">
						<div className="content-layout">
							<Routes>
								{routes.map((route, index) => (
									<Route key={index} path={route.path} element={<route.element />} />
								))}
								<Route path="*" element={<Navigate to="/dashboard" replace />} />
							</Routes>
						</div>
					</Content>
				</Layout>
			</Layout>
		) : (
			<Layout className={`${window.location.pathname == '/instantchat' ? 'instant-chat' : 'public-routes'}`}>
				<Content>
					<Routes>
						<Route path="/home" element={<Home />} />
						<Route path="/SLESBP" element={<Login />} />
						<Route path="/LEETMP" element={<Login />} />
						<Route path="/SLESAK" element={<Login />} />
						<Route path="/SLESKS" element={<Login />} />
						<Route path="/WMA" element={<Login />} />
						<Route path="*" element={<Navigate to="/home" replace />} />
					</Routes>
				</Content>
			</Layout>
		);
	return (
		<React.Fragment>
			<Fragment>
				{/* <Sound
					url={sound}
					playStatus={soundReducer.status ? 'PLAYING' : 'STOPPED'}
					autoLoad={true}
					loop={true}
				/> */}
				<Suspense
					fallback={
						<div className=" d-flex justify-content-center app-spin">
							<Spin size="large" spinning={true} />
						</div>
					}
				>
					{renderSection()}
				</Suspense>
			</Fragment>
		</React.Fragment>
	);
});

export default App;
