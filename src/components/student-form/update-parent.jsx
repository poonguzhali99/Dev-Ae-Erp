import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, notification, Row, Space, Spin } from 'antd';
import _isEmpty from 'lodash/isEmpty';
import './style.scss';
import { Formik } from 'formik';
import FormField from '../form-field';
import API_CALL from '../../services';

const UpdateParent = ({ info, loader, closeModal }) => {
	console.log('info', info);
	const [ localLoader, setLocalLoader ] = useState(false);

	const {
		CardCode,
		file,
		FatherFirstName,
		FatherLastName,
		FatherOccupation,
		FatherMobileNumber,
		FatherEmail,
		FatherNameOfTheOrg,
		FatherDesignation,
		FatherAadhaarCardNumber,
		FatherAnnualIncome,
		FatherSingleParent,
		file1,
		MotherFirstName,
		MotherLastName,
		MotherOccupation,
		MotherMobileNumber,
		MotherEmail,
		MotherNameOfTheOrg,
		MotherDesignation,
		MotherAadhaarCardNumber,
		MotherAnnualIncome,
		MotherSingleParent,
		file2,
		GuardianFirstName,
		GuardianLastName,
		GuardianMobileNumber,
		GuardianEmail,
		GuardianRelationshipWithStudent,
		file3
	} = info;

	return (
		<Formik
			initialValues={{
				FatherFirstName,
				FatherLastName,
				FatherOccupation,
				FatherNameOfTheOrg,
				FatherDesignation,
				FatherMobileNumber,
				FatherEmail,
				FatherAadhaarCardNumber,
				FatherAnnualIncome,
				FatherSingleParent: FatherSingleParent == 'Y' ? true : false,
				file1,
				MotherFirstName,
				MotherLastName,
				MotherOccupation,
				MotherMobileNumber,
				MotherEmail,
				MotherNameOfTheOrg,
				MotherDesignation,
				MotherAadhaarCardNumber,
				MotherAnnualIncome,
				MotherSingleParent: MotherSingleParent == 'Y' ? true : false,
				file2,
				GuardianFirstName,
				GuardianLastName,
				GuardianMobileNumber,
				GuardianEmail,
				GuardianRelationshipWithStudent,
				file3
			}}
			validate={({
				FatherFirstName,
				FatherLastName,
				FatherOccupation,
				FatherNameOfTheOrg,
				FatherDesignation,
				FatherMobileNumber,
				FatherEmail,
				FatherAadhaarCardNumber,
				FatherAnnualIncome,
				FatherSingleParent,
				file1,
				MotherFirstName,
				MotherLastName,
				MotherOccupation,
				MotherMobileNumber,
				MotherEmail,
				MotherNameOfTheOrg,
				MotherDesignation,
				MotherAadhaarCardNumber,
				MotherAnnualIncome,
				MotherSingleParent,
				file2,
				GuardianFirstName,
				GuardianLastName,
				GuardianMobileNumber,
				GuardianEmail,
				GuardianRelationshipWithStudent,
				file3
			}) => {
				let errors = {};
				if (!FatherFirstName) errors.FatherFirstName = 'Required';
				if (!FatherLastName) errors.FatherLastName = 'Required';
				if (!FatherOccupation) errors.FatherOccupation = 'Required';
				if (!FatherNameOfTheOrg) errors.FatherNameOfTheOrg = 'Required';
				if (!FatherDesignation) errors.FatherDesignation = 'Required';
				if (!FatherMobileNumber) errors.FatherMobileNumber = 'Required';
				else if (FatherMobileNumber.length != 10) errors.FatherMobileNumber = 'Enter Valid Phone Number';
				// if (!FatherAnnualIncome) errors.FatherAnnualIncome = 'Required';
				if (!MotherFirstName) errors.MotherFirstName = 'Required';
				if (!MotherLastName) errors.MotherLastName = 'Required';
				if (!MotherOccupation) errors.MotherOccupation = 'Required';
				if (!MotherMobileNumber) errors.MotherMobileNumber = 'Required';
				else if (MotherMobileNumber.length != 10) errors.MotherMobileNumber = 'Enter Valid Phone Number';
				if (!MotherNameOfTheOrg) errors.MotherNameOfTheOrg = 'Required';
				if (!MotherDesignation) errors.MotherDesignation = 'Required';
				// if (!MotherAnnualIncome) errors.MotherAnnualIncome = 'Required';
				if (GuardianFirstName) {
					if (!GuardianLastName) errors.GuardianLastName = 'Required';
					if (!GuardianMobileNumber) errors.GuardianMobileNumber = 'Required';
					else if (GuardianMobileNumber.length != 10)
						errors.GuardianMobileNumber = 'Enter Valid Phone Number';
					if (!GuardianEmail) errors.GuardianEmail = 'Required';
					if (!GuardianRelationshipWithStudent) errors.GuardianRelationshipWithStudent = 'Required';
				}
				return errors;
			}}
			enableReinitialize
			onSubmit={({
				FatherFirstName,
				FatherLastName,
				FatherOccupation,
				FatherNameOfTheOrg,
				FatherDesignation,
				FatherMobileNumber,
				FatherEmail,
				FatherAadhaarCardNumber,
				FatherAnnualIncome,
				FatherSingleParent,
				file1,
				MotherFirstName,
				MotherLastName,
				MotherOccupation,
				MotherMobileNumber,
				MotherEmail,
				MotherNameOfTheOrg,
				MotherDesignation,
				MotherAadhaarCardNumber,
				MotherAnnualIncome,
				MotherSingleParent,
				file2,
				GuardianFirstName,
				GuardianLastName,
				GuardianMobileNumber,
				GuardianEmail,
				GuardianRelationshipWithStudent,
				file3
			}) => {
				let data = {
					ID: 0,
					CardCode,
					StudentPhoto: file1 ? 'Student_Photo.png' : null,
					ApplicationID: null,
					EmailId: 'admin.bp@sas.com',
					FatherFirstName,
					FatherLastName,
					file: file1 || null,
					FatherNameOfTheOrg,
					FatherDesignation,
					FatherOccupation,
					FatherMNCountryCode: null,
					FatherMobileNumber,
					FatherEmail,
					FatherAadhaarCardNumber,
					MotherFirstName,
					MotherLastName,
					MotherNameOfTheOrg,
					MotherDesignation,
					MotherOccupation,
					// MotherMNCountryCode,
					MotherMobileNumber,
					MotherEmail,
					MotherAadhaarCardNumber,
					MotherAnnualIncome,
					GuardianFirstName,
					GuardianLastName,
					GuardianMNCountryCode: null,
					GuardianMobileNumber,
					GuardianEmail,
					GuardianRelationshipWithStudent,
					FatherAnnualIncome,
					SiblingsStudentId1: null,
					SiblingsStudentId2: null,
					MotherAnnualIncome,
					file1: file1 || null,
					FatherPhoto: file1 ? CardCode + '_Father.png' : null,
					file2: file2 || null,
					MotherPhoto: file2 ? CardCode + '_Mother.png' : null,
					file3: file3 || null,
					GuardianPhoto: file3 ? CardCode + '_Guardian.png' : null,
					Source: null,
					UpdatedBy: 'admin.bp@sas.com',
					// creator: 'MOTHER',
					MotherSingleParent: MotherSingleParent ? 'Y' : 'N',
					FatherSingleParent: FatherSingleParent ? 'Y' : 'N',
					MotherSingle: MotherSingleParent,
					FatherSingle: FatherSingleParent,
					FatherOccupationdropdown: null,
					MotherOccupationdropdown: null,
					Relationshipdropdown: null
				};
				console.log('payload', data);

				setLocalLoader(true);
				API_CALL({
					method: 'post',
					url: 'StudentManagement/InsertStudentManagementParent',
					data,
					callback: async ({ status, data }) => {
						setLocalLoader(false);
						let result = data.Result.split('-');
						if (status == 200 && data.SuccessCode != '') {
							closeModal(false);
							notification.success({ message: result[0], description: result[result.length - 1] });
						} else notification.error({ message: result[0], description: result[result.length - 1] });
					}
				});
			}}
		>
			{({ values, handleSubmit }) => (
				<Card
					className="student-form"
					actions={[
						<Row className="mr-2 justify-content-end">
							<Space>
								<Button type="primary" onClick={handleSubmit}>
									Submit
								</Button>
								<Button onClick={() => closeModal(false)}>Close</Button>
							</Space>
						</Row>
					]}
				>
					<Spin spinning={loader || localLoader}>
						<Card title="Father Details">
							<Row>
								<Col
									xs={24}
									sm={24}
									md={24}
									lg={6}
									xl={6}
									className="d-flex justify-content-center align-items-center"
								>
									<FormField type="image-upload" name="file1" handleOnChange={(val) => {}} />
								</Col>
								<Col xs={24} sm={24} md={24} lg={18} xl={18}>
									<Form colon={false} layout="vertical">
										<Row>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="FatherFirstName"
													label="First Name"
													placeholder="First Name"
													required={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="FatherLastName"
													label="Last Name"
													placeholder="Last Name"
													required={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="select"
													name="FatherOccupation"
													label="Occupation"
													placeholder="Occupation"
													required={true}
													list={[
														{
															U_VALUS: 'Not Working',
															U_Desc: 'Not Working'
														},
														{
															U_VALUS: 'Entrepreneur',
															U_Desc: 'Entrepreneur'
														},
														{
															U_VALUS: 'Family Business',
															U_Desc: 'Family Business'
														},
														{
															U_VALUS: 'Private Employee',
															U_Desc: 'Private Employee'
														},
														{
															U_VALUS: 'Govt. Employee',
															U_Desc: 'Govt. Employee'
														}
													]}
													keyword="U_VALUS"
													displayName="U_Desc"
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="FatherNameOfTheOrg"
													label="Name of the Organization"
													placeholder="Name of the Organization"
													required={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="FatherDesignation"
													label="Designation"
													placeholder="Designation"
													required={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="FatherMobileNumber"
													label="Mobile Number"
													placeholder="Mobile Number"
													required={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="FatherEmail"
													label="Email"
													placeholder="Email"
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="FatherAadhaarCardNumber"
													label="Aadhaar Card Number"
													placeholder="Aadhaar Card Number"
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="number"
													name="FatherAnnualIncome"
													label="Annual Income"
													placeholder="Annual Income"
													required={true}
													prefix="₹"
												/>
											</Col>
										</Row>
										<FormField
											name="FatherSingleParent"
											type="checkbox"
											customLabel="Single Parent"
										/>
									</Form>
								</Col>
							</Row>
						</Card>
						<Card className="my-2" title="Mother Details">
							<Row>
								<Col
									xs={24}
									sm={24}
									md={24}
									lg={6}
									xl={6}
									className="d-flex justify-content-center align-items-center"
								>
									<FormField type="image-upload" name="file2" handleOnChange={(val) => {}} />
								</Col>
								<Col xs={24} sm={24} md={24} lg={18} xl={18}>
									<Form colon={false} layout="vertical">
										<Row>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="MotherFirstName"
													label="First Name"
													placeholder="First Name"
													required={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="MotherLastName"
													label="Last Name"
													placeholder="Last Name"
													required={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="select"
													name="MotherOccupation"
													label="Occupation"
													placeholder="Occupation"
													required={true}
													list={[
														{
															U_VALUS: 'Home Maker',
															U_Desc: 'Home Maker'
														},
														{
															U_VALUS: 'Entrepreneur',
															U_Desc: 'Entrepreneur'
														},
														{
															U_VALUS: 'Family Business',
															U_Desc: 'Family Business'
														},
														{
															U_VALUS: 'Private Employee',
															U_Desc: 'Private Employee'
														},
														{
															U_VALUS: 'Govt. Employee',
															U_Desc: 'Govt. Employee'
														}
													]}
													keyword="U_VALUS"
													displayName="U_Desc"
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="MotherNameOfTheOrg"
													label="Name of the Organization"
													placeholder="Name of the Organization"
													required={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="MotherDesignation"
													label="Designation"
													placeholder="Designation"
													required={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="MotherMobileNumber"
													label="Mobile Number"
													placeholder="Mobile Number"
													required={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="MotherEmail"
													label="Email"
													placeholder="Email"
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="MotherAadhaarCardNumber"
													label="Aadhaar Card Number"
													placeholder="Aadhaar Card Number"
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="number"
													name="MotherAnnualIncome"
													label="Annual Income"
													placeholder="Annual Income"
													required={true}
													prefix="₹"
												/>
											</Col>
										</Row>
										<FormField
											name="MotherSingleParent"
											type="checkbox"
											customLabel="Single Parent"
										/>
									</Form>
								</Col>
							</Row>
						</Card>
						<Card title="Guardian Details">
							<Row>
								<Col
									xs={24}
									sm={24}
									md={24}
									lg={6}
									xl={6}
									className="d-flex justify-content-center align-items-center"
								>
									<FormField type="image-upload" name="file3" handleOnChange={(val) => {}} />
								</Col>
								<Col xs={24} sm={24} md={24} lg={18} xl={18}>
									<Form colon={false} layout="vertical">
										<Row>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="GuardianFirstName"
													label="First Name"
													placeholder="First Name"
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="GuardianLastName"
													label="Last Name"
													placeholder="Last Name"
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="GuardianMobileNumber"
													label="Mobile Number"
													placeholder="Mobile Number"
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="GuardianEmail"
													label="Email"
													placeholder="Email"
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="GuardianRelationshipWithStudent"
													label="Relationship With Student"
													placeholder="Relationship With Student"
												/>
											</Col>
										</Row>
									</Form>
								</Col>
							</Row>
						</Card>
					</Spin>
				</Card>
			)}
		</Formik>
	);
};

export default UpdateParent;
