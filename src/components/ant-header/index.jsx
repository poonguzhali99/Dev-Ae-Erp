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

import logo from '../../assets/images/Andrews_Logo.png';
import aeErpLogo from '../../assets/images/Erp_White.png';
import './style.scss';
import { logOut } from '../../services/auth/action';

const { Header } = Layout;
const { Panel } = Collapse;
const { Option } = Select;

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

	const items = [
		{
			label: 'Admission',
			key: 'mail',
			// icon: <ContainerOutlined />,

			children: [
				{
					label: 'Admission Setup',
					key: 'setup'
				},
				{
					label: 'Admission Count',
					key: 'count'
				}
			]
		},
		{
			label: 'Assesments',
			key: 'app',
			// icon: <ReadOutlined />,
			children: [
				{
					label: 'Teachers Marks Entry',
					key: 'AssesmentMarksEntry'
				},
				{
					label: 'Marks Entry Status',
					key: 'AssesmentMarksEntryStatus'
				},
				{
					label: 'Report Card',
					key: 'ReportCard'
				}
			]
		},
		{
			label: 'Notification Group',
			key: 'SubMenu'
			// icon: <MessageOutlined />
		}
	];

	return (
		<div className="header-container">
			<Header className="w-100" color="primary" expand="md" fixed="top">
				{/* {isLoggedIn && <AntDrawer onClose={showLeftDrawer} visible={visibleLeft} isLoggedIn={isLoggedIn} />} */}
				{/* {isLoggedIn && (
				<div className="d-flex align-items-center">
					<MenuUnfoldOutlined className="menu-icon" onClick={showLeftDrawer} />
				</div>
			)} */}

				{isLoggedIn && (
					<Link to="/" className="w-10">
						<img className="logo" src={logo} />
					</Link>
				)}
				<div className="menu-container">
					<div className="bg-warning w-100  align-items-center justify-content-end">
						{isLoggedIn ? (
							<Menu className="bg-primary w-100 text-white " mode="horizontal">
								<Menu.Item key="1" onClick={() => navigate('/')}>
									Home
								</Menu.Item>
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
					</div>
				</div>
				<Link to="/" className="logo-container w-10">
					<img alt="AE ERP Home" src={aeErpLogo} />
				</Link>
			</Header>

			{isLoggedIn && (
				<Menu
					className="menu-bar"
					onClick={(e) => {
						console.log(e);
						navigate(e.key);
					}}
					mode="horizontal"
					items={items}
				/>
			)}
		</div>
	);
};

export default AntHeader;
