import React from 'react';
import { useSelector } from 'react-redux';
import { NavbarText, Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';
import { useNavigate, Link } from 'react-router-dom';
import _get from 'lodash/get';

//others
import './style.scss';
import home from '../../assets/images/home.png';
// import { getAppText as AppText } from '../../language';
import logoutIcon from '../../assets/images/logoutIcon.svg';
import { logOut } from '../../services/auth/action';
import Sidebar from '../sidebar';
import SideNav from './side-nav';

const Header = () => {
	// const { userName } = useSelector(({ AuthReducer }) => ({
	// 	userName: _get(AuthReducer, 'name', '')
	// }));
	const navigate = useNavigate();
	const navigateToDashboard = () => {
		navigate('/');
	};

	return (
		<div>
			<Navbar className="header" color="primary" expand="md" fixed="top">
				<Nav>
					<div className="my-3 mx-3">
						<SideNav />
					</div>
					{/* <NavbarBrand href="/">
						<img src={home} className="header_logo" alt="Logo" />
					</NavbarBrand> */}
					<NavbarText className="text-light cursor_p d-flex align-items-center" onClick={navigateToDashboard}>
						<h5>Anand Food Products, Hyderabad</h5>
					</NavbarText>
				</Nav>
				<Nav className="align-items-center">
					<NavbarText>
						<small className="text-light me-2">Hello! </small>
					</NavbarText>
					<NavbarText className="text-light">Suresh Reddy</NavbarText>
					<NavItem className="user_logo"> SR </NavItem>
					<div className="vl" />
					<NavItem>
						<Link className="text-light text-decoration-none" to="/login" onClick={logOut}>
							<img title={'Logout'} width="30px" height="30px" src={logoutIcon} />
						</Link>
					</NavItem>
				</Nav>
			</Navbar>
		</div>
	);
};

export default Header;
