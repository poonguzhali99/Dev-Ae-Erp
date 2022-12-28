import React, { useEffect, useState, Suspense } from 'react';
import { Card, CardBody, FormGroup, Label, Modal, ModalBody, Media } from 'reactstrap';
import { Formik, Form } from 'formik';
import { Button, Row, Col, Typography, Space, Divider, Alert, Spin } from 'antd';
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
import { getBranch, setActiveBranch } from '../../../services/academic-details/action';

const Login = () => {
	let pathName = window.location.pathname;
	// console.log('login', pathName);
	const navigate = useNavigate(),
		dispatch = useDispatch(),
		[ loginError, setloginError ] = useState(false),
		[ loader, setLoader ] = useState(false),
		[ alreadyLogin, setAlreadyLogin ] = useState(false),
		[ errorMessage, setErrorMessage ] = useState(),
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
		<div className="container-fluid container-xl login">
			<Formik
				initialValues={
					window.location.host.search('localhost') >= 0 ? (
						{ EmailId: 'admin.bp@sas.com', Password: 'Ae$12345', agree: true }
					) : (
						{ EmailId: '', Password: '', agree: true }
					)
				}
				validate={(values) => {
					let errors = {};
					if (!values.EmailId) errors.EmailId = 'Required';
					if (!values.Password) errors.Password = 'Required';
					else if (values.Password.length > 40)
						errors.Password = 'Password should not be more than 40 Charecters';
					if (!values.agree) errors.agree = 'Should accept Terms & Condition';
					return errors;
				}}
				onSubmit={(values) => {
					delete values.agree;
					setloginError(false);
					setLoader(true);
					API_CALL({
						method: 'post',
						url: 'Login/LoginUser',
						data: values,
						callback: async ({ status, data }) => {
							if (status === 200) {
								if (data.Userrole != null) {
									if (data.Userbranch == pathName.replace('/', '')) {
										save('session', values.EmailId, { secure: true });
										save('userdetails', data);
										setLoader(false);
										dispatch(logIn(values.EmailId));
										dispatch(getBranch());
										dispatch(setActiveBranch(data.Userbranch));
									} else {
										setLoader(false);
										setloginError(true);
										setErrorMessage('Select Correct branch to login');
									}
								} else {
									setLoader(false);
									setloginError(true);
									setErrorMessage('Invalid Email / Password');
								}
							}
						}
					});
				}}
			>
				{({ values, handleSubmit, setFieldValue }) => (
					<Row>
						<Col
							xl={12}
							lg={12}
							sm={0}
							xs={0}
							className="gutter-row d-none d-md-block justify-content-center"
						>
							<img src={bpLogin} />
						</Col>
						<Col xl={12} lg={12} md={24} sm={24} xs={24} className="gutter-row">
							<Spin spinning={loader}>
								<Form className="ml-4">
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
									{loginError && (
										<Alert
											// message="Login Error"
											description={errorMessage}
											type="error"
											closable
											showIcon
											onClose={() => {
												setErrorMessage('');
												setloginError(false);
												// setFieldValue('Checkbox', true);
											}}
										/>
									)}
									{/* <div className="d-flex justify-content-between"> */}
									<Space className="submit-btn" align="baseline">
										<Button type="link">Forgot Password?</Button>
										<Button type="primary" color="primary" onClick={handleSubmit}>
											Login
										</Button>
									</Space>
									{/* </div> */}
									<FormField
										name="agree"
										type="checkbox"
										value={true}
										customLabel={
											<div>
												I have read and accept the{' '}
												<Typography.Link> Terms & Conditions</Typography.Link> and{' '}
												<Typography.Link>Privacy Policy</Typography.Link> of AE ERP Portal.
											</div>
										}
										required={true}
									/>
									<img
										className="banner"
										src="https://dev2.ae-erp.in/Content/img/ERP%20Pages-01.jpg"
									/>
								</Form>
							</Spin>
						</Col>
					</Row>
				)}
			</Formik>
			<Divider plain orientation="right">
				Copyright © 2020 AE Enterprises. All rights reserved.
			</Divider>
		</div>
	);
};

export default Login;
