import React, { useEffect, useState, Suspense } from 'react';
import { Card, CardBody, FormGroup, Label, Alert, Modal, ModalBody, Media } from 'reactstrap';
import { Formik, Form } from 'formik';
import { Button, Row, Col, Typography, Space, Divider } from 'antd';
import './style.scss';
import FormField from '../../../components/form-field';
import API_CALL from '../../../services';
import { Link, useNavigate } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import Loader from '../../../components/Loader';
import { logIn } from '../../../services/auth/action';

import bpLogin from '../../../assets/images/bp-login.png';
// import Header from '../../components/header';
import { save } from 'react-cookies';

const Login = () => {
	let pathName = window.location.pathname;
	console.log('login', pathName);
	const navigate = useNavigate(),
		dispatch = useDispatch(),
		[ loginError, setloginError ] = useState(false),
		[ loader, setLoader ] = useState(false),
		[ alreadyLogin, setAlreadyLogin ] = useState(false),
		[ errorMessage, seterrorMessage ] = useState(),
		[ loginCreds, setloginCreds ] = useState(),
		[ logo, setLogo ] = useState('https://dev7.ae-erp.in/img/bplog.png'),
		[ orgLogo, setOrgLogo ] = useState('');
	useEffect(
		() => {
			if (pathName == '/SLESBP') {
				setLogo('https://dev2.ae-erp.in/Content/img/SLESBPLOGO.png');
			}
		},
		[ pathName ]
	);
	return (
		<div>
			<div className="container-fluid login">
				{/* <Loader show={loader} dark={true}> */}
				<Formik
					initialValues={
						window.location.host.search('localhost') >= 0 ? (
							{ EmailId: 'admin.bp@sas.com', Password: 'Ae$12345' }
						) : (
							{ EmailId: '', Password: '' }
						)
					}
					validate={(values) => {
						let errors = {};
						if (!values.EmailId) errors.EmailId = 'Required';
						if (!values.Password) errors.Password = 'Required';
						else if (values.Password.length > 40)
							errors.Password = 'Password should not be more than 40 Charecters';
						return errors;
					}}
					onSubmit={(values) => {
						setloginError(false);
						setLoader(true);
						API_CALL({
							method: 'post',
							url: 'Login/LoginUser',
							data: values,
							callback: async ({ status, data }) => {
								if (status === 200 && data.Userrole == 'Admin') {
									save('session', values.EmailId, { secure: true });
									save('userdetails', data);
									setLoader(false);
									dispatch(logIn(data));
								} else {
									setLoader(false);
									setloginError(true);
								}
							}
						});
					}}
				>
					{({ values, handleSubmit }) => (
						<div className="d-flex justify-content-center">
							<img src={bpLogin} />
							<Form className="ml-4 align-self-center">
								<Typography.Title level={3}>Login</Typography.Title>
								<FormField
									name="EmailId"
									type="text"
									placeholder="Enter Email"
									// label="Email"
									required={true}
								/>
								<FormField
									name="Password"
									type="password"
									placeholder="Enter Email"
									// label="Password"
									required={true}
								/>
								<div className="d-flex justify-content-between">
									<Button type="link" block>
										Forgot Password?
									</Button>
									<Button block loading={loader} type="primary" onClick={handleSubmit}>
										Login
									</Button>
								</div>
								<FormField
									name="Checkbox"
									type="checkbox"
									value={true}
									placeholder="Enter Email"
									label="I have read and accept the Terms & Conditions and Privacy Policy of AE ERP Portal."
									required={true}
								/>
							</Form>
						</div>
					)}
				</Formik>
				{/* </Loader> */}
				<Divider orientation="right">Copyright © 2020 AE Enterprises. All rights reserved.</Divider>
				{/* <Row style={{ justifyContent: 'center', marginLeft: '150px', marginTop: '20px' }}>
					Copyright © 2020 AE Enterprises. All rights reserved.
				</Row> */}
			</div>
		</div>
	);
};

export default Login;
