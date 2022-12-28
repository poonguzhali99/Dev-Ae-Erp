import React, { useEffect, useState, Suspense } from 'react';
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
	Space
} from 'antd';
import { Formik } from 'formik';
import { Excel } from 'antd-table-saveas-excel';

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
import { useRef } from 'react';
import axios from 'axios';
import TableContent from './TableContent';
import AntSidebar from '../../../components/ant-sidebar';
import { EyeInvisibleOutlined, EyeOutlined, EyeTwoTone, QuestionCircleOutlined } from '@ant-design/icons';
import Item from 'antd/lib/list/Item';
import moment from 'moment/moment';

const ReportCard = () => {
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
		[ assesmentSubjects, setAssesmentSubjects ] = useState([]),
		[ categories, setCategories ] = useState([]),
		[ column, setColumn ] = useState([]);

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

	useEffect(
		() => {
			setActiveRows([]);
		},
		[ assesmentList ]
	);
	useEffect(() => {
		dispatch(getAcademicYear());
	}, []);

	// const columns = column;

	const columns = [
		{
			title: 'S. No',
			dataIndex: 'S. No',
			key: 'S. No',
			align: 'center',
			fixed: 'left',
			width: 60
		},
		{
			title: 'Student ID',
			dataIndex: 'Student ID',
			key: 'Student ID',
			align: 'center',
			fixed: 'left',
			width: 100
		},
		{
			title: 'Student Name',
			dataIndex: 'Student Name',
			key: 'Student Name',
			align: 'center',
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
			title: 'Roll No',
			dataIndex: 'Roll No.',
			key: 'Roll No.',
			align: 'center',
			width: 60
		},
		{
			title: 'Date of Birth',
			dataIndex: 'Date of Birth',
			key: 'Date of Birth',
			align: 'center',
			width: 100,
			render: (text) => <div>{moment(text, 'DD/MM/YYYY').format('DD-MMM-YYYY')}</div>
		},
		{
			title: 'Fathers Name',
			dataIndex: 'Fathers Name',
			key: 'Fathers Name',
			align: 'center',
			width: 220
		},
		{
			title: 'Mothers Name',
			dataIndex: 'Mothers Name',
			key: 'Mothers Name',
			align: 'center',
			width: 220
		},
		{
			title: 'View Offline Report Card',
			dataIndex: '',
			key: 'x',
			align: 'center',
			width: 200,
			render: (row) => {
				if (row.OfflineStatus == 'Ready') {
					return (
						<EyeOutlined
							onClick={() => {
								console.log('Clecked', row);
								setLoader(true);
								API_CALL({
									method: 'get',
									url: 'StudentManagement/DownloadpdfForStudent',
									params: {
										fileName: row['View Offline Report Card']
									},
									callback: async ({ status, data }) => {
										setLoader(false);
										if (status == 200) {
											let fileName = row['View Offline Report Card'].split('\\');
											let fetchDataModified = `data:application/pdf;base64,${data}`;
											let a = document.createElement('a');
											a.href = fetchDataModified;
											a.download = fileName[fileName.length - 1];
											a.click();
										}
									}
								});
							}}
							style={{ fontSize: 17, color: 'green' }}
							// twoToneColor="#278659"
						/>
					);
				} else {
					return (
						<EyeInvisibleOutlined
							// onClick={() => {
							// 	console.log('Clecked', row);
							// }}
							style={{ fontSize: 17, color: 'red' }}
						/>
					);
				}
			} // <Button className="justify-content-center align-items-center" icon={} />
		}
	];

	useEffect(
		() => {
			console.log('activeAcademicYear', activeAcademicYear);
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

	const onSelectChange = (newSelectedRowKeys, selectedRows) => {
		setActiveRows(selectedRows);
		setSelectedRowKeys(newSelectedRowKeys);
		// selectedRows.map((row) => edit(row));
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
		selections: [ Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE ]
	};

	const submitTable = (values) => {
		console.log('Values', values);
		setLoader(true);
		let payload = {
			AcademicYear: activeAcademicYear,
			BranchCode: activeBranch.id,
			ClassCode: serachFormikRef.current.values.class,
			Section: serachFormikRef.current.values.section,
			Period: serachFormikRef.current.values.cycle,
			StudnetCodes: '',
			UpdatedBy: userToken
		};

		activeRows.map((row, index) => {
			console.log('row', row['Student ID']);
			payload.StudnetCodes += row['Student ID'] + `${index < activeRows.length - 1 ? ',' : ''}`;
		});
		console.log('payload.StudnetCodes', payload);
		// console.log('StudnetAssessmentMarks', payload, JSON.stringify(payload));
		API_CALL({
			method: 'post',
			url: 'Assessment/GenerateReport',
			data: payload,
			callback: async ({ status, data }) => {
				setLoader(false);
				if (status == 200) {
					if (data.SuccessCode != '') {
						setActiveRows([]);
						setSelectedRowKeys([]);
						serachFormikRef.current.handleSubmit();
						notification.success({
							message: 'Report Generated',
							description: data.Result
						});
					} else {
						notification.error({
							message: 'Data Not Saved',
							description: data.ErrorDescription
						});
					}
				}
			}
		});
	};

	const downloadReportCards = () => {
		let payload = [];
		let fileName;
		activeRows.map((row, index) => {
			console.log('row', row['Student ID']);
			fileName = row['View Offline Report Card'].split('\\');
			console.log('fileName', fileName);
			payload.push({ FileName: fileName[fileName.length - 1], FilePath: row['View Offline Report Card'] });
			// payload.StudnetCodes += row['Student ID'] + `${index < activeRows.length - 1 ? ',' : ''}`;
		});
		console.log('payload', payload);
		API_CALL({
			method: 'post',
			url: 'Assessment/DownloadZipFile',
			data: payload,
			callback: async ({ status, data }) => {
				setLoader(false);
				if (status == 200) {
					// let fetchDataModified = `data:text/plain;base64,${data}`;
					// let a = document.createElement('a');
					// a.href = fetchDataModified;
					// a.download = fileName[fileName.length - 1];
					// a.click();
					var element = document.createElement('a');
					element.setAttribute('href', 'data:text/plain;base64,' + data);
					element.setAttribute('download', 'combined-files.zip');

					element.style.display = 'none';
					document.body.appendChild(element);

					element.click();

					document.body.removeChild(element);
				}
			}
		});
	};

	return (
		<Layout>
			<AntSidebar
				Children={
					<Card className="search-card h-100" title={<h6>Header Level Filters</h6>}>
						<Formik
							innerRef={serachFormikRef}
							initialValues={{
								branch: activeBranch.id,
								class: '',
								section: '',
								cycle: '',
								StudentStatus: ''
								// area: '',
								// subject: '',
								// type: ''
							}}
							validate={(values) => {
								let errors = {};
								if (!values.class) errors.class = 'Required';
								if (!values.section) errors.section = 'Required';
								if (!values.cycle) errors.cycle = 'Required';
								// if (!values.area) errors.area = 'Required';
								// if (!values.subject) errors.subject = 'Required';
								// if (!values.type) errors.type = 'Required';

								return errors;
							}}
							onSubmit={(values) => {
								setAssesmentList([]);
								setSearchLoader(true);
								API_CALL({
									method: 'get',
									url: 'Assessment/GetReportCards',
									params: {
										// UserMailId: userToken,
										AcademicYear: activeAcademicYear,
										Branch: activeBranch.id,
										AssessClass: values.class,
										Section: values.section,
										Period: values.cycle,
										StudentStatus: values.StudentStatus
										// Subject: values.subject,
										// catg: values.type
									},
									callback: async ({ status, data }) => {
										setSearchLoader(false);
										if (status === 200 && data.ARows != null) {
											data.ARows.map((da, index) => (da.key = index));
											setAssesmentList(data.ARows);
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
											name="cycle"
											type="select"
											placeholder="Assesment Cycle"
											// label="School Branch"
											required={true}
											list={periods}
											keyword="U_VALUS"
											displayName="U_Desc"
											handleOnChange={(cycle) => {
												setSearchLoader(true);
												// setFieldValue('area', '');
												// setFieldValue('subject', '');
												// setFieldValue('type', '');
												setPeriodSubjects([]);
												setAssesmentArea([]);
												API_CALL({
													method: 'get',
													url: 'Assessment/GetAssessmentPeriodSubjects',
													params: {
														UserMailId: userToken,
														AcademicYear: activeAcademicYear,
														Branch: userDetails.Userbranch,
														AssessClass: values.class,
														Section: values.section,
														Period: cycle
													},
													callback: async ({ status, data }) => {
														setSearchLoader(false);
														if (status == 200) {
															setPeriodSubjects(data);
															setAssesmentArea([
																...new Set(data.map(({ StudFee }) => StudFee))
															]);
														} else setPeriodSubjects([]);
													}
												});
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
					</Card>
				}
			/>
			<Layout.Content className="container-fluid  assesment d-flex">
				<Spin spinning={loader}>
					{/* <Formik initialValues={{ academicYear: activeAcademicYear }}>
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
					</Formik> */}
					{!_isEmpty(assesmentList) ? (
						<Card
							title={
								<div className="d-flex justify-content-between align-items-center">
									<div>Report Card</div>
									<Formik initialValues={{ academicYear: activeAcademicYear }} enableReinitialize>
										<FormField
											name="academicYear"
											type="select"
											placeholder="Academic Year"
											list={academicYearList}
											keyword="U_VALUS"
											displayName="U_Desc"
											handleOnChange={(year) => dispatch(setActiveAcademicYear(year))}
										/>
									</Formik>
								</div>
							}
						>
							<Spin spinning={cellLoader}>
								<Form form={form} component={false}>
									<Table
										bordered
										rowSelection={rowSelection}
										columns={columns}
										dataSource={assesmentList}
										rowKey={'S. No'}
										// components={{
										// 	body: {
										// 		cell: EditableCell
										// 	}
										// }}
										pagination={{
											showSizeChanger: true,
											pageSizeOptions: [ '10', '25', '50' ],
											showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
											position: [ 'topRight' ]
										}}
										scroll={{ y: 430, x: 'fit-content' }}
									/>
								</Form>
							</Spin>

							<Row justify="end" className="mt-3">
								<Button type="primary" htmlType="submit" onClick={submitTable}>
									Generate
								</Button>
								<Button className="ml-3" onClick={downloadReportCards}>
									Download Report Cards
								</Button>
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

export default ReportCard;
