import React, { useEffect, useState, Suspense, useRef } from 'react';
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
	Modal
} from 'antd';
import { Formik } from 'formik';

import './style.scss';
import { useNavigate } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import FormField from '../../../components/form-field';
import API_CALL from '../../../services';
import {
	getAcademicYear,
	getClass,
	getSection,
	setActiveAcademicYear
} from '../../../services/academic-details/action';
import { constants } from '../../../utils/constants';
import AntSidebar from '../../../components/ant-sidebar';
import moment from 'moment/moment';
import StudentForm from '../../../components/student-form';

const StudentManagement = () => {
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

	const [ loader, setLoader ] = useState(false),
		[ searchLoader, setSearchLoader ] = useState(false),
		[ cellLoader, setCellLoader ] = useState(false),
		[ assesmentList, setAssesmentList ] = useState([]),
		[ periods, setPeriods ] = useState([]),
		[ periodSubjects, setPeriodSubjects ] = useState([]),
		[ assesmentArea, setAssesmentArea ] = useState([]),
		[ type, setType ] = useState(''),
		[ selectedStudent, setSelectedStudent ] = useState({}),
		[ detailsModal, setDetailsModal ] = useState(false);

	const [ selectedRowKeys, setSelectedRowKeys ] = useState([]);
	const [ form ] = Form.useForm();
	const [ editingKey, setEditingKey ] = useState('');
	const [ activeRows, setActiveRows ] = useState([]);

	const serachFormikRef = useRef();
	const inputRef = useRef();

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

	// const columns = column;

	const columns = [
		{
			title: 'Roll No',
			dataIndex: 'RollNumber',
			key: 'RollNumber',
			align: 'center',
			fixed: 'left',
			width: 60
		},
		{
			title: 'Student Id',
			dataIndex: 'CardCode',
			key: 'CardCode',
			align: 'center',
			fixed: 'left',
			width: 100,
			render: (value, row) => {
				return (
					<a
						// type="link"
						title="Click to View Details"
						className="justify-content-center align-items-center"
						// onClick={() => navigate(`/StudentDetails?studentId=${row.CardCode}`)}
						onClick={() => {
							setType('preview');
							setSelectedStudent(row);
							setDetailsModal(true);
						}}
					>
						{value}
					</a>
				);
			}
		},
		{
			title: 'Student Name',
			dataIndex: 'StudentName',
			key: 'StudentName',
			align: 'left',
			fixed: 'left',
			width: 220
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
			title: '2 Lang',
			dataIndex: 'SecondLanguage',
			key: 'SecondLanguage',
			align: 'center',
			width: 60
		},
		{
			title: '3 Lang',
			dataIndex: 'ThirdLanguage',
			key: 'ThirdLanguage',
			align: 'center',
			width: 60
			// render: (text) => <div>{moment(text, 'DD/MM/YYYY').format('DD-MMM-YYYY')}</div>
		},

		{
			title: 'Activity Group',
			dataIndex: 'ActivityGroup',
			key: 'ActivityGroup',
			align: 'center',
			width: 100
		},
		{
			title: 'Actions',
			dataIndex: '',
			key: 'x',
			align: 'center',
			width: 100,
			render: (row) => {
				return (
					<a
						className="justify-content-center align-items-center"
						onClick={() => {
							setType('update');
							setSelectedStudent(row);
							setDetailsModal(true);
						}}
					>
						Update
					</a>
				);
			}
		}
	];

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
									StudentStatus: '',
									studentId: ''
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
									setAssesmentList([]);
									setSearchLoader(true);
									API_CALL({
										method: 'post',
										url: 'StudentManagement/GetStudentDashboard',
										data: {
											AdminClass: values.class || null,
											AdminClass1: null,
											AdminSection: values.section || null,
											AdminSession: null,
											AdminBranch: activeBranch.id,
											AdminBranch1: null,
											AdminAdmyear: activeAcademicYear,
											AdminAdmyear1: null,
											Adminstudent: values.studentId || null,
											ProcessName: null,
											Action: 'GetStudentDashboard',
											StudentStatus: values.StudentStatus || null,
											Isselectedyear: null,
											IsselectedBranch: null,
											pagrn: 1,
											RowsPage: 100,
											stuProcessName: null,
											AdminAcadamicYeardropdown: null,
											AdminBranchDropdown: null,
											AdminClassdropdown: null,
											AdminSectiondropdown: null,
											Adminstudentdropdown: null,
											actiondropdown: null,
											studentstatusdropdown: null,
											studentstagesdropdown: null
										},
										callback: async ({ status, data }) => {
											setSearchLoader(false);
											if (status === 200) {
												// data.ARows.map((da, index) => (da.key = index));
												data.GetStudentManagementList.sort((a, b) => {
													var labelA, labelB;

													labelA = parseInt(a.RollNumber);
													labelB = parseInt(b.RollNumber);
													if (labelA < labelB) return -1;
												});
												setAssesmentList(data.GetStudentManagementList);
												setActiveRows([]);
												setSelectedRowKeys([]);
											} else {
												setAssesmentList([]);
											}
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
												// defaultValue={activeAcademicYear}
												// required={true}
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
													setFieldValue('cycle', '');
													// setFieldValue('area', '');
													// setFieldValue('subject', '');
													// setFieldValue('type', '');
													setPeriods([]);
													setPeriodSubjects([]);
													setAssesmentArea([]);
													let payload = {
														UserMailId: userToken,
														AcademicYear: activeAcademicYear,
														Branch: activeBranch.id,
														// TeacherCode: values.TeacherCode,
														AssessClass: cls
													};
													if (userDetails.Userrole == constants.userRole.teacher)
														payload.TeacherCode = userDetails.TeacherCode;
													dispatch(getSection(userDetails.Userrole, payload));
													setSearchLoader(true);
													API_CALL({
														method: 'get',
														url: 'Assessment/GetAssessmentPeriods',
														params: {
															UserMailId: userToken,
															AcademicYear: activeAcademicYear,
															Branch: activeBranch.id,
															AssessClass: cls
														},
														callback: async ({ status, data }) => {
															setSearchLoader(false);
															if (status == 200) setPeriods(data);
															else setPeriods([]);
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
												list={sectionList}
												keyword="U_VALUS"
												displayName="U_Desc"
												handleOnChange={(sec) => {
													setFieldValue('cycle', '');
													// setFieldValue('area', '');
													// setFieldValue('subject', '');
													// setFieldValue('type', '');
													// setPeriods([]);
													// setPeriodSubjects([]);
													// setAssesmentArea([]);
												}}
											/>

											<FormField
												name="StudentStatus"
												type="select"
												placeholder="Status"
												required={true}
												list={[
													{ U_VALUS: 'Active', U_Desc: 'Active' },
													{ U_VALUS: 'Inactive', U_Desc: 'Inactive' }
												]}
												keyword="U_VALUS"
												displayName="U_Desc"
											/>
											<FormField name="studentId" type="text" placeholder="Student ID" />

											<Space>
												<Button type="primary " onClick={handleSubmit}>
													Search
												</Button>
												<Button className=" " onClick={resetForm}>
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
			<Layout.Content className="container-fluid  student-management d-flex">
				<Spin spinning={loader}>
					<Card title={<div>Student Details</div>}>
						<Spin spinning={cellLoader}>
							{!_isEmpty(assesmentList) ? (
								<Form form={form} component={false}>
									<Table
										bordered
										columns={columns}
										dataSource={assesmentList}
										rowKey={'CardCode'}
										pagination={{
											showSizeChanger: true,
											pageSizeOptions: [ '10', '25', '50' ],
											showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
											position: [ 'topRight' ]
										}}
										scroll={{ y: 430, x: 'fit-content' }}
									/>
									<Row justify="end" className="mt-3">
										<Button type="primary" htmlType="submit">
											Export
										</Button>
										{/* <Button className="ml-3" onClick={downloadReportCards}>
									Export
								</Button> */}
									</Row>
								</Form>
							) : (
								<Empty />
							)}
						</Spin>
					</Card>
				</Spin>
				{selectedStudent && (
					<Modal
						open={detailsModal}
						title={
							<h4>{`Student Details of ${selectedStudent.StudentName}(${selectedStudent.CardCode})`}</h4>
						}
						// centered
						className="p-0"
						width={'100%'}
						// closable={false}
						footer={null}
						onCancel={() => {
							setDetailsModal(false);
						}}
					>
						<StudentForm studentId={selectedStudent.CardCode} type={type} closeModal={setDetailsModal} />
					</Modal>
				)}
			</Layout.Content>
		</Layout>
	);
};

export default StudentManagement;
