import React, { useEffect, useState, useRef } from 'react';
import {
	List,
	Card,
	Image,
	Divider,
	Spin,
	Row,
	Col,
	Button,
	Table,
	Input,
	InputNumber,
	Pagination,
	Layout,
	Form,
	Empty,
	notification,
	Tooltip,
	Space,
	Modal,
	Select,
	Typography,
	FloatButton
} from 'antd';
import { Formik } from 'formik';
import './style.scss';
import { useNavigate } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _sortBy from 'lodash/sortBy';
import {
	getAcademicYear,
	getClass,
	getSection,
	setActiveAcademicYear
} from '../../../services/academic-details/action';
import FormField from '../../../components/form-field';
import API_CALL from '../../../services';
import axios from 'axios';
import AntSidebar from '../../../components/ant-sidebar';
import moment from 'moment/moment';
import { constants } from '../../../utils/constants';
import { weeksInMonth } from '../../../utils/common-utils';
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import CreateMappingRequest from './create-mapping-request';

const TeacherMapping = () => {
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

	const navigate = useNavigate(),
		dispatch = useDispatch();
	const [ form ] = Form.useForm();

	const serachFormikRef = useRef();
	let option = [
		{
			value: 'P',
			label: 'P'
		},
		{
			value: 'A',
			label: 'A'
		},
		{
			value: 'L',
			label: 'L'
		},
		{
			value: 'H',
			label: 'H'
		},
		{
			value: 'N',
			label: 'N'
		}
	];

	const [ searchLoader, setSearchLoader ] = useState(false),
		[ loader, setLoader ] = useState(false),
		[ subjectList, setSubjectList ] = useState([]),
		[ teacherList, setTeacherList ] = useState([]),
		[ allRequestList, setAllRequestList ] = useState([]),
		[ createModal, setCreateModal ] = useState(false),
		[ editModal, setEditModal ] = useState(false),
		[ initialValues, setInitialValues ] = useState({});

	useEffect(() => {
		dispatch(getAcademicYear());
	}, []);
	useEffect(
		() => {
			if (Array.isArray(academicYearList) && academicYearList.length > 0) {
				dispatch(setActiveAcademicYear(academicYearList[1].U_VALUS));
			}
		},
		[ academicYearList ]
	);

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
			}
		},
		[ activeAcademicYear, activeBranch ]
	);
	const columns = [
		{
			title: 'S. No',
			dataIndex: 'Sno',
			key: 'Sno',
			align: 'center',
			fixed: 'left',
			width: 60
		},
		{
			title: 'Academic Year',
			dataIndex: 'AcademicYear',
			key: 'AcademicYear',
			align: 'center',
			fixed: 'left',
			width: 100
		},
		{
			title: 'Branch',
			dataIndex: 'Branch',
			key: 'Branch',
			align: 'center',
			fixed: 'left',
			width: 60
		},
		{
			title: 'Teacher Code',
			dataIndex: 'TeacherCode',
			key: 'TeacherCode',
			align: 'center',
			width: 100
		},
		{
			title: 'Teacher Name',
			dataIndex: 'TeacherName',
			key: 'TeacherName',
			align: 'center',
			width: 200
		},
		{
			title: 'Teacher Type',
			dataIndex: 'TeacherType',
			key: 'TeacherType',
			align: 'center',
			width: 200
		},
		{
			title: 'Class',
			dataIndex: 'Class',
			key: 'Class',
			align: 'center',
			width: 60
		},
		{
			title: 'Section',
			dataIndex: 'Section',
			key: 'Section',
			align: 'center',
			width: 60
		},
		{
			title: 'Subject',
			dataIndex: 'Subject',
			key: 'Subject',
			align: 'center',
			width: 200
		},
		{
			title: 'Status',
			dataIndex: 'Status',
			key: 'Status',
			align: 'center',
			width: 100
		},
		{
			title: 'Action',
			dataIndex: '',
			key: 'x',
			align: 'center',
			width: 300,
			render: (item) => {
				return (
					<Space>
						<Button
							disabled={item.Status == 'Approved' || item.Status == 'InActive'}
							type="link"
							title="Approve Request"
							// block
							// size="sm"
							className={
								item.Status == 'Approved' || item.Status == 'InActive' ? 'text-muted' : ' text-success'
							}
							icon={<CheckCircleOutlined />}
							onClick={() => {
								setLoader(true);
								API_CALL({
									method: 'post',
									url: 'OnlineClasses/SubjectsSavingSap',
									data: {
										AcademicYear: item.AcademicYear,
										BranchCode: item.Branch,
										BranchName: '',
										StudentClass: item.Class,
										Section: item.Section,
										TeacherDetails: [
											{
												TeacherCode: item.TeacherCode,
												TeacherName: item.TeacherName,
												TeacherType: item.TeacherType,
												Attendance: 'Yes',
												Active: 'Yes'
											}
										],
										TeacherSubjectDetails: [
											{
												TeacherCode: item.TeacherCode,
												TeacherName: item.TeacherName,
												TeacherType: item.TeacherType,
												TeacherSubjects: [
													{
														SubjectCode: item.Subject,
														SubjectName: item.Subject,
														Active: 'Yes'
													}
												]
											}
										],
										Source: 'Web',
										UpdatedBy: userToken
									},
									callback: async ({ status, data }) => {
										if (data.SuccessCode != '') {
											API_CALL({
												method: 'get',
												params: { Id: item.SId },
												url: 'OnlineClasses/StatusUpdateforWebSubjects',
												callback: async ({ status, data }) => {
													serachFormikRef.current.handleSubmit();
													setLoader(false);
												}
											});
											notification.success({
												message: 'Record Saved',
												description: data.Result
											});
										} else {
											notification.success({
												message: 'Record Submission failed',
												description: data.Result
											});
											toast(data.Result);
											setLoader(false);
										}
										setLoader(false);
									}
								});
							}}
						/>

						{item.Status != 'Approved' && (
							<Button
								type="link"
								ghost
								title="Edit Request"
								disabled={item.Status == 'InActive'}
								// size="sm"
								icon={<EditOutlined />}
								onClick={() => {
									setInitialValues(item);
									setEditModal(!editModal);
								}}
							/>
						)}
						{item.Status != 'Approved' && (
							<Button
								danger
								type="link"
								disabled={item.Status == 'InActive'}
								// size="sm"
								icon={<DeleteOutlined />}
								title="Delete Request"
								onClick={() => {
									setLoader(true);
									API_CALL({
										method: 'post',
										url: 'OnlineClasses/SaveTeacherSujectsMappingData',
										data: {
											SId: item.SId,
											TeacherName: 'DeleteRecord'
										},
										callback: async ({ status, data }) => {
											if (data == '1') {
												notification.error({
													message: 'Record Deleted',
													description: 'Record deleted successfully'
												});
												serachFormikRef.current.handleSubmit();
											}

											setLoader(false);
										}
									});
								}}
							/>
						)}
					</Space>
				);
			}
		}
	];
	return (
		<Layout>
			<AntSidebar
				Children={
					<Card className="search-card h-100" title={<h6>Header Level Filters</h6>}>
						{activeAcademicYear && (
							<Formik
								innerRef={serachFormikRef}
								initialValues={{
									academicYear: activeAcademicYear,
									branch: activeBranch.id,
									class: '',
									section: '',
									teacher: '',
									Subject: '',
									Stucode: 'Created,Approved',
									Status: ''
								}}
								validate={(values) => {
									let errors = {};
									// if (!values.class) errors.class = 'Required';
									// if (!values.section) errors.section = 'Required';
									// if (!values.cycle) errors.cycle = 'Required';
									// if (!values.area) errors.area = 'Required';
									// if (!values.subject) errors.subject = 'Required';
									// if (!values.type) errors.type = 'Required';

									return errors;
								}}
								onSubmit={(values) => {
									// setAttendanceList([]);
									setSearchLoader(true);
									API_CALL({
										method: 'post',
										url: 'Master/GetSubjectsList',
										data: {
											TeacherName: null,
											Subject: null,
											Class: values.class || null,
											Section: values.section || null,
											SchoolBranchCode: activeBranch.id,
											Academicyear: activeAcademicYear,
											OnlineDate: null,
											TeacherCode: values.teacher || null,
											Fperiod: null,
											Tperiod: null,
											Stucode: values.Status ? 'InActive' : values.Stucode
										},
										callback: async ({ status, data }) => {
											if (status == 200) {
												if (data != []) setAllRequestList(data);
												else setAllRequestList([]);
											}
											setSearchLoader(false);
										}
									});
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
												handleOnChange={(branch) => {
													setFieldValue('class', '');
													setFieldValue('section', '');
													setFieldValue('cycle', '');
													// setFieldValue('area', '');
													// setFieldValue('subject', '');
													// setFieldValue('type', '');
												}}
												// label="School Branch"
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
													let payload = {
														UserMailId: userToken,
														AcademicYear: activeAcademicYear,
														Branch: activeBranch.id,
														AssessClass: cls
													};
													if (userDetails.Userrole == constants.userRole.teacher) {
														payload.TeacherCode = userDetails.TeacherCode;
														payload.Class = cls;
														delete payload.AssessClass;
													}
													dispatch(getSection(userDetails.Userrole, payload));
												}}
											/>

											<FormField
												name="section"
												type="select"
												placeholder="Section"
												// label="School Branch"
												required={true}
												list={sectionList}
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
													setLoader(true);
													// if (userDetails.Userrole == constants.userRole.teacher)
													API_CALL({
														method: 'post',
														url: 'Master/GetWebTeacherList',
														data: payload,
														callback: async ({ status, data }) => {
															if (status == 200) {
																setTeacherList(data);
															}
															setLoader(false);
														}
													});
													// else
													// 	API_CALL({
													// 		method: 'get',
													// 		url: 'OnlineClasses/GetAllTeachers',
													// 		params: {
													// 			Branch: activeBranch.id,
													// 			Year: activeAcademicYear
													// 		},
													// 		callback: async ({ status, data }) => {
													// 			if (status == 200) {
													// 				setTeacherList(data);
													// 			}
													// 			setLoader(false);
													// 		}
													// 	});
												}}
											/>

											<FormField
												name="teacher"
												type="select"
												placeholder="Teacher"
												// label="School Branch"
												required={true}
												list={teacherList}
												keyword="U_VALUS"
												displayName="U_Desc"
												handleOnChange={(teacherCode) => {
													let payload = {
														TeacherName: null,
														Subject: null,
														Class: values.class,
														Section: values.section,
														SchoolBranchCode: activeBranch.id,
														Academicyear: activeAcademicYear,
														OnlineDate: null,
														TeacherCode: teacherCode,
														Fperiod: null,
														Tperiod: null,
														Stucode: null
													};
													setLoader(true);
													API_CALL({
														method: 'post',
														url: 'Master/GetWebSubjects',
														data: payload,
														callback: async ({ status, data }) => {
															if (status == 200) {
																setSubjectList(data);
															}
															setLoader(false);
														}
													});
												}}
											/>
											<FormField
												name="Week"
												type="select"
												placeholder="Subject"
												// label="School Branch"
												required={true}
												list={subjectList}
												keyword="U_VALUS"
												displayName="U_Desc"
												handleOnChange={(sec) => {}}
											/>
											<FormField
												name="Stucode"
												type="select"
												placeholder="Status"
												list={[
													{
														U_Desc: 'All',
														U_VALUS: 'Created,Approved'
													},
													{
														U_Desc: 'Created',
														U_VALUS: 'Created'
													},
													{
														U_Desc: 'Approved',
														U_VALUS: 'Approved'
													}
												]}
												keyword="U_VALUS"
												displayName="U_Desc"
												// handleOnChange={handleSubmit}
											/>
											<FormField
												name="Status"
												type="checkbox"
												customLabel="Show Inactive Records"
											/>

											<Space>
												<Button type="primary " onClick={handleSubmit}>
													Search
												</Button>
												<Button
													className=" "
													onClick={() => {
														// resetForm();
														// setAttendanceHeader({});
														// setAttendanceList([]);
														// setInitialValues({});
													}}
												>
													Reset
												</Button>
											</Space>
										</Spin>
									</Form>
								)}
							</Formik>
						)}
					</Card>
				}
			/>
			<Layout.Content className="container-fluid  teacher-mapping d-flex">
				<Spin spinning={loader}>
					<FloatButton
						type="primary"
						// shape="square"
						// description="Create Request"
						tooltip={<div>Create New Request</div>}
						icon={<PlusOutlined />}
						onClick={() => setCreateModal(!createModal)}
					/>
					<CreateMappingRequest openModal={createModal} closeModal={() => setCreateModal(false)} />

					<CreateMappingRequest
						openModal={editModal}
						closeModal={() => setEditModal(false)}
						initValue={initialValues}
					/>
					{!_isEmpty(allRequestList) ? (
						<Card title={<div>CLASS SUBJECTS - TEACHER MAPPING</div>}>
							<Table
								bordered
								// rowSelection={rowSelection}
								columns={columns}
								dataSource={allRequestList}
								pagination={{
									showSizeChanger: true,
									pageSizeOptions: [ '10', '25', '50' ],
									showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
									position: [ 'topRight' ]
								}}
								scroll={{ y: 430, x: 'fit-content' }}
								rowKey="SId"
							/>
							<Row justify="end" className="mt-3">
								<Button type="primary">Approve</Button>
								<Button className="ml-3">Download</Button>
							</Row>
						</Card>
					) : (
						<Empty />
					)}
				</Spin>
			</Layout.Content>
		</Layout>
	);
};

export default TeacherMapping;
