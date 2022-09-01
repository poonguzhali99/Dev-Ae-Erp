import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Nav } from 'reactstrap';
import './style.scss';
import BentoMenu from '../bento-menu';
import { routes } from '../../../../routes';

const SideNav = () => {
	const [ sideNav, setSideNav ] = useState(false);

	// const { userDetails, totalInstantChatUnreadCount } = useSelector(({ detailsReducer, instantChatReducer }) => {
	// 	return {
	// 		userDetails: detailsReducer.response,
	// 		totalInstantChatUnreadCount: instantChatReducer.response.totalInstantChatUnreadCount
	// 	};
	// }, shallowEqual);

	const showSideNavHandler = () => setSideNav(!sideNav);
	const navigation = [ 'Checklist', 'Checklist Item-1', 'Checklist Item-2', 'Checklist Item-3', 'Checklist Item-4' ];
	return (
		<Fragment>
			<div onClick={showSideNavHandler}>
				<Link to="#">
					<BentoMenu />
				</Link>
			</div>
			<Nav className={sideNav ? 'side-nav-menu active' : 'side-nav-menu'} onClick={showSideNavHandler}>
				<ul
					className="side-nav-menu-items"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
				>
					<li className="side-navbar-toggle" onClick={showSideNavHandler}>
						<Link to="#" className="ml-3">
							<BentoMenu />
						</Link>
						{/* <Link to="/" className="navbar-brand">
							<img
								src={
									userDetails.organization && userDetails.organization.image ? (
										userDetails.organization.imageUrl
									) : (
										logo
									)
								}
							/>
						</Link> */}
					</li>
					{routes.map(
						(route, index) =>
							navigation.indexOf(route.name) >= 0 && (
								<li
									key={index}
									className="side-nav-text"
									title={route.name}
									onClick={showSideNavHandler}
								>
									<Link to={route.path}>
										<FontAwesomeIcon icon={[ 'fas', route.icon ]} />
										<span>{route.name}</span>
									</Link>
								</li>
							)
					)}
				</ul>
			</Nav>
		</Fragment>
	);
};

export default SideNav;
