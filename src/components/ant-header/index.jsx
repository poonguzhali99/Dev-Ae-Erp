import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import _isEmpty from 'lodash/isEmpty';
import _find from 'lodash/find';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	Layout,
	Menu,
	Space,
	Dropdown,
	Button,
	Popover,
	Badge,
	Avatar,
	Collapse,
	Drawer,
	Select,
	List,
	Typography
} from 'antd';
const { Header } = Layout;
const { Panel } = Collapse;
const { Option } = Select;
import { MenuUnfoldOutlined } from '@ant-design/icons';
import { Media } from 'reactstrap';

import AntDrawer from '../drawer';

import logo from '../../assets/images/Andrews_Logo.png';
import aeErpLogo from '../../assets/images/Erp_White.png';
import './style.scss';
import { logOut } from '../../services/auth/action';

const AntHeader = () => {
	const { isLoggedIn, userDetails } = useSelector(({ authReducer, userDetailsReducer }) => {
		return {
			isLoggedIn: authReducer.isLoggedIn,
			userDetails: userDetailsReducer.response
		};
	}, shallowEqual);

	const navigate = useNavigate();
	const [ visibleLeft, setVisibleLeft ] = useState(false);
	const [ visibleTop, setVisibleTop ] = useState(false),
		[ locations, setLocations ] = useState([]),
		[ location, setLocation ] = useState('');

	const showLeftDrawer = () => {
		setVisibleLeft((prev) => !prev);
	};

	const showTopDrawer = () => {
		setVisibleTop((prev) => !prev);
	};

	const langMenu = () => (
			<Menu selectable>
				{constants.languages.map(({ displayName, simpleCode, sourceCode }, index) => (
					<Menu.Item
						key={index}
						onClick={() => {
							dispatch(setLanguage(simpleCode));
							dispatch(setPrefferedLanguage(sourceCode));
						}}
					>
						{displayName}
					</Menu.Item>
				))}
			</Menu>
		),
		userMenu = () => (
			<Menu selectable className="d-none d-md-block">
				{(userDetails.userType === constants.role.executive ||
					userDetails.userType === constants.role.director ||
					userDetails.userType === constants.role.admin) && (
					<Menu.Item key={0} onClick={() => navigate('/customize')}>
						<FontAwesomeIcon icon={[ 'fas', 'building' ]} className="mr-2" />{' '}
						<Translate data="header.organizationSettings" />
					</Menu.Item>
				)}
				<Menu.Item key={1} onClick={() => navigate('/account')}>
					<FontAwesomeIcon icon={[ 'fas', 'cog' ]} className="mr-2" />{' '}
					<Translate data="header.accountSettings" />
				</Menu.Item>
				<Menu.Item
					key={2}
					onClick={() => {
						API_CALL('get', `user-management/logout/${userDetails.id}`, null, null, ({ data, status }) => {
							if (status === 200) {
								dispatch(logOut());
							}
						});
					}}
				>
					<FontAwesomeIcon icon={[ 'fas', 'sign-out-alt' ]} className="mr-2" />{' '}
					<Translate data="header.logout" />
				</Menu.Item>
			</Menu>
		);

	return (
		<Header color="primary" expand="md" fixed="top">
			{/* {isLoggedIn && <AntDrawer onClose={showLeftDrawer} visible={visibleLeft} isLoggedIn={isLoggedIn} />} */}
			{/* {isLoggedIn && (
				<div className="d-flex align-items-center">
					<MenuUnfoldOutlined className="menu-icon" onClick={showLeftDrawer} />
				</div>
			)} */}

			<Link to="/">
				<img
					className={`logo ${isLoggedIn ? 'bg-white' : 'bg-primary'}`}
					alt="Logo"
					src={isLoggedIn ? logo : aeErpLogo}
				/>
			</Link>

			{isLoggedIn ? (
				<Menu className="bg-primary w-100 text-white align-items-center justify-content-end" mode="horizontal">
					<Menu.Item key="1">Home</Menu.Item>
					<Menu.Item key="2">Communication</Menu.Item>
					<Menu.Item key="3">Edit Profile</Menu.Item>
					<Menu.Item key="4" onClick={logOut}>
						Logout
					</Menu.Item>
				</Menu>
			) : (
				<Menu mode="horizontal">
					<Menu.Item key="1" onClick={() => navigate('/About')}>
						About Us
					</Menu.Item>
					<Menu.Item key="2" onClick={() => navigate('/Privacy')}>
						Privacy
					</Menu.Item>
					<Menu.Item key="3" onClick={() => navigate('/Terms')}>
						Terms & Conditions
					</Menu.Item>
					<Menu.Item key="4">Contact Us</Menu.Item>
				</Menu>
			)}
			<Link to="/" className="logo-container">
				<img alt="AE ERP Home" src={aeErpLogo} />
			</Link>
		</Header>
	);
};

export default AntHeader;
