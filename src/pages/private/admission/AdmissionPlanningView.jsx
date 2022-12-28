import React, { useEffect, useState } from 'react';
import { Card, Spin, Button, Table, Layout, Form, Empty, Space } from 'antd';
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

const AdmissionPlanningView = () => {
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
				if (index != Object.entries(report[0]).length - 1) {
					tempColumn.push({
						title: key.replace(/([A-Z])/g, ' $1').trim(),
						dataIndex: key,
						width: 100,
						align: 'center',
						fixed: index <= 3 ? 'left' : '',
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
	// const columns = [
	// 	{
	// 		title: 'S. No',
	// 		dataIndex: 'SNo',
	// 		key: 'SNo',
	// 		align: 'center',
	// 		width: 60
	// 	},
	// 	{
	// 		title: 'Class',
	// 		dataIndex: 'Class',
	// 		key: 'Class',
	// 		align: 'center',
	// 		width: 60
	// 	},
	// 	{
	// 		title: 'Second Lang',
	// 		dataIndex: 'SLang',
	// 		key: 'SLang',
	// 		align: 'center',
	// 		width: 60
	// 	},
	// 	{
	// 		title: 'Third Lang',
	// 		dataIndex: 'TLang',
	// 		key: 'TLang',
	// 		align: 'center',
	// 		width: 60
	// 	},
	// 	{
	// 		title: 'Appl. Close Date	',
	// 		dataIndex: 'ApplCloseDate',
	// 		key: 'ApplCloseDate',
	// 		align: 'center',
	// 		width: 100,
	// 		render: (date) => <a>{moment(date, 'DD/MM/YYYY').format('DD-MMM-YYYY')}</a>
	// 	},
	// 	{
	// 		title: 'Planned Strengh	',
	// 		dataIndex: 'PlannedStrengh',
	// 		key: 'PlannedStrengh',
	// 		align: 'center',
	// 		width: 60
	// 	},
	// 	{
	// 		title: 'Activein Current AY',
	// 		dataIndex: 'ActiveinCurrentAY',
	// 		key: 'ActiveinCurrentAY',
	// 		align: 'center',
	// 		width: 60
	// 	},
	// 	{
	// 		title: 'Active Prev AY',
	// 		dataIndex: 'ActiveinPrevAY',
	// 		key: 'ActiveinPrevAY',
	// 		align: 'center',
	// 		width: 60
	// 	},
	// 	{
	// 		title: 'Pending Rollover Active Prev AY',
	// 		dataIndex: 'PendingRolloverActivePrevAY',
	// 		key: 'PendingRolloverActivePrevAY',
	// 		align: 'center',
	// 		width: 60
	// 	},
	// 	{
	// 		title: 'Pending Rollover Inactive Prev AY',
	// 		dataIndex: 'PendingRolloverInactivePrevAY',
	// 		key: 'PendingRolloverInactivePrevAY',
	// 		align: 'center',
	// 		width: 60
	// 	},
	// 	{
	// 		title: 'TC Request Regular Prev AY',
	// 		dataIndex: 'TCRequestRegularinPrevAY',
	// 		key: 'TCRequestRegularinPrevAY',
	// 		align: 'center',
	// 		width: 60
	// 	},
	// 	{
	// 		title: 'TC Request Regular New AY',
	// 		dataIndex: 'TCRequestRegularinNewAY',
	// 		key: 'TCRequestRegularinNewAY',
	// 		align: 'center',
	// 		width: 60
	// 	},
	// 	{
	// 		title: 'New Admission Withdrawal',
	// 		dataIndex: 'NewAdmissionWithdrawal',
	// 		key: 'NewAdmissionWithdrawal',
	// 		align: 'center',
	// 		width: 60
	// 	},
	// 	{
	// 		title: 'Branch Transfer To',
	// 		dataIndex: 'BranchTransferTo',
	// 		key: 'BranchTransferTo',
	// 		align: 'center',
	// 		width: 60
	// 	},
	// 	{
	// 		title: 'No. of Seats for Admission',
	// 		dataIndex: 'NoofSeatsforAdmission',
	// 		key: 'NoofSeatsforAdmission',
	// 		align: 'center',
	// 		width: 60
	// 	},
	// 	{
	// 		title: 'Application Fee Paid Count',
	// 		dataIndex: 'ApplicationFeePaidCount',
	// 		key: '	',
	// 		align: 'center',
	// 		width: 60
	// 	},
	// 	{
	// 		title: 'Documents Verified',
	// 		dataIndex: 'DocumentsVerified',
	// 		key: 'DocumentsVerified',
	// 		align: 'center',
	// 		width: 60
	// 	},
	// 	{
	// 		title: 'Adminssion Confirmed',
	// 		dataIndex: 'AdminssionConfirmed',
	// 		key: 'AdminssionConfirmed',
	// 		align: 'center',
	// 		width: 60
	// 	},
	// 	{
	// 		title: 'Admission Fee Paid Count',
	// 		dataIndex: 'AdmissionFeePaidCount',
	// 		key: 'AdmissionFeePaidCount',
	// 		align: 'center',
	// 		width: 60
	// 	},
	// 	{
	// 		title: 'Seats Available',
	// 		dataIndex: 'SeatsAvailable',
	// 		key: 'SeatsAvailable',
	// 		align: 'center',
	// 		width: 60
	// 	},
	// 	{
	// 		title: 'Actual Applications Planned',
	// 		dataIndex: 'ActualApplicationsPlanned',
	// 		key: 'ActualApplicationsPlanned',
	// 		align: 'center',
	// 		width: 60
	// 	},
	// 	{
	// 		title: 'Add New Applications',
	// 		dataIndex: 'AddNewApplications',
	// 		key: 'AddNewApplications',
	// 		align: 'center',
	// 		width: 60
	// 	},
	// 	{
	// 		title: 'Total Applications Added',
	// 		dataIndex: 'TotalApplicationsAdded',
	// 		key: 'TotalApplicationsAdded',
	// 		align: 'center',
	// 		width: 60
	// 	},
	// 	{
	// 		title: 'Applications Available Count',
	// 		dataIndex: 'ApplicationsAvailableCount',
	// 		key: 'ApplicationsAvailableCount',
	// 		align: 'center',
	// 		width: 60
	// 	}
	// ];

	return (
		<Layout>
			<AntSidebar
				Children={
					<Card className="search-card h-100" title={<h6>Header Level Filters</h6>}>
						<Spin spinning={searchLoader || sectionListLoader || classListLoader}>
							{activeAcademicYear && (
								<Formik
									innerRef={serachFormikRef}
									initialValues={{
										academicYear: activeAcademicYear,
										branch: activeBranch.id,
										class: '',
										stages: []
									}}
									validate={(values) => {
										let errors = {};
										// if (!values.stages) errors.stages = 'Required';
										return errors;
									}}
									onSubmit={(values) => {
										setReport([]);
										setSearchLoader(true);
										API_CALL({
											method: 'post',
											url: 'Registration/GetAdmissionsDashboard',
											data: {
												AdminClass: values.class || null,
												AdminBranch: activeBranch.id,
												AdminAdmyear: activeAcademicYear
											},
											callback: async ({ status, data }) => {
												setSearchLoader(false);
												if (status === 200) {
													setReport(data);
												} else {
													setReport([]);
												}
											}
										});
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
						</Spin>
					</Card>
				}
			/>
			<Layout.Content className="container-fluid admission d-flex">
				<Spin spinning={loader}>
					<Card title={<div>New Admission Planning View</div>}>
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

export default AdmissionPlanningView;
