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
	Typography
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

const MarkAttendance = () => {
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
		[ weeksList, setWeeksList ] = useState([]),
		[ monthsList, setMonthsList ] = useState([]),
		[ attendanceList, setAttendanceList ] = useState([]),
		[ attendanceHeader, setAttendanceHeader ] = useState({}),
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
				let newArray = [];
				moment.monthsShort().map((month) => {
					if (month == 'Jan' || month == 'Feb' || month == 'Mar' || month == 'Apr') {
						newArray.push({
							U_Desc: `${month}-${activeAcademicYear.split('-')[1]}`,
							U_VALUS: moment(`${month}-${activeAcademicYear.split('-')[1]}`, 'MMM-YYYY').format('M-YYYY')
						});
					} else {
						newArray.push({
							U_Desc: `${month}-${activeAcademicYear.split('-')[0]}`,
							U_VALUS: moment(`${month}-${activeAcademicYear.split('-')[0]}`, 'MMM-YYYY').format('M-YYYY')
						});
					}
				});
				console.log('newArray', _sortBy(newArray, (item) => moment(item.U_VALUS, 'MMM-YYYY')));
				setMonthsList(_sortBy(newArray, (item) => moment(item.U_VALUS, 'MMM-YYYY')));
			}
		},
		[ activeAcademicYear, activeBranch ]
	);
	function getFullWeeksStartAndEndInMonth(month, year) {
		let weeks = [],
			firstDate = new Date(year, month, 1),
			lastDate = new Date(year, month + 1, 0),
			numDays = lastDate.getDate();

		let start = 1;
		let end;
		if (firstDate.getDay() === 1) {
			end = 7;
		} else if (firstDate.getDay() === 0) {
			let preMonthEndDay = new Date(year, month, 0);
			start = preMonthEndDay.getDate() - 6 + 1;
			end = 1;
		} else {
			let preMonthEndDay = new Date(year, month, 0);
			start = preMonthEndDay.getDate() + 1 - firstDate.getDay() + 1;
			end = 7 - firstDate.getDay() + 1;
			weeks.push({
				start: start,
				end: end
			});
			start = end + 1;
			end = end + 7;
		}
		while (start <= numDays) {
			weeks.push({
				start: start,
				end: end
			});
			start = end + 1;
			end = end + 7;
			end = start === 1 && end === 8 ? 1 : end;
			if (end > numDays && start <= numDays) {
				end = end - numDays;
				weeks.push({
					start: start,
					end: end
				});
				break;
			}
		}
		return weeks;
	}

	console.log('getFullWeeksStartAndEndInMonth', getFullWeeksStartAndEndInMonth(0, 2022));
	useEffect(
		() => {
			let tempObj = {};
			setInitialValues({});
			attendanceList.map((item) => {
				let obj = {};
				obj[item.StudnetCode + '-Day1'] = item.Day1;
				obj[item.StudnetCode + '-Day2'] = item.Day2;
				obj[item.StudnetCode + '-Day3'] = item.Day3;
				obj[item.StudnetCode + '-Day4'] = item.Day4;
				obj[item.StudnetCode + '-Day5'] = item.Day5;
				obj[item.StudnetCode + '-Day6'] = item.Day6;
				obj[item.StudnetCode + '-Day7'] = item.Day7;
				tempObj = { ...tempObj, ...obj };
			});
			console.log('tempObj', tempObj);
			setInitialValues(tempObj);
		},
		[ attendanceList ]
	);

	const columns = [
		{
			title: 'ID',
			dataIndex: 'StudnetCode',
			key: 'StudnetCode',
			align: 'center',
			fixed: 'left',
			width: 80
		},
		{
			title: 'Student Name',
			dataIndex: 'StudentName',
			key: 'StudentName',
			// align: 'center',
			fixed: 'left',
			width: 220
		},
		{
			title: 'Roll No',
			dataIndex: 'StudentRollNo',
			key: 'StudentRollNo',
			align: 'center',
			fixed: 'left',
			width: 80
		},
		{
			title: attendanceHeader['Day1'],
			dataIndex: 'Day1',
			key: 'Day1',
			align: 'center',
			// fixed: 'left',
			width: 100,
			render: (_, record) => {
				return (
					<FormField
						type="select"
						name={record.StudnetCode + '-Day1'}
						list={option}
						keyword="value"
						displayName="label"
						hideDefaultOption={true}
					/>
				);
			}
		},
		{
			title: attendanceHeader['Day2'],
			dataIndex: 'Day2',
			key: 'Day2',
			align: 'center',
			// fixed: 'left',
			width: 100,
			render: (_, record) => {
				return (
					<FormField
						type="select"
						name={record.StudnetCode + '-Day2'}
						list={option}
						keyword="value"
						displayName="label"
						hideDefaultOption={true}
					/>
				);
			}
		},
		{
			title: attendanceHeader['Day3'],
			dataIndex: 'Day3',
			key: 'Day3',
			align: 'center',
			// fixed: 'left',
			width: 100,
			render: (_, record) => {
				return (
					<FormField
						type="select"
						name={record.StudnetCode + '-Day3'}
						list={option}
						keyword="value"
						displayName="label"
						hideDefaultOption={true}
					/>
				);
			}
		},
		{
			title: attendanceHeader['Day4'],
			dataIndex: 'Day4',
			key: 'Day4',
			align: 'center',
			// fixed: 'left',
			width: 100,
			render: (_, record) => {
				return (
					<FormField
						type="select"
						name={record.StudnetCode + '-Day4'}
						list={option}
						keyword="value"
						displayName="label"
						hideDefaultOption={true}
					/>
				);
			}
		},
		{
			title: attendanceHeader['Day5'],
			dataIndex: 'Day5',
			key: 'Day5',
			align: 'center',
			// fixed: 'left',
			width: 100,
			render: (_, record) => {
				return (
					<FormField
						type="select"
						name={record.StudnetCode + '-Day5'}
						list={option}
						keyword="value"
						displayName="label"
						hideDefaultOption={true}
					/>
				);
			}
		},
		{
			title: attendanceHeader['Day6'],
			dataIndex: 'Day6',
			key: 'Day6',
			align: 'center',
			// fixed: 'left',
			width: 100,
			render: (_, record) => {
				return (
					<FormField
						type="select"
						name={record.StudnetCode + '-Day6'}
						list={option}
						keyword="value"
						displayName="label"
						hideDefaultOption={true}
					/>
				);
			}
		},
		{
			title: attendanceHeader['Day7'],
			dataIndex: 'Day7',
			key: 'Day7',
			align: 'center',
			// fixed: 'left',
			width: 100,
			render: (_, record) => {
				return (
					<FormField
						type="select"
						name={record.StudnetCode + '-Day7'}
						list={option}
						keyword="value"
						displayName="label"
						hideDefaultOption={true}
					/>
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
									Month: '',
									Week: ''
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
									setAttendanceList([]);
									setSearchLoader(true);
									API_CALL({
										method: 'get',
										url: 'Attendance/GetAttendance',
										params: {
											FromDate: values.Week.split('to')[0],
											ToDate: values.Week.split('to')[1],
											Branch: activeBranch.id,
											Class: values.class,
											Section: values.section,
											AcademicYear: activeAcademicYear,
											TeacherCode: userDetails.TeacherCode
										},
										callback: async ({ status, data }) => {
											setSearchLoader(false);
											if (status === 200) {
												setAttendanceList(
													data.attendanceDtos.filter((item) => item.StudentName != '')
												);
												setAttendanceHeader(data.Attendanceheader);
												// data.ARows.map((da, index) => (da.key = index));
												// data.GetStudentManagementList.sort((a, b) => {
												// 	var labelA, labelB;
												// 	labelA = parseInt(a.RollNumber);
												// 	labelB = parseInt(b.RollNumber);
												// 	if (labelA < labelB) return -1;
												// });
												// setAssesmentList(data.GetStudentManagementList);
												// setActiveRows([]);
												// setSelectedRowKeys([]);
											} else {
												// setAssesmentList([]);
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
													setFieldValue('cycle', '');
												}}
											/>

											<FormField
												name="Month"
												type="select"
												placeholder="Month"
												// label="School Branch"
												required={true}
												list={monthsList}
												keyword="U_VALUS"
												displayName="U_Desc"
												handleOnChange={(month) => {
													console.log('month', month);

													setWeeksList(
														weeksInMonth(month.split('-')[0], month.split('-')[1])
													);
												}}
											/>
											<FormField
												name="Week"
												type="select"
												placeholder="Week"
												// label="School Branch"
												required={true}
												list={weeksList}
												keyword="U_VALUS"
												displayName="U_Desc"
												handleOnChange={(sec) => {}}
											/>

											<Space>
												<Button type="primary " onClick={handleSubmit}>
													Search
												</Button>
												<Button
													className=" "
													onClick={() => {
														resetForm();
														setAttendanceHeader({});
														setAttendanceList([]);
														setInitialValues({});
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
			<Layout.Content className="container-fluid  attendance d-flex">
				<Spin spinning={loader}>
					<Card title={<div>Student Details</div>}>
						{attendanceList && !_isEmpty(initialValues) ? (
							<Formik
								initialValues={{ ...initialValues, markDate: '', value: '' }}
								onSubmit={(values) => {
									console.log('--->', values);
									let attendanceDtos = attendanceList.map((item) => {
										(item.Day1 = values[item.StudnetCode + '-Day1']),
											(item.Day2 = values[item.StudnetCode + '-Day2']),
											(item.Day3 = values[item.StudnetCode + '-Day3']),
											(item.Day4 = values[item.StudnetCode + '-Day4']),
											(item.Day5 = values[item.StudnetCode + '-Day5']),
											(item.Day6 = values[item.StudnetCode + '-Day6']),
											(item.Day7 = values[item.StudnetCode + '-Day7']);
										return item;
									});

									let payload = {
										TeacherCode: userDetails.TeacherCode,
										BranchCode: activeBranch.id,
										Section: serachFormikRef.current.values.section,
										ClassCode: serachFormikRef.current.values.class,
										AttendaceFromDate: serachFormikRef.current.values.Week.split('to')[0],
										AttendaceToDate: serachFormikRef.current.values.Week.split('to')[1],
										AcademicYear: activeAcademicYear,
										Source: null,
										UpdatedBy: userToken,
										attendanceDtos
									};
									API_CALL({
										method: 'post',
										url: 'Attendance/InsertAttendace',
										data: payload,
										callback: async ({ status, data }) => {
											setSearchLoader(false);
											let result = data.Result.split('-');
											if (status == 200 && data.SuccessCode != '') {
												notification.success({
													message: result[0],
													description: result[result.length - 1]
												});
											} else
												notification.error({
													message: result[0],
													description: result[result.length - 1]
												});
										}
									});
								}}
							>
								{({ values, handleSubmit, setFieldValue, setFieldError }) => (
									<div>
										<Row>
											<Col
												span={4}
												className="mr-2 d-flex justify-content-center align-items-center"
											>
												<Typography.Text strong>Mark for Date</Typography.Text>
											</Col>
											<Col span={4} className="mr-2 d-flex align-items-center">
												<FormField
													type="date"
													name="markDate"
													disabledDate={(val) =>
														!moment(val).isBetween(
															moment().startOf('week'),
															moment().endOf('week')
														)}
												/>
											</Col>
											<Col span={4} className="mr-2 ">
												<FormField
													type="select"
													name="value"
													list={[
														{
															value: 'P',
															label: 'P'
														},
														{
															value: 'H',
															label: 'H'
														}
													]}
													keyword="value"
													displayName="label"
													hideDefaultOption={true}
												/>
											</Col>
											<Col span={4} className="d-flex align-items-center">
												<Button
													type="primary"
													onClick={() => {
														let findedKey = '';

														Object.entries(
															attendanceHeader
														).forEach(([ key, value ], index) => {
															if (
																value &&
																moment(value.split('|')[1], 'DD-MMM').format(
																	'DD-MMM'
																) == moment(values.markDate).format('DD-MMM')
															) {
																findedKey = key;
															}
														});
														if (values.markDate && !_isEmpty(values.value)) {
															attendanceList.forEach((item) => {
																setFieldValue(
																	item.StudnetCode + '-' + findedKey,
																	values.value
																);
															});
														}
													}}
												>
													Submit
												</Button>
											</Col>
										</Row>
										<Table
											bordered
											columns={columns}
											dataSource={attendanceList}
											rowKey={'StudnetCode'}
											pagination={{
												showSizeChanger: true,
												pageSizeOptions: [ '10', '25', '50' ],
												showTotal: (total, range) =>
													`${range[0]}-${range[1]} of ${total} items`,
												position: [ 'bottomRight' ]
											}}
											scroll={{ y: 430, x: 'fit-content' }}
										/>
										<Row justify="end" className="mt-3">
											<Button type="primary" onClick={handleSubmit}>
												Save
											</Button>
										</Row>
									</div>
								)}
							</Formik>
						) : (
							<Empty />
						)}
					</Card>
				</Spin>
			</Layout.Content>
		</Layout>
	);
};

export default MarkAttendance;
