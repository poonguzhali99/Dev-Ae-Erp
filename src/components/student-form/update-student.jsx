import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, notification, Row, Space, Spin } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import './style.scss';
import { Formik } from 'formik';
import FormField from '../form-field';
import moment from 'moment';
import API_CALL from '../../services';

const UpdateStudent = ({ info, loader, closeModal }) => {
	const {
		authReducer: { userToken },
		academicYearList,
		activeAcademicYear,
		branchList
	} = useSelector(({ authReducer, academicYearReducer, branchReducer }) => {
		return {
			authReducer,
			academicYearList: academicYearReducer.response.availableAcademicYear,
			activeAcademicYear: academicYearReducer.response.activeAcademicYear,
			branchList: branchReducer.response.availableBranch
		};
	});

	const [ secondLangList, setSecondLangList ] = useState([]),
		[ thirdLangList, setThirdLangList ] = useState([]),
		[ nationalityList, setNationalityList ] = useState([]),
		[ religionList, setReligionList ] = useState([]),
		[ categoryList, setCategoryList ] = useState([]),
		[ activityList, setActivityList ] = useState([]),
		[ admissionYearList, setAdmissionYearList ] = useState([]);

	const {
		StudentStatus,
		StudentFirstName,
		StudentLastName,
		AdmissionClass,
		Section,
		RollNumber,
		SchoolName,
		SecondLanguage,
		ThirdLanguage,
		Gender,
		AdmissionYear,
		StudentDOB,
		BirthPlace,
		StudentAddressLine1,
		StudentAddressLine2,
		StudentAddressLocation,
		StudentAddressCity,
		StudentAddressDistrict,
		StudentAddressState,
		StudentAddressPinCode,
		AadhaarCardNumber,
		Nationality,
		Religion,
		SocialCategory,
		MotherTongue,
		ActivityGroup,
		Comments,
		file
	} = info;
	useEffect(() => {
		API_CALL({
			method: 'get',
			url: 'Master/GetMasters',
			params: {
				id: 'SecondLanguage'
			},
			callback: async ({ status, data }) => {
				if (status == 200) setSecondLangList(data);
				else setSecondLangList([]);
			}
		});
		API_CALL({
			method: 'get',
			url: 'Master/GetMasters',
			params: {
				id: 'ThirdLanguage'
			},
			callback: async ({ status, data }) => {
				if (status == 200) setThirdLangList(data);
				else setThirdLangList([]);
			}
		});
		API_CALL({
			method: 'get',
			url: 'Master/GetMasters',
			params: {
				id: 'Nationality'
			},
			callback: async ({ status, data }) => {
				if (status == 200) setNationalityList(data);
				else setNationalityList([]);
			}
		});
		API_CALL({
			method: 'get',
			url: 'Master/GetMasters',
			params: {
				id: 'Religion'
			},
			callback: async ({ status, data }) => {
				if (status == 200) setReligionList(data);
				else setReligionList([]);
			}
		});
		API_CALL({
			method: 'get',
			url: 'Master/GetMasters',
			params: {
				id: 'SocialCategory'
			},
			callback: async ({ status, data }) => {
				if (status == 200) setCategoryList(data);
				else setCategoryList([]);
			}
		});
		API_CALL({
			method: 'get',
			url: 'Master/GetMasters',
			params: {
				id: 'ActivityGroup'
			},
			callback: async ({ status, data }) => {
				if (status == 200) setActivityList(data);
				else setActivityList([]);
			}
		});
		API_CALL({
			method: 'get',
			url: 'Master/GetMasters',
			params: {
				id: 'AdmissionYear'
			},
			callback: async ({ status, data }) => {
				if (status == 200) setAdmissionYearList(data);
				else setAdmissionYearList([]);
			}
		});
	}, []);
	return (
		<Formik
			initialValues={{
				StudentFirstName,
				StudentLastName,
				StudentDOB: moment(StudentDOB, 'DD/MM/YYYY'),
				BirthPlace,
				Gender,
				AdmissionYear,
				SchoolName,
				AdmissionClass,
				Section,
				RollNumber,
				SecondLanguage,
				ThirdLanguage,
				StudentStatus,
				Nationality,
				Religion,
				SocialCategory,
				MotherTongue,
				ActivityGroup,
				AadhaarCardNumber,
				StudentAddressLine1,
				StudentAddressLine2,
				StudentAddressLocation,
				StudentAddressCity,
				StudentAddressDistrict,
				StudentAddressState,
				StudentAddressPinCode,
				Comments,
				file
			}}
			validate={(values) => {
				let errors = {};
				if (!values.StudentFirstName) errors.StudentFirstName = 'Required';

				return errors;
			}}
			enableReinitialize
			onSubmit={({
				StudentFirstName,
				StudentLastName,
				StudentDOB,
				BirthPlace,
				Gender,
				AdmissionYear,
				SchoolName,
				AdmissionClass,
				Section,
				RollNumber,
				SecondLanguage,
				ThirdLanguage,
				StudentStatus,
				Nationality,
				Religion,
				SocialCategory,
				MotherTongue,
				ActivityGroup,
				AadhaarCardNumber,
				StudentAddressLine1,
				StudentAddressLine2,
				StudentAddressCity,
				StudentAddressLocation,
				StudentAddressDistrict,
				StudentAddressState,
				StudentAddressPinCode,
				Comments,
				file
			}) => {
				let data = {
					CardCode: info.CardCode,
					StudentFirstName,
					StudentLastName,
					AdmissionClass,
					SecondLanguage,
					ThirdLanguage,
					SchoolBranchCode: SchoolName,
					AadhaarCardNumber,
					StudentDOB: moment(StudentDOB).format('YYYY-MM-DD'),
					ModifyDoB: null,
					StudentModifyDoB: null,
					Gender,
					Nationality,
					CBSEREGNumber: null,
					Religion,
					SocialCategory,
					StudentStatus,
					SelectedStudentStatus: StudentStatus,
					StudentSection: Section,
					MotherTongue,
					StudentAddressLine1,
					StudentAddressLine2,
					StudentAddressCity,
					StudentStatusRemarks: null,
					StudentGeneralRemarks: null,
					StudentAddressState,
					StudentAddressDistrict,
					StudentAddressLocation,
					StudentAddressPinCode,
					ResidentialPhoneNumber: null,
					AdmissionYear,
					BirthPlace,
					file,
					Photo: file ? info.CardCode + '_Photo.png' : '',
					Source: 'WEB',
					UpdatedBy: userToken,
					RollNumber,
					ActivityGroup,
					ApplicationID: null,
					IslocationSelected: null,
					IslocationSelected2: null,
					Genderdropdown: null,
					Branchdropdown: null,
					Classdropdown: null,
					Secondlanguagedropdown: null,
					Thirdlanguagedropdown: null,
					Nationalitydropdown: null,
					religiondropdown: null,
					socialcategorydropdown: null,
					AdmissionClassdropdown: null,
					BloodGroupdropdown: null,
					statesdropdown: null,
					AdmYear: null,
					StudentStatusDropdown: null,
					StudentActivityGroupDropdown: null,
					Sectiondropdown: null,
					Districtdropdown: null,
					Locationdropdown: null
				};
				console.log('payload', data);
				// setLocalLoader(true);
				API_CALL({
					method: 'post',
					url: 'StudentManagement/InsertStudentManagementStudent',
					data,
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
			{({ values, handleSubmit, setFieldValue }) => (
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
						<Card title="Student Details">
							<Row>
								<Col xs={24} sm={24} md={24} lg={6} xl={6} className="d-flex justify-content-center">
									<FormField type="image-upload" name="file" />
								</Col>
								<Col xs={24} sm={24} md={24} lg={18} xl={18}>
									<Form colon={false} layout="vertical">
										<Row>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="StudentFirstName"
													label="First Name"
													placeholder="First Name"
													required={true}
													disabled={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="StudentLastName"
													label="Last Name"
													placeholder="Last Name"
													required={true}
													disabled={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="date"
													name="StudentDOB"
													label="Date Of Birth"
													placeholder="Date Of Birth"
													required={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="BirthPlace"
													label="Birth Place"
													placeholder="Birth Place"
													required={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="select"
													name="Gender"
													label="Gender"
													placeholder="Gender"
													disabled={true}
													required={true}
													list={[
														{
															U_VALUS: 'Male',
															U_Desc: 'Male'
														},
														{
															U_VALUS: 'Female',
															U_Desc: 'Female'
														}
													]}
													keyword="U_VALUS"
													displayName="U_Desc"
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="select"
													name="AdmissionYear"
													label="Admission Year"
													placeholder="Admission Year"
													disabled={true}
													required={true}
													list={admissionYearList}
													keyword="U_VALUS"
													displayName="U_Desc"
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													name="SchoolName"
													type="select"
													label="School Name"
													placeholder="School Name"
													required={true}
													disabled={true}
													list={branchList}
													keyword="U_VALUS"
													displayName="U_Desc"
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="AdmissionClass"
													label="Admission Class"
													placeholder="Admission Class"
													required={true}
													disabled={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="Section"
													label="Section"
													placeholder="Section"
													disabled={true}
													required={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="RollNumber"
													label="Roll Number"
													placeholder="Roll Number"
													disabled={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="select"
													name="SecondLanguage"
													label="Second Language"
													placeholder="Second Language"
													required={true}
													list={secondLangList}
													keyword="U_VALUS"
													displayName="U_Desc"
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="select"
													name="ThirdLanguage"
													label="Third Language"
													placeholder="Third Language"
													required={true}
													list={thirdLangList}
													keyword="U_VALUS"
													displayName="U_Desc"
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="select"
													name="StudentStatus"
													label="Status"
													placeholder="Status"
													keyword="U_VALUS"
													displayName="U_Desc"
													list={[
														{ U_VALUS: 'Active', U_Desc: 'Active' },
														{ U_VALUS: 'Inactive', U_Desc: 'Inactive' }
													]}
												/>
											</Col>

											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="select"
													list={nationalityList}
													keyword="U_VALUS"
													displayName="U_Desc"
													name="Nationality"
													label="Nationality"
													placeholder="Nationality"
													required={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="select"
													list={religionList}
													keyword="U_VALUS"
													displayName="U_Desc"
													name="Religion"
													label="Religion"
													placeholder="Religion"
													required={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="select"
													name="SocialCategory"
													label="Social Category"
													placeholder="Social Category"
													keyword="U_VALUS"
													displayName="U_Desc"
													required={true}
													list={categoryList}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="MotherTongue"
													label="Mother Tongue"
													placeholder="Mother Tongue"
													required={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="select"
													list={activityList}
													keyword="U_VALUS"
													displayName="U_Desc"
													name="ActivityGroup"
													label="Activity Group"
													placeholder="Activity Group"
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="AadhaarCardNumber"
													label="Aadhaar Card Number"
													placeholder="Aadhaar Card Number"
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="StudentAddressLine1"
													label="AddressLine 1"
													placeholder="AddressLine 1"
													required={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="StudentAddressLine2"
													label="AddressLine 2"
													placeholder="AddressLine 2"
													required={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="StudentAddressPinCode"
													label="Pin Code"
													placeholder="Pin Code"
													required={true}
													handleOnBlur={(id) => {
														API_CALL({
															method: 'get',
															url: 'Master/GetLocation',
															params: {
																id,
																name: ''
															},
															callback: async ({ status, data }) => {
																console.log('data', data);
																if (status == 200)
																	setFieldValue(
																		'StudentAddressLocation',
																		!_isEmpty(data) ? data[0].U_Desc : ''
																	);
																else setFieldValue('StudentAddressLocation', '');
															}
														});
														API_CALL({
															method: 'get',
															url: 'Master/GetState',
															params: {
																id
															},
															callback: async ({ status, data }) => {
																console.log('GetState', data);
																if (status == 200)
																	setFieldValue(
																		'StudentAddressState',
																		data[0].U_Desc
																	);
																else setFieldValue('StudentAddressState', '');
															}
														});
													}}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="StudentAddressLocation"
													label="Location"
													placeholder="Location"
													required={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="StudentAddressDistrict"
													label="District"
													placeholder="District"
													required={true}
												/>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xl={8}>
												<FormField
													type="text"
													name="StudentAddressState"
													label="State"
													placeholder="State"
													disabled={true}
													required={true}
												/>
											</Col>
										</Row>
										<FormField
											type="textarea"
											name="Comments"
											label="Comments"
											placeholder="Comments"
										/>
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

export default UpdateStudent;
