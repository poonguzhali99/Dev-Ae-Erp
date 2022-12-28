import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Input, notification, Row, Space, Spin, Table } from 'antd';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import './style.scss';
import { Formik } from 'formik';
import FormField from '../form-field';
import moment from 'moment';
import API_CALL from '../../services';

const UpdateMedical = ({ info, loader, closeModal }) => {
	console.log('info', info);

	const [ bloodGroup, setBloodGroup ] = useState([]);
	const [ parentApprovedMedicines, setParentApprovedMedicines ] = useState([]);
	const [ allergies, setAllergies ] = useState([]);
	const [ allergiesList, setAllergiesList ] = useState([]);

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
		SpecificAilmentsIfAny,
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

	useEffect(() => {
		API_CALL({
			method: 'get',
			url: 'Master/GetMasters',
			params: { id: 'BloodGroup' },
			callback: async ({ status, data }) => {
				// setLocalLoader(false);
				if (status == 200) setBloodGroup(data);
				else setBloodGroup([]);
			}
		});
		API_CALL({
			method: 'get',
			url: 'Master/GetMasters',
			params: { id: 'ParentApprovedMedicine' },
			callback: async ({ status, data }) => {
				// setLocalLoader(false);
				if (status == 200) setParentApprovedMedicines(data);
				else setParentApprovedMedicines([]);
			}
		});
		API_CALL({
			method: 'get',
			url: 'Master/GetMasters',
			params: { id: 'Allergies' },
			callback: async ({ status, data }) => {
				// setLocalLoader(false);
				if (status == 200) setAllergies(data);
				else setAllergies([]);
			}
		});
	}, []);

	const columns = [
		{
			title: 'Allergy Name',
			dataIndex: 'AllergyType',
			key: 'AllergyType',
			align: 'center'
			// render: (text) => <a >{text}</a>
		},
		{
			title: 'Description',
			dataIndex: 'Comments',
			key: 'Comments',
			align: 'center',
			render: (_, record) => (
				<Input.TextArea
					placeholder="Notes(optinal)"
					defaultValue={record.Comments}
					onBlur={async ({ target: { value } }) => {
						let index = allergiesList.findIndex((item) => item.U_VALUS == record.U_VALUS);
						if (index > -1) allergiesList[index].Description = value;
						setAllergiesList(allergiesList);
					}}
				/>
			)
		},

		{
			title: 'Action',
			key: 'action',
			align: 'center',
			render: (_, record) => (
				<Space size="middle">
					<Button
						danger
						type="link"
						onClick={() => {
							const newData = allergiesList.filter((item) => item.AllergyType !== record.AllergyType);
							setAllergiesList(newData);
						}}
					>
						Remove
					</Button>
				</Space>
			)
		}
	];
	return (
		<Formik
			initialValues={{
				BloodGroup,
				MarksofIdentification1,
				MarksofIdentification2,
				Heightincms,
				Weightinkilograms,
				VisionLR,
				DentalHygiene,
				ParentApprovedMedicines: [],
				Allergy: '',
				Description: '',
				MedicalIssues,
				SpecificAilmentsIfAny
			}}
			validate={() => {}}
			enableReinitialize
			onSubmit={(values) => {
				console.log('values', values);
				let data = Object.assign({}, values);

				let additionalData = {
					CardCode: info.CardCode,
					Source: 'WEB',
					Allergies: allergiesList,
					StudentWithProbation: 'No',
					UpdatedBy: 'admin.bp@sas.com',
					ProcessName: null,
					parentmedicine: null,
					StudentStage: null,
					ParentApprovedMedicineDropdown: null,
					BloodGroupdropdown: null
				};
				delete data.Description;
				delete data.Allergy;
				let payload = { ...data, ...additionalData };
				API_CALL({
					method: 'post',
					url: 'StudentManagement/InsertStudentManagementMedicalForm',
					data: payload,
					callback: async ({ status, data }) => {
						// setLocalLoader(false);
						let result = data.Result.split('-');
						if (status == 200 && data.SuccessCode != '') {
							closeModal(false);
							notification.success({ message: result[0], description: result[result.length - 1] });
						} else notification.error({ message: result[0], description: result[result.length - 1] });
					}
				});
			}}
		>
			{({ values, handleSubmit, resetForm }) => (
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
						<Card title="Medical Details">
							<Form colon={false} layout="vertical">
								<Row>
									<Col xs={24} sm={24} md={12} lg={8} xl={8}>
										<FormField
											type="select"
											name="BloodGroup"
											label="Blood Group"
											placeholder="Blood Group"
											required={true}
											list={bloodGroup}
											keyword="U_VALUS"
											displayName="U_Desc"
										/>
									</Col>
									<Col xs={24} sm={24} md={12} lg={8} xl={8}>
										<FormField
											type="text"
											name="MarksofIdentification1"
											label="Mark of Identification 1"
											placeholder="Mark of Identification 1"
											required={true}
										/>
									</Col>
									<Col xs={24} sm={24} md={12} lg={8} xl={8}>
										<FormField
											type="text"
											name="MarksofIdentification2"
											label="Mark of Identification 2"
											placeholder="Mark of Identification 2"
											required={true}
										/>
									</Col>
								</Row>
							</Form>
						</Card>
						<Card title="Health Care Details" className="my-2">
							<Form colon={false} layout="vertical">
								<Row>
									<Col xs={24} sm={24} md={12} lg={8} xl={8}>
										<FormField
											type="select"
											name="Heightincms"
											label="Height in cms"
											placeholder="Height in cms"
											required={true}
											list={bloodGroup}
											keyword="U_VALUS"
											displayName="U_Desc"
										/>
									</Col>
									<Col xs={24} sm={24} md={12} lg={8} xl={8}>
										<FormField
											type="text"
											name="Weightinkilograms"
											label="Weight in Kilograms"
											placeholder="Weight in Kilograms"
											required={true}
										/>
									</Col>
									<Col xs={24} sm={24} md={12} lg={8} xl={8}>
										<FormField
											type="text"
											name="VisionLR"
											label="VisionLR"
											placeholder="VisionLR"
											required={true}
										/>
									</Col>
									<Col xs={24} sm={24} md={12} lg={8} xl={8}>
										<FormField
											type="text"
											name="DentalHygiene"
											label="Dental Hygiene"
											placeholder="Dental Hygiene"
											required={true}
										/>
									</Col>
								</Row>
							</Form>
						</Card>
						<Card title="Parent Approved Medicine Details" className="my-2">
							<Form colon={false} layout="vertical">
								<Row>
									<Col span={24}>
										<FormField
											type="multi-select"
											name="ParentApprovedMedicines"
											label="Parent Approved Medicines"
											placeholder="Parent Approved Medicines"
											required={true}
											list={parentApprovedMedicines}
											keyword="U_VALUS"
											displayName="U_Desc"
											handleOnChange={(val) => console.log(val)}
										/>
									</Col>
								</Row>
							</Form>
						</Card>
						<Card title="Allergies Details" className="my-2">
							<Form colon={false} layout="vertical">
								<Row className="m-3 justify-content-between  w-90">
									<Col xs={24} sm={24} md={24} lg={12} xl={12}>
										<FormField
											type="select"
											name="Allergy"
											list={allergies}
											keyword="U_VALUS"
											displayName="U_Desc"
											placeholder="Allergies"
											// hideDefaultOption={true}
										/>
										<FormField
											type="textarea"
											name="Description"
											placeholder="Description(optinal)"
										/>
										<Button
											type="primary"
											onClick={() => {
												let selectedICD = {
													AllergyType: _get(
														allergies.find((item) => item.U_VALUS == values.Allergy),
														'U_VALUS',
														''
													),
													Comments: values.Description,
													AllergiesDropdown: null,
													allergies: null
												};
												if (values.Allergy == '')
													notification.warning({
														message: 'Empty Found',
														description: 'Allergy should not be empty '
													});
												else if (
													allergiesList.findIndex(
														(all) => all.AllergyType == values.Allergy
													) > -1
												)
													notification.warning({
														message: 'Duplicate Found',
														description: 'Allergy already added in the List '
													});
												else setAllergiesList([ ...allergiesList, selectedICD ]);
												resetForm();
											}}
											className="my-3"
										>
											Add
										</Button>
									</Col>
									{allergiesList && (
										<Col xs={24} sm={24} md={24} lg={12} xl={12}>
											<Table
												pagination={false}
												columns={columns}
												dataSource={allergiesList}
												rowKey="AllergyType"
											/>
										</Col>
									)}
								</Row>
							</Form>
						</Card>
						<Card title="Medical Issues" className="my-2">
							<Form colon={false} layout="vertical">
								<Row>
									<Col xs={24} sm={24} md={12} lg={8} xl={8}>
										<FormField
											type="text"
											name="MedicalIssues"
											label="Medical Issues"
											placeholder="Medical Issues"
											required={true}
										/>
									</Col>
									<Col xs={24} sm={24} md={12} lg={8} xl={8}>
										<FormField
											type="text"
											name="SpecificAilmentsIfAny"
											label="Specific Ailments If Any"
											placeholder="Specific Ailments If Any"
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

export default UpdateMedical;
