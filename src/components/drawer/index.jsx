import React from 'react';
import { Drawer } from 'antd';
import { MenuFoldOutlined } from '@ant-design/icons';
import _isEmpty from 'lodash/isEmpty';

import logo from '../../assets/images/Andrews_Logo.png';
import aeErpLogo from '../../assets/images/Erp_White.png';
import SideMenu from '../side-menu';
import './style.scss';

const AntDrawer = ({ onClose, visible, isLoggedIn }) => (
	<Drawer
		width={270}
		title={
			<div className="header-title" onClick={onClose}>
				<MenuFoldOutlined className="menu-icon" />
				{isLoggedIn && <img className="logo" alt="Logo" src={isLoggedIn ? logo : aeErpLogo} />}
			</div>
		}
		placement="left"
		closable={false}
		onClose={onClose}
		visible={visible}
	>
		<SideMenu onCloseDrawer={onClose} />
	</Drawer>
);

export default AntDrawer;
