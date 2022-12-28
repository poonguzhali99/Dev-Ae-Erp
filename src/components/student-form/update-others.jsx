import React from 'react';
import { Button, Card, Col, Form, Row, Space, Spin } from 'antd';
import _isEmpty from 'lodash/isEmpty';
import './style.scss';
import { Formik } from 'formik';
import FormField from '../form-field';
import moment from 'moment';

const UpdateOthers = ({ info, loader, closeModal }) => {
	console.log('info', info);
	const {
		StudentStatus,
		CardCode,
		StudentID,
		StudentFirstName,
		StudentLastName,
		AdmissionClass,
		Section,
		RollNumber,
		SchoolBranchCode,
		SecondLanguage,
		ThirdLanguage,
		Gender,
		StudentDOB,
		BirthPlace,
		StudentAddressLine1,
		StudentAddressLine2,
		StudentAddressLocation,
		StudentAddressDistrict,
		StudentAddressState,
		StudentAddressPinCode,
		AadhaarCardNumber,
		Nationality,
		Religion,
		SocialCategory,
		MotherTongue,
		ActivityGroup,

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
		GuardianFirstName,
		GuardianLastName,
		GuardianMobileNumber,
		GuardianEmail,
		GuardianRelationshipWithStudent,
		onlineStudentid,
		BloodGroup,
		MarksofIdentification1,
		MarksofIdentification2,
		Heightincms,
		Weightinkilograms,
		VisionLR,
		DentalHygiene,
		MedicalIssues,
		SiblingsStudentId1,
		SiblingsStudentId2,
		SiblingsStudentId3,
		PreviousSchoolNameAndAddress,
		PreviousSchoolAddress,
		PreviousSchoolClass,
		AdmissionDate,
		AdmissionNumber,
		PreviousSchoolCountry,
		PreviousSchoolPincode,
		CBSEREGNumber
	} = info;
	return (
		<Formik
			initialValues={{
				SiblingsStudentId1,
				SiblingsStudentId2,
				SiblingsStudentId3,
				PreviousSchoolNameAndAddress,
				PreviousSchoolClass,
				AdmissionClass,
				AdmissionDate: moment(AdmissionDate, 'DD/MM/YYYY'),
				AdmissionNumber,

				CBSEREGNumber
			}}
			validate={() => {}}
			enableReinitialize
			onSubmit={(values) => {
				console.log('values', values);
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
					<Spin spinning={loader}>
						<Card title="Other Details">
							<Form colon={false} layout="vertical">
								<Row>
									<Col xs={24} sm={24} md={12} lg={8} xl={8}>
										<FormField
											type="text"
											name="SiblingsStudentId1"
											label="Siblings Student Id 1"
											placeholder="Siblings Student Id 1"
											required={true}
										/>
									</Col>
									<Col xs={24} sm={24} md={12} lg={8} xl={8}>
										<FormField
											type="text"
											name="SiblingsStudentId2"
											label="Siblings Student Id 2"
											placeholder="Siblings Student Id 2"
											required={true}
										/>
									</Col>
									<Col xs={24} sm={24} md={12} lg={8} xl={8}>
										<FormField
											type="text"
											name="SiblingsStudentId3"
											label="Siblings Student Id 3"
											placeholder="Siblings Student Id 3"
											required={true}
										/>
									</Col>
									<Col xs={24} sm={24} md={12} lg={8} xl={8}>
										<FormField
											type="text"
											name="PreviousSchoolNameAndAddress"
											label="Previous School Name"
											placeholder="Previous School Name"
											required={true}
										/>
									</Col>
									<Col xs={24} sm={24} md={12} lg={8} xl={8}>
										<FormField
											type="text"
											name="PreviousSchoolClass"
											label="Previous School Class"
											placeholder="Previous School Class"
											required={true}
										/>
									</Col>
									<Col xs={24} sm={24} md={12} lg={8} xl={8}>
										<FormField
											type="text"
											name="AdmissionClass"
											label="Admission Class"
											placeholder="Admission Class"
											required={true}
										/>
									</Col>
									<Col xs={24} sm={24} md={12} lg={8} xl={8}>
										<FormField
											type="date"
											name="AdmissionDate"
											label="Admission Date"
											placeholder="Admission Date"
											required={true}
										/>
									</Col>
									<Col xs={24} sm={24} md={12} lg={8} xl={8}>
										<FormField
											type="text"
											name="AdmissionNumber"
											label="Admission Number"
											placeholder="Admission Number"
											required={true}
										/>
									</Col>
									<Col xs={24} sm={24} md={12} lg={8} xl={8}>
										<FormField
											type="text"
											name="CBSEREGNumber"
											label="CBSE REG Number"
											placeholder="CBSE REG Number"
											required={true}
										/>
									</Col>
								</Row>
							</Form>
						</Card>
					</Spin>
				</Card>
			)}
		</Formik>
	);
};

export default UpdateOthers;
