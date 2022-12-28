import React, { useEffect, useState } from 'react';
import { Card, Spin, Button, Table, Layout, Form, Empty, Space, DatePicker, Input } from 'antd';
import { Formik } from 'formik';

import './style.scss';
import { useNavigate } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import FormField from '../../../components/form-field';
import API_CALL from '../../../services';
import { getAcademicYear, getClass, setActiveAcademicYear } from '../../../services/academic-details/action';
import { useRef } from 'react';
import AntSidebar from '../../../components/ant-sidebar';
import { constants } from '../../../utils/constants';
import moment from 'moment';

const AdmissionVerification = () => {
	const {
		authReducer: { userToken },
		userDetails,
		academicYearList,
		activeAcademicYear,
		branchList,
		activeBranch,
		classList,
		classListLoader,
		sectionListLoader
	} = useSelector(
		({ authReducer, userDetailsReducer, academicYearReducer, branchReducer, classReducer, sectionReducer }) => {
			return {
				authReducer,
				userDetails: userDetailsReducer.response,
				academicYearList: academicYearReducer.response.availableAcademicYear,
				activeAcademicYear: academicYearReducer.response.activeAcademicYear,
				branchList: branchReducer.response.availableBranch,
				activeBranch: branchReducer.response.activeBranch,
				classList: classReducer.response.availableClass,
				classListLoader: classReducer.requesting,
				sectionListLoader: sectionReducer.requesting
			};
		}
	);

	const navigate = useNavigate(),
		dispatch = useDispatch();
	const [ loader, setLoader ] = useState(false),
		[ searchLoader, setSearchLoader ] = useState(false),
		[ report, setReport ] = useState([]),
		[ column, setColumn ] = useState([]),
		[ stages, setStages ] = useState([]);

	const [ form ] = Form.useForm();

	const serachFormikRef = useRef();

	useEffect(() => {
		if (!_isEmpty(report)) {
			let tempColumn = [];

			Object.entries(report[0]).forEach(([ key, value ], index) => {
				// if (index != Object.entries(report[0]).length) {
				if (index < 11) {
					tempColumn.push({
						title: key.replace(/([A-Z])/g, ' $1').trim(),
						dataIndex: key,
						width: key == 'ParentMail' || key == 'StudentName' || key == 'StudentStage' ? 220 : 100,
						align: 'center',
						fixed: index < 3 ? 'left' : '',
						render: (text) => <a className="p-1">{text}</a>
					});
				}
			});
			setColumn(tempColumn);
		}
	});

	useEffect(
		() => {
			if (!_isEmpty(activeAcademicYear) && !_isEmpty(activeBranch)) {
				let params;
				if (userDetails.Userrole == constants.userRole.teacher) {
					params = {
						UserMailId: userToken,
						AcademicYear: activeAcademicYear,
						Branch: activeBranch.id,
						TeacherCode: userDetails.TeacherCode
					};
				} else {
					params = {
						UserMailId: userToken,
						AcademicYear: activeAcademicYear,
						Branch: activeBranch.id
					};
				}

				dispatch(getClass(userDetails.Userrole, params));
				API_CALL({
					method: 'get',
					url: 'Master/GetStudentStages',
					callback: async ({ status, data }) => {
						if (status == 200) {
							setStages(data);
						}
						setLoader(false);
					}
				});
			}
		},
		[ activeAcademicYear, activeBranch ]
	);

	useEffect(
		() => {
			if (Array.isArray(academicYearList) && academicYearList.length > 0) {
				dispatch(setActiveAcademicYear(academicYearList[1].U_VALUS));
			}
		},
		[ academicYearList ]
	);

	useEffect(() => {
		dispatch(getAcademicYear());
	}, []);

	const columns = column;

	columns.push({
		title: 'Scheduled On',
		dataIndex: 'TourDatetime',
		width: 200,
		align: 'center'
	});
	columns.push({
		title: 'Date & Time​',
		dataIndex: '',
		width: 200,
		align: 'center',
		render: () => (
			<Form.Item className="p-1">
				<DatePicker // name={}
					defaultValue={moment()}
					showTime
					// disabled={!isEditing(text)}
					format="DD-MMM-YYYY hh:mm"
				/>
			</Form.Item>
		)
	});
	columns.push({
		title: 'Actions',
		dataIndex: '',
		width: 200,
		align: 'center',
		// fixed: key == 'StageName' ? 'left' : '',
		render: () => (
			<Space className="action-buttons">
				<Button className="p-0" size="small" type="link">
					Mail
				</Button>|
				<Button className="p-0" size="small" danger type="link">
					Reject
				</Button>
			</Space>
		)
	});
	columns.push({
		title: 'Reason For Rejection​',
		dataIndex: '',
		width: 200,
		align: 'center',
		render: () => (
			<Form.Item className="p-1">
				<Input />
			</Form.Item>
		)
	});

	return (
		<Layout>
			<AntSidebar
				Children={
					<Spin spinning={searchLoader || sectionListLoader || classListLoader}>
						<Card className="search-card h-100" title={<h6>Header Level Filters</h6>}>
							{activeAcademicYear && (
								<Formik
									innerRef={serachFormikRef}
									initialValues={{
										academicYear: activeAcademicYear,
										branch: activeBranch.id,
										class: '',
										stages: '',
										studentId: '',
										rejectedList: false
									}}
									validate={(values) => {
										let errors = {};
										if (
											_isEmpty(values.studentId) &&
											_isEmpty(values.stages) &&
											!values.rejectedList
										) {
											errors.stages = 'Required';
											errors.studentId = 'Required';
											errors.rejectedList = 'Required';
										}

										return errors;
									}}
									onSubmit={(values) => {
										setReport([]);
										setSearchLoader(true);
										if (values.studentId) {
											API_CALL({
												method: 'post',
												url: 'Registration/GetAdmissionsStudentList',
												data: {
													AdminBranch: activeBranch.id,
													AdminAdmyear: activeAcademicYear,
													AdminClass: values.class ? values.class : null,
													Adminstudent: values.studentId || null, //!_isEmpty(values.stages) ? null : values.studentId,
													ProcessName: values.stages || null //!_isEmpty(values.studentId) ? null :
												},

												callback: async ({ status, data }) => {
													if (status == 200) {
														setReport(data);
													}
													setSearchLoader(false);
												}
											});
										} else if (values.stages == '1' || values.stages == '2') {
											API_CALL({
												method: 'post',
												url: 'Registration/GetAdmissionsList',
												data: {
													AdminBranch: activeBranch.id,
													AdminAdmyear: activeAcademicYear,
													AdminClass: values.class ? values.class : null,
													ProcessName: values.stages
												},

												callback: async ({ status, data }) => {
													if (status == 200) {
														setReport(data);
													}
													setSearchLoader(false);
												}
											});
										} else if (values.stages == '3' || values.rejectedList) {
											API_CALL({
												method: 'post',
												url: 'Registration/GetAdmissionsList',
												data: {
													AdminBranch: activeBranch.id,
													AdminAdmyear: activeAcademicYear,
													AdminClass: values.class ? values.class : null,
													ProcessName: values.stages ? values.stages : null,
													StudentStatus: values.rejectedList ? 'R' : null
												},

												callback: async ({ status, data }) => {
													if (status == 200) {
														setReport(data);
													}
													setSearchLoader(false);
												}
											});
										} else if (values.ProcessName == '4' || values.ProcessName == '5') {
											API_CALL({
												method: 'post',
												url: 'Registration/GetAdmissionsList',
												data: {
													AdminBranch: activeBranch.id,
													AdminAdmyear: activeAcademicYear,
													AdminClass: values.AdminClass ? values.AdminClass : null,
													ProcessName: values.ProcessName
												},

												callback: async ({ status, data }) => {
													if (status == 200) {
														setReport(data);
													}
													setSearchLoader(false);
												}
											});
										} else {
											API_CALL({
												method: 'post',
												url: 'Registration/GetSapAdmissionsList',
												data: {
													AdminBranch: activeBranch.id,
													AdminAdmyear: activeAcademicYear,
													AdminClass: values.AdminClass ? values.AdminClass : null,
													ProcessName: values.ProcessName
												},

												callback: async ({ status, data }) => {
													if (status == 200) {
														setReport(data);
													}
													setSearchLoader(false);
												}
											});
										}
									}}
								>
									{({ values, handleSubmit, setFieldValue, resetForm }) => (
										<Form>
											<FormField
												name="academicYear"
												type="select"
												placeholder="Academic Year"
												list={academicYearList}
												disabled={true}
												keyword="U_VALUS"
												displayName="U_Desc"
												handleOnChange={(year) => dispatch(setActiveAcademicYear(year))}
											/>
											<FormField
												name="branch"
												type="select"
												placeholder="School Branch"
												required={true}
												// disabled={branchList.length == 1}
												list={branchList}
												keyword="U_VALUS"
												displayName="U_Desc"
												handleOnChange={(branch) => {}}
											/>
											<FormField
												name="class"
												type="select"
												placeholder="Class"
												required={true}
												list={classList}
												keyword="U_VALUS"
												displayName="U_Desc"
											/>
											<FormField
												name="stages"
												type="select"
												list={stages}
												keyword="U_VALUS"
												displayName="U_Desc"
												placeholder="Stage"
											/>
											<FormField name="studentId" type="text" placeholder="Student ID" />
											<FormField
												name="rejectedList"
												type="checkbox"
												customLabel="Rejected List"
											/>
											<Space>
												<Button type="primary " onClick={handleSubmit}>
													Search
												</Button>
												<Button
													className=" "
													onClick={() => {
														resetForm();
													}}
												>
													Reset
												</Button>
											</Space>
										</Form>
									)}
								</Formik>
							)}
						</Card>
					</Spin>
				}
			/>
			<Layout.Content className="container-fluid admission d-flex">
				<Spin spinning={loader}>
					<Card title={<div>New Admission Verification</div>}>
						{!_isEmpty(report) ? (
							<Form form={form}>
								<Table
									bordered
									columns={columns}
									dataSource={report}
									rowKey="SId"
									scroll={{ y: 500, x: 'fit-content' }}
									pagination={{
										showSizeChanger: true,
										pageSizeOptions: [ '10', '25', '50' ],
										showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
										position: [ 'topRight' ]
									}}
								/>
							</Form>
						) : (
							<Empty />
						)}
					</Card>
				</Spin>
			</Layout.Content>
		</Layout>
	);
};

export default AdmissionVerification;
