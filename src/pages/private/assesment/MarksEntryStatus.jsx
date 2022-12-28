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
import AntSidebar from '../../../components/ant-sidebar';

const MarksEntryStatus = () => {
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

	useEffect(() => {
		if (!_isEmpty(assesmentList)) {
			let title = Object.keys(assesmentList[0]);
			let firstObj = assesmentList[0];
			let tempColumn = [];

			Object.entries(assesmentList[0]).forEach(([ key, value ], index) => {
				if (index != Object.entries(assesmentList[0]).length - 1) {
					tempColumn.push({
						title: key,
						dataIndex: key,
						// fixed: 'left',
						// width: key == 'Marks Entry Status' ? 180 : key == 'Student ID' ? 100 : 80,
						width: 180,
						align: 'center',
						render: (text) => <a className="p-1">{text}</a>
					});
				}
			});
			setColumn(tempColumn);
		}
	});

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

	const edit = (record) => {
		let field = {};
		Object.entries(assesmentList[0]).forEach(([ key, value ], index) => {
			if (index > 3) {
				field[key.replace(' ', '')] = '';
			}
		});

		form.setFieldsValue({
			...field,
			...record
		});
		setEditingKey(record.key);
	};
	const isEditing = (record) => {
		// console.log('record', record);
		// return record.key === editingKey;
		return selectedRowKeys.includes(record.key);
	};

	const columns = column;

	// const reportColumns = column.map((col) => {
	// 	delete col.render;
	// 	return col;
	// });
	const mergedColumns = columns.map((col) => {
		if (!col.editable) {
			return col;
		}

		return {
			...col,
			onCell: (record, rowIndex) => {
				return {
					record,
					inputType: 'text',
					dataIndex: col.dataIndex,
					title: col.title,
					editing: isEditing(record)
				};
			}
		};
	});

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
								area: '',
								subject: '',
								type: ''
							}}
							validate={(values) => {
								let errors = {};
								if (!values.class) errors.class = 'Required';
								if (!values.section) errors.section = 'Required';
								if (!values.cycle) errors.cycle = 'Required';
								if (!values.area) errors.area = 'Required';
								if (!values.subject) errors.subject = 'Required';
								// if (!values.type) errors.type = 'Required';

								return errors;
							}}
							onSubmit={(values) => {
								setAssesmentList([]);
								setSearchLoader(true);
								API_CALL({
									method: 'get',
									url: 'Assessment/GetAssessmentmarksstatus',
									params: {
										UserMailId: userToken,
										AcademicYear: activeAcademicYear,
										Branch: activeBranch.id,
										AssessClass: values.class,
										Section: values.section,
										Period: values.cycle,
										Subject: values.subject,
										catg: values.area
									},
									callback: async ({ status, data }) => {
										setSearchLoader(false);
										if (status === 200 && data.ARows != null) {
											// data.ARows.map((da, index) => (da.key = index));
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
												setFieldValue('area', '');
												setFieldValue('subject', '');
												setFieldValue('type', '');
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
												setFieldValue('area', '');
												setFieldValue('subject', '');
												setFieldValue('type', '');
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
												setFieldValue('area', '');
												setFieldValue('subject', '');
												setFieldValue('type', '');
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
												setFieldValue('area', '');
												setFieldValue('subject', '');
												setFieldValue('type', '');
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
											name="area"
											type="select"
											placeholder="Assesment Area"
											// label="School Branch"
											required={true}
											list={assesmentArea}
											// keyword="U_VALUS"
											// displayName="U_Desc"
											handleOnChange={(assesarea) => {
												setFieldValue('subject', '');
												setFieldValue('type', '');
												setAssesmentSubjects([]);
												let tempArray = periodSubjects.filter(
													(res) => res.StudFee == assesarea
												);
												setAssesmentSubjects(tempArray);
											}}
										/>

										<FormField
											name="subject"
											type="select"
											placeholder="Assesment Subject"
											// label="School Branch"
											required={true}
											list={assesmentSubjects}
											keyword="U_VALUS"
											displayName="U_Desc"
											handleOnChange={(assesSubject) => {
												setSearchLoader(true);
												setFieldValue('type', '');
												setCategories([]);
												API_CALL({
													method: 'get',
													url: 'Assessment/GetAssessmentPeriodTestCategories',
													params: {
														UserMailId: userToken,
														AcademicYear: activeAcademicYear,
														Branch: userDetails.Userbranch,
														AssessClass: values.class,
														Section: values.section,
														Period: values.cycle,
														Subject: assesSubject
													},
													callback: async ({ status, data }) => {
														setSearchLoader(false);
														if (status == 200) {
															setCategories(data);
														}
													}
												});
											}}
										/>

										{/* <FormField
											name="type"
											type="select"
											placeholder="Assesment Type"
											required={true}
											list={categories}
											keyword="U_VALUS"
											displayName="U_Desc"
										/> */}
										<Space>
											<Button type="primary " onClick={handleSubmit}>
												Search
											</Button>
											<Button
												className=" "
												onClick={() => {
													resetForm();
													setAssesmentList([]);
													setPeriods([]);
													setAssesmentSubjects([]);
													setAssesmentArea([]);
													setCategories([]);
												}}
											>
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
									<div>Assesment Marks Entry</div>
									{/* {console.log(activeAcademicYear)} */}
									<Formik initialValues={{ academicYear: activeAcademicYear }} enableReinitialize>
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
									</Formik>
								</div>
							}
						>
							<Spin spinning={cellLoader}>
								{/* <Row className=" justify-content-between">
									<div>
										<Button type="link">
											1. Only characters [AB, EX, ML, NA, 0-9] are accepted.
										</Button>
										<Button type="link">2. Negative numbers are not accepted</Button>
										<Button type="link">3. Only one decimal point value accepted</Button>
									</div>
									<Tooltip
										// className="lengend"
										placement="left"
										title={'AB- Absent, ML- Medical Leave, EX-Exempted, NA-Not Applicable'}
										// color={''}
									>
										<Button type="link">Legend</Button>
									</Tooltip>
								</Row> */}

								<Form
									form={form}
									// scrollToFirstError={true}
									// onFinish={(values) => console.log('value', values)}
								>
									<Table
										bordered
										// rowSelection={rowSelection}
										columns={mergedColumns}
										dataSource={assesmentList.slice(1)}
										rowKey={'Marks Entry Status'}
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
									{/* <Row justify="end" className="mt-3">
										<Button type="primary" onClick={submitTable}>
											Submit
										</Button>
										<Button className="ml-3" onClick={exportToExcel}>
											Export
										</Button>
									</Row> */}
								</Form>
							</Spin>
						</Card>
					) : (
						<Empty />
					)}
				</Spin>
			</Layout.Content>
		</Layout>
	);
};

export default MarksEntryStatus;
