import React, { useState } from 'react';
import { Modal, Button, Form, Spin, Space, notification } from 'antd';
import { Formik } from 'formik';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import FormField from '../../../components/form-field';
import API_CALL from '../../../services';
import { getSection, setActiveAcademicYear } from '../../../services/academic-details/action';
import { useEffect } from 'react';
import { useRef } from 'react';
import { constants } from '../../../utils/constants';

const CreateMappingRequest = ({ openModal, closeModal, editModal, initValue }) => {
	const {
		authReducer: { userToken },
		userDetails,
		academicYearList,
		activeAcademicYear,
		branchList,
		activeBranch,
		classList,
		classListLoader,
		activeClass,
		sectionList,
		sectionListLoader,
		activeSection,
		studentList,
		studentInfo
	} = useSelector(
		({
			authReducer,
			userDetailsReducer,
			academicYearReducer,
			branchReducer,
			classReducer,
			sectionReducer,
			studentMasterRreducer,
			studentInfoReducer
		}) => {
			return {
				authReducer,
				userDetails: userDetailsReducer.response,
				academicYearList: academicYearReducer.response.availableAcademicYear,
				activeAcademicYear: academicYearReducer.response.activeAcademicYear,
				branchList: branchReducer.response.availableBranch,
				activeBranch: branchReducer.response.activeBranch,
				classList: classReducer.response.availableClass,
				classListLoader: classReducer.requesting,
				activeClass: classReducer.response.activeClass,
				sectionList: sectionReducer.response.availableSection,
				sectionListLoader: sectionReducer.requesting,
				activeSection: sectionReducer.response.activeSection,
				studentList: studentMasterRreducer.response,
				studentInfo: studentInfoReducer.response
			};
		}
	);

	const [ searchLoader, setSearchLoader ] = useState(false),
		[ subjectList, setSubjectList ] = useState([]),
		[ teacherList, setTeacherList ] = useState([]),
		[ allSectionList, setAllSectionList ] = useState([]);

	const formikRef = useRef();
	const { confirm } = Modal;

	useEffect(
		() => {
			if (!_isEmpty(activeAcademicYear) && !_isEmpty(activeBranch)) {
				setSearchLoader(true);
				API_CALL({
					method: 'get',
					url: 'OnlineClasses/GetAllTeachers',
					params: {
						Branch: activeBranch.id,
						Year: activeAcademicYear
					},
					callback: async ({ status, data }) => {
						if (status == 200) {
							setTeacherList(data);
						}
						setSearchLoader(false);
					}
				});
			}
		},
		[ activeAcademicYear, activeBranch ]
	);
	useEffect(
		() => {
			if (!_isEmpty(initValue)) {
				setSearchLoader(true);
				API_CALL({
					method: 'get',
					url: 'Master/GetSections',
					params: {
						BranchCode: initValue.Branch,
						AcademicYear: initValue.AcademicYear,
						Class: initValue.Class
					},
					callback: async ({ status, data }) => {
						if (status == 200) {
							setAllSectionList(data);
						}
						setSearchLoader(false);
					}
				});
				setSearchLoader(true);
				API_CALL({
					method: 'post',
					url: 'Master/GetClassSubjects',
					data: {
						TeacherName: null,
						Subject: null,
						Class: initValue.Class,
						Section: initValue.Section,
						SchoolBranchCode: initValue.Branch,
						Academicyear: initValue.AcademicYear,
						OnlineDate: null,
						TeacherCode: null,
						Fperiod: null,
						Tperiod: null,
						Stucode: null
					},
					callback: async ({ status, data }) => {
						if (status == 200) {
							setSubjectList(data.filter((data) => data.U_VALUS != ''));
						}
						setSearchLoader(false);
					}
				});
			}
		},
		[ initValue ]
	);
	const getTeacherName = (id) => {
		let teacherName = teacherList.find((teacher) => teacher.U_VALUS == id);
		return teacherName.U_Desc;
	};
	const showConfirm = ({ title, content, payload }) => {
		confirm({
			title,
			// icon: <ExclamationCircleFilled />,
			content,
			onOk() {
				console.log('OK');
				payload.SId = 0;
				API_CALL({
					method: 'post',
					url: 'OnlineClasses/SaveTeacherSujectsMappingData',
					data: payload,
					callback: async ({ status, data }) => {
						if (status == 200) {
							if (data == '1') {
								notification.success({
									message: 'Record Created',
									description: 'Request Created successfully'
								});
								// toggle();
								// fetchAllRequest.current.handleSubmit();
								setSearchLoader(false);
							} else if (data == '0') {
								notification.error({
									message: 'Failed',
									description: 'Record saving failed'
								});
								setSearchLoader(false);
							} else if (data == '3') {
								notification.warning({
									message: 'Record exists',
									description: 'Record exists for the selected combination for this Teacher ID'
								});
								setSearchLoader(false);
							}
							setSearchLoader(false);
						}
					}
				});
			},
			onCancel() {
				setSearchLoader(false);
				console.log('Cancel');
			}
		});
	};
	return (
		<div className="container-xl container-fluid animated fadeIn p-15">
			<Modal
				className="antd-modal-right"
				open={openModal}
				onCancel={closeModal}
				title={`${!_isEmpty(initValue) ? 'Update' : 'Create'} Request for Teacher–Subjects Mapping`}
				footer={[
					<Button type="primary" onClick={() => formikRef.current.handleSubmit()}>
						{!_isEmpty(initValue) ? 'Update' : 'Create'}
					</Button>,
					<Button onClick={closeModal}>Close</Button>
				]}
			>
				<Formik
					innerRef={formikRef}
					initialValues={{
						academicYear: !_isEmpty(initValue) ? initValue.AcademicYear : activeAcademicYear,
						branch: !_isEmpty(initValue) ? initValue.Branch : activeBranch.id,
						teacherName: !_isEmpty(initValue) ? initValue.TeacherCode : '',
						teacherCode: !_isEmpty(initValue) ? initValue.TeacherCode : '',
						TeacherType: !_isEmpty(initValue) ? initValue.TeacherType : '',
						class: !_isEmpty(initValue) ? initValue.Class : '',
						section: !_isEmpty(initValue) ? initValue.Section : '',
						Subject: !_isEmpty(initValue) ? initValue.Subject : ''
					}}
					validate={(values) => {
						let errors = {};
						if (!values.branch) errors.branch = 'Required';
						if (!values.class) errors.class = 'Required';
						if (!values.section) errors.section = 'Required';
						if (!values.teacherName) errors.teacherName = 'Required';
						if (!values.teacherCode) errors.teacherCode = 'Required';
						if (!values.Subject) errors.Subject = 'Required';
						if (!values.TeacherType) errors.TeacherType = 'Required';

						return errors;
					}}
					onSubmit={(values) => {
						console.log('values', values);

						let payload = {
							SId: 0,
							SchoolBranchCode: activeBranch.id,
							AcademicYear: activeAcademicYear,
							Class: values.class,
							Section: values.section,
							TeacherName:
								userDetails.Userrole == constants.userRole.teacher
									? values.teacherName
									: getTeacherName(values.teacherName),
							TeacherName1:
								userDetails.Userrole == constants.userRole.teacher
									? values.teacherName
									: getTeacherName(values.teacherName),
							Subject: values.Subject,
							TeacherCode: values.teacherCode,
							TeacherType: values.TeacherType
						};
						if (values.TeacherType == 'Class Teacher') {
							payload.SId = editModal ? initValue.SId : 1;
							API_CALL({
								method: 'post',
								url: 'OnlineClasses/SaveTeacherSujectsMappingData',
								data: payload,
								callback: async ({ status, data }) => {
									if (status == 200) {
										if (data.length > 1) {
											showConfirm({
												title: 'TEACHER MAPPING',
												content: `Teacher is already assigned as Class Teacher for Class ${data}. You want to create another record as Class Teacher? Please select OK to confirm or click on Cancel button to close the window.`,
												payload
											});
										} else {
											payload.SId = editModal ? initValue.SId : 0;
											API_CALL({
												method: 'post',
												url: 'OnlineClasses/SaveTeacherSujectsMappingData',
												data: payload,
												callback: async ({ status, data }) => {
													if (status == 200) {
														if (data == '1') {
															notification.success({
																message: 'Record Created',
																description: 'Request Created successfully'
															});
															// toggle();
															// fetchAllRequest.current.handleSubmit();
															setSearchLoader(false);
														} else if (data == '0') {
															notification.error({
																message: 'Failed',
																description: 'Record saving failed'
															});
															setSearchLoader(false);
														} else if (data == '3') {
															notification.warning({
																message: 'Record exists',
																description:
																	'Record exists for the selected combination for this Teacher ID'
															});
															setSearchLoader(false);
														} else if (data == '4') {
															toggle();
															fetchAllRequest.current.handleSubmit();
															notification.success({
																message: 'Record Updated',
																description: 'Request Updated successfully'
															});
															setSearchLoader(false);
														}
														setSearchLoader(false);
													}
												}
											});
										}
									}
								}
							});
						} else {
							payload.SId = editModal ? initValue.SId : 0;
							API_CALL({
								method: 'post',
								url: 'OnlineClasses/SaveTeacherSujectsMappingData',
								data: payload,
								callback: async ({ status, data }) => {
									if (status == 200) {
										if (data == '1') {
											notification.success({
												message: 'Record Created',
												description: 'Request Created successfully'
											});
											toggle();
											fetchAllRequest.current.handleSubmit();
											setSearchLoader(false);
										} else if (data == '0') {
											notification.error({
												message: 'Failed',
												description: 'Record saving failed'
											});
											setSearchLoader(false);
										} else if (data == '3') {
											notification.warning({
												message: 'Record exists',
												description:
													'Record exists for the selected combination for this Teacher ID'
											});
											setSearchLoader(false);
										} else if (data == '4') {
											toggle();
											fetchAllRequest.current.handleSubmit();
											notification.success({
												message: 'Record Updated',
												description: 'Request Updated successfully'
											});
											setSearchLoader(false);
										}
										setSearchLoader(false);
									}
								}
							});
						}
					}}
				>
					{({ values, handleSubmit, setFieldValue, resetForm }) => (
						<Form>
							<Spin spinning={searchLoader || sectionListLoader || classListLoader}>
								<FormField
									name="academicYear"
									type="select"
									placeholder="Academic Year"
									list={academicYearList}
									keyword="U_VALUS"
									displayName="U_Desc"
									handleOnChange={(year) => dispatch(setActiveAcademicYear(year))}
								/>
								<FormField
									name="branch"
									type="select"
									placeholder="School Branch"
									required={true}
									disabled={branchList.length == 1}
									list={branchList}
									keyword="U_VALUS"
									displayName="U_Desc"
									handleOnChange={(branch) => {}}
								/>
								<FormField
									name="teacherName"
									type="select"
									placeholder="Teacher"
									// label="School Branch"
									required={true}
									list={teacherList}
									keyword="U_VALUS"
									displayName="U_Desc"
									handleOnChange={(teacherCode) => {
										setFieldValue('teacherCode', teacherCode);
									}}
								/>
								<FormField type="text" name="teacherCode" disabled={true} placeholder="Teacher Code" />
								<FormField
									name="TeacherType"
									type="select"
									placeholder="Teacher Type"
									list={[
										{
											U_Desc: 'Mother Teacher',
											U_VALUS: 'Mother Teacher'
										},
										{
											U_Desc: 'Class Teacher',
											U_VALUS: 'Class Teacher'
										},
										{
											U_Desc: 'Subject Teacher',
											U_VALUS: 'Subject Teacher'
										},
										{
											U_Desc: 'Section Teacher',
											U_VALUS: 'Section Teacher'
										}
									]}
									keyword="U_VALUS"
									displayName="U_Desc"
									handleOnChange={(section) => {}}
								/>
								<FormField
									name="class"
									type="select"
									placeholder="Class"
									required={true}
									list={classList}
									keyword="U_VALUS"
									displayName="U_Desc"
									handleOnChange={(cls) => {
										setFieldValue('section', '');
										setSearchLoader(true);
										API_CALL({
											method: 'get',
											url: 'Master/GetSections',
											params: {
												BranchCode: activeBranch.id,
												AcademicYear: activeAcademicYear,
												Class: cls
											},
											callback: async ({ status, data }) => {
												if (status == 200) {
													setAllSectionList(data);
													setFieldValue('section', '');
													setFieldValue('Subject', '');
												}
												setSearchLoader(false);
											}
										});
									}}
								/>

								<FormField
									name="section"
									type="select"
									placeholder="Section"
									// label="School Branch"
									required={true}
									list={allSectionList}
									keyword="U_VALUS"
									displayName="U_Desc"
									handleOnChange={(sec) => {
										let payload = {
											TeacherName: null,
											Subject: null,
											Class: values.class,
											Section: sec,
											SchoolBranchCode: activeBranch.id,
											Academicyear: activeAcademicYear,
											OnlineDate: null,
											TeacherCode: null,
											Fperiod: null,
											Tperiod: null,
											Stucode: null
										};
										setSearchLoader(true);
										API_CALL({
											method: 'post',
											url: 'Master/GetClassSubjects',
											data: payload,
											callback: async ({ status, data }) => {
												if (status == 200) {
													setSubjectList(data.filter((data) => data.U_VALUS != ''));
													setFieldValue('Subject', '');
												}
												setSearchLoader(false);
											}
										});
									}}
								/>

								<FormField
									name="Subject"
									type="select"
									placeholder="Subject"
									// label="School Branch"
									required={true}
									list={subjectList}
									keyword="U_VALUS"
									displayName="U_Desc"
									handleOnChange={(sec) => {}}
								/>
							</Spin>
						</Form>
					)}
				</Formik>
			</Modal>
		</div>
	);
};
export default CreateMappingRequest;
