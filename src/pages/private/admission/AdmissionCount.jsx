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

const AdmissionCount = () => {
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
				if (index != Object.entries(report[0]).length) {
					tempColumn.push({
						title: key.replace(/([A-Z])/g, ' $1').trim(),
						dataIndex: key,
						width: key == 'ApplicationStage' ? 190 : 100,
						align: 'center',
						// fixed: key == 'StageName' ? 'left' : '',
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
							// data.unshift({
							// 	AttachmentType: null,
							// 	GridEditable: null,
							// 	StudFee: null,
							// 	SubjectName: null,
							// 	U_Desc: 'Select All',
							// 	U_VALUS: [ '1', '2', '3' ]
							// });
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
										if (_isEmpty(values.stages)) errors.stages = 'Required';
										return errors;
									}}
									onSubmit={(values) => {
										setReport([]);
										setSearchLoader(true);
										API_CALL({
											method: 'post',
											url: 'Registration/GetWebAdmissionsReport',
											data: {
												AdminClass: values.class ? values.class : null,
												AdminBranch: activeBranch.id,
												AdminAdmyear: activeAcademicYear,
												stuProcessName: values.stages
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
											<FormField
												name="stages"
												type="multi-select"
												list={stages}
												keyword="U_VALUS"
												displayName="U_Desc"
												placeholder="Stage"
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
					<Card title={<div>New Admission Count</div>}>
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

export default AdmissionCount;
