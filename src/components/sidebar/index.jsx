import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { List } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.scss';
import { routes } from '../../../routes';

const Sidebar = () => {
	// const { userDetails, totalInstantChatUnreadCount } = useSelector(({ detailsReducer, instantChatReducer }) => {
	// 	return {
	// 		userDetails: detailsReducer.response,
	// 		totalInstantChatUnreadCount: instantChatReducer.response.totalInstantChatUnreadCount
	// 	};
	// }, shallowEqual);

	const navigation = [ 'Checklist', 'Checklist Item-1', 'Checklist Item-2', 'Checklist Item-3', 'Checklist Item-4' ];

	return (
		<div className="sidebar">
			<List className="nav-menu-items">
				{routes.map(
					(route, index) =>
						navigation.indexOf(route.name) >= 0 && (
							<NavLink key={index} to={route.path} activeClassName="selected">
								<li className="nav-icon" title={route.name}>
									<FontAwesomeIcon icon={[ 'fas', route.icon ]} />
								</li>
							</NavLink>
						)
				)}
			</List>
		</div>
	);
};

export default Sidebar;
