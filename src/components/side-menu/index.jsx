import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Collapse, List, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _findIndex from 'lodash/findIndex';

import { routes } from '../../../routes';
import { constants } from '../../utils/constants';
import './style.scss';

const SideMenu = React.memo(({ onCloseDrawer }) => {
	const selectedMenu = `/${location.pathname.split('/')[1]}`;

	return (
		<Menu mode="inline" selectedKeys={[ selectedMenu ]}>
			<Collapse accordion className="side-nav-menu-items">
				{menuList.map((menu, index) => {
					return (
						<Collapse.Panel className="menu-title" header={menu.MenuAuthorization} key={index}>
							{menu.SubMenuAuthorization == true ? (
								<List
									dataSource={menu.SubMenuDetails}
									renderItem={(item) => (
										<Button type="text" size="large" block>
											{item.MenuAuthorization}
										</Button>
									)}
								/>
							) : (
								<div>{menu.MenuAuthorization}</div>
							)}
						</Collapse.Panel>
					);
				})}
			</Collapse>
			{/* </div> */}
			{/* {userDetails.userType &&
				routes[userDetails.userType].map(
					(route, index) =>
						userDetails.navigation.indexOf(route.name) >= 0 && (
							<Menu.Item
								key={route.link ? route.link : route.path}
								icon={
									route.path == '/custombot' && hasConfig(constants.orgConfig.chatBot) ? (
										<FontAwesomeIcon icon={[ 'fas', route.icon ]} />
									) : (
										<FontAwesomeIcon
											icon={[ route.iconType ? route.iconType : 'fas', route.icon ]}
										/>
									)
								}
								onClick={() => {
									onCloseDrawer && onCloseDrawer();
								}}
							>
								<Link to={route.link ? route.link : route.path}>{route.name}</Link>
							</Menu.Item>
						)
				)} */}
		</Menu>
	);
});

export default SideMenu;
