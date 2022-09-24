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
	const { authReducer: { isLoggedIn }, userDetails } = useSelector(({ authReducer, userDetailsReducer }) => {
		return {
			authReducer,
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

	return (
		<Header color="primary" expand="md" fixed="top">
			{/* {isLoggedIn && <AntDrawer onClose={showLeftDrawer} visible={visibleLeft} isLoggedIn={isLoggedIn} />} */}
			{/* {isLoggedIn && (
				<div className="d-flex align-items-center">
					<MenuUnfoldOutlined className="menu-icon" onClick={showLeftDrawer} />
				</div>
			)} */}

			{isLoggedIn && (
				<Link to="/">
					<img className="logo" src={logo} />
				</Link>
			)}

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
