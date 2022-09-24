import React, { useEffect, useState, Suspense } from 'react';
import { List, Card, Image, Divider, Spin, Row, Col, Button, Table, Input, InputNumber, Pagination } from 'antd';
import { Formik, Form } from 'formik';
import { SearchOutlined } from '@ant-design/icons';

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

const MarksEntry = () => {
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
	const data = [
		{
			'S No': '0',
			'Student ID': 'Maximum Marks',
			'Student Name': 'Maximum Marks',
			'Roll No': '-1',
			'Listening-Comprehension': '10',
			'Reading-Comprehension': '10',
			'Writing-Creative Writing': '10',
			'Writing-Vocabulary': '10',
			'Writing-Grammar': '10',
			'Writing-Spelling and Dictation': '10'
		},
		{
			'S No': '1',
			'Student ID': 'BP221019',
			'Student Name': 'Nymisha Gundadi',
			'Roll No': '0',
			'Listening-Comprehension': '35',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '2',
			'Student ID': 'BP221202',
			'Student Name': 'Yash Chauhan',
			'Roll No': '0',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '3',
			'Student ID': 'BP221257',
			'Student Name': 'Likhitha Sunkari',
			'Roll No': '0',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '4',
			'Student ID': 'BP221268',
			'Student Name': 'Kanchakatla Divyansh',
			'Roll No': '0',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '5',
			'Student ID': 'BP221378',
			'Student Name': 'Aira Aditri Pathri',
			'Roll No': '0',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '6',
			'Student ID': 'BP221489',
			'Student Name': 'Goguri Amogh Reddy',
			'Roll No': '0',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '7',
			'Student ID': 'BP171096',
			'Student Name': 'Abraham Chris Tatapude',
			'Roll No': '1',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '8',
			'Student ID': 'BP202362',
			'Student Name': 'Aditya Anshu Julakanti',
			'Roll No': '2',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '9',
			'Student ID': 'BP202356',
			'Student Name': 'Ashika Gilla',
			'Roll No': '4',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '10',
			'Student ID': 'BP191124',
			'Student Name': 'Billekallu Sai Skandan',
			'Roll No': '5',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '11',
			'Student ID': 'BP191380',
			'Student Name': 'K Vasihnavi Kollnur',
			'Roll No': '7',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '12',
			'Student ID': 'BP201368',
			'Student Name': 'Katikam Tanusree',
			'Roll No': '8',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '13',
			'Student ID': 'BP160141',
			'Student Name': 'Kriday Velagada',
			'Roll No': '9',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '14',
			'Student ID': 'BP191198',
			'Student Name': 'Lohith Reddy Y',
			'Roll No': '11',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '15',
			'Student ID': 'BP191195',
			'Student Name': 'M Karthikeya Shiva Kumar',
			'Roll No': '12',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '16',
			'Student ID': 'BP170606',
			'Student Name': 'Majety Venkata Karthikeya Gowtha',
			'Roll No': '13',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '17',
			'Student ID': 'BP191091',
			'Student Name': 'Mithakshi Vunyala',
			'Roll No': '15',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '18',
			'Student ID': 'BP191207',
			'Student Name': 'Murali Manvith Devarapalli',
			'Roll No': '16',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '19',
			'Student ID': 'BP181214',
			'Student Name': 'Nalapalli Joanna Evangeline',
			'Roll No': '17',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '20',
			'Student ID': 'BP181270',
			'Student Name': 'Namuduri Sri Mahathi',
			'Roll No': '18',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '21',
			'Student ID': 'BP191189',
			'Student Name': 'Navneeth Gopala',
			'Roll No': '19',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '22',
			'Student ID': 'BP160199',
			'Student Name': 'Padma Sahas',
			'Roll No': '20',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '23',
			'Student ID': 'BP170536',
			'Student Name': 'Jalagam Irshitha',
			'Roll No': '21',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '24',
			'Student ID': 'BP170585',
			'Student Name': 'Pyreddy Adhayantha Reddy',
			'Roll No': '23',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '25',
			'Student ID': 'BP191116',
			'Student Name': 'R  Aadhya Reddy',
			'Roll No': '24',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '26',
			'Student ID': 'BP170602',
			'Student Name': 'Rayagiri Sindhuja',
			'Roll No': '25',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '27',
			'Student ID': 'BP180538',
			'Student Name': 'Rishika Reddy U',
			'Roll No': '26',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '28',
			'Student ID': 'BP160216',
			'Student Name': 'Sai Swaroop Kumar Ashtikar',
			'Roll No': '28',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '29',
			'Student ID': 'BP170553',
			'Student Name': 'Shane Saju Jacob',
			'Roll No': '30',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '30',
			'Student ID': 'BP170675',
			'Student Name': 'Shanmukharam Motupalli',
			'Roll No': '31',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '31',
			'Student ID': 'BP170513',
			'Student Name': 'Sherwin Mark',
			'Roll No': '32',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '32',
			'Student ID': 'BP170541',
			'Student Name': 'Taha Chikhliwala',
			'Roll No': '33',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '33',
			'Student ID': 'BP170693',
			'Student Name': 'Tenjerla Venkata Saaketh',
			'Roll No': '34',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '34',
			'Student ID': 'BP170694',
			'Student Name': 'Tenjerla Venkata Soumith',
			'Roll No': '35',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '35',
			'Student ID': 'BP160230',
			'Student Name': 'Vayunand Boora',
			'Roll No': '36',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '36',
			'Student ID': 'BP170609',
			'Student Name': 'Vemulvada Sam Kishore',
			'Roll No': '38',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '37',
			'Student ID': 'BP181531',
			'Student Name': 'Vrishank Solleti',
			'Roll No': '39',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '38',
			'Student ID': 'BP201300',
			'Student Name': 'Tarini Chittimela',
			'Roll No': '39',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '39',
			'Student ID': 'BP170637',
			'Student Name': 'Vuyyuru Hariteja Reddy',
			'Roll No': '40',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		},
		{
			'S No': '40',
			'Student ID': 'BP170706',
			'Student Name': 'Mohd Abyan',
			'Roll No': '41',
			'Listening-Comprehension': '',
			'Reading-Comprehension': '',
			'Writing-Creative Writing': '',
			'Writing-Vocabulary': '',
			'Writing-Grammar': '',
			'Writing-Spelling and Dictation': ''
		}
	];
	const [ loader, setLoader ] = useState(false),
		[ searchLoader, setSearchLoader ] = useState(false),
		[ cellLoader, setCellLoader ] = useState(false),
		[ assesmentList, setAssesmentList ] = useState(data),
		[ periods, setPeriods ] = useState([]),
		[ periodSubjects, setPeriodSubjects ] = useState([]),
		[ assesmentArea, setAssesmentArea ] = useState([]),
		[ assesmentSubjects, setAssesmentSubjects ] = useState([]),
		[ categories, setCategories ] = useState([]),
		[ column, setColumn ] = useState([]);

	const serachFormikRef = useRef();

	useEffect(
		() => {
			if (!_isEmpty(assesmentList)) {
				let title = Object.keys(assesmentList[0]);
				let firstObj = assesmentList[0];
				let tempColumn = [];
				title.map((ti, index) => {
					if (index < 4) {
						tempColumn.push({
							title: ti,
							dataIndex: ti,
							fixed: 'left',
							width: ti == 'Student Name' ? 120 : ti == 'Student ID' ? 60 : 40,
							key: ti.replace(' ', ''),
							align: ti == 'Student Name' ? 'left' : 'center',
							render: (text) => <a className="p-1">{text}</a>
						});
					} else {
						let title = ti + '\n\n (Max Marks:' + firstObj[ti] + ')';
						tempColumn.push({
							title,
							dataIndex: ti,
							key: ti.replace(' ', ''),
							align: 'center',
							width: 70,
							editable: true,
							render: (_, record) => {
								return (
									<Input
										maxLength={3}
										defaultValue={record[ti]}
										onChange={(e) => {
											let numberRegex = /^[0-9\b]+$/;
											if (e.target.value == '' || numberRegex.test(e.target.value))
												return e.target.value;
										}}
										onBlur={(e) => {
											console.log('Value', e.target.value);
											if (!_isEmpty(e.target.value)) {
												// let header;
												// // To change the header configuration - specific
												// header = header = header;
												// // axios({
												// // 	method: 'post',
												// // 	url:
												// // 		'https://redirect-dev.ae-erp.in/SAPDEV/SLES/SAPAPI.asmx/PostStudentAssessmentMarksUpdateCellwise',
												// // 	// data: {
												// // 	// 	AcademicYear: activeAcademicYear,
												// // 	// 	BranchCode: activeBranch.id,
												// // 	// 	BranchName: activeBranch.name,
												// // 	// 	ClassCode: serachFormikRef.current.values.class,
												// // 	// 	Section: serachFormikRef.current.values.section,
												// // 	// 	Period: serachFormikRef.current.values.cycle,
												// // 	// 	SubjectCode: serachFormikRef.current.values.subject,
												// // 	// 	TestCategory: serachFormikRef.current.values.type,
												// // 	// 	AssesmentDocEntry: '13992',
												// // 	// 	StudentCode: record['Student ID'],
												// // 	// 	StudentName: record['Student Name'],
												// // 	// 	StudentRollNo: record['Roll No'],
												// // 	// 	SubTestName: ti,
												// // 	// 	StdntobtainedMarks: e.target.value,
												// // 	// 	StdntMaxMarks: firstObj[ti],
												// // 	// 	Source: 'WEB',
												// // 	// 	UpdatedBy: userToken
												// // 	// },
												// // 	data: {
												// // 		AcademicYear: activeAcademicYear,
												// // 		AssesmentDocEntry: '13992',
												// // 		BranchCode: activeBranch.id,
												// // 		BranchName: activeBranch.name, //"St. Andrew's School, Bowenpally",
												// // 		ClassCode: serachFormikRef.current.values.class,
												// // 		Period: serachFormikRef.current.values.cycle,
												// // 		Section: serachFormikRef.current.values.section,
												// // 		Source: 'WEB',
												// // 		StdntMaxMarks: firstObj[ti],
												// // 		StdntobtainedMarks: e.target.value,
												// // 		StudentCode: record['Student ID'],
												// // 		StudentName: record['Student Name'],
												// // 		StudentRollNo: record['Roll No'],
												// // 		SubTestName: ti,
												// // 		SubjectCode: serachFormikRef.current.values.subject,
												// // 		TestCategory: serachFormikRef.current.values.type,
												// // 		UpdatedBy: userToken
												// // 	}
												// // 	// params,
												// // 	// headers: header
												// // 	// validateStatus: (status) => {
												// // 	// 	if (status == 401) return false;
												// // 	// 	else return true; // I'm always returning true, you may want to do it depending on the status received
												// // 	// },
												// // 	// responseType: file ? 'arraybuffer' : 'json',
												// // 	// onUploadProgress: ({ loaded, total }) => {
												// // 	// 	let percent = Math.floor(loaded * 100 / total);
												// // 	// 	return onUploadProgress ? onUploadProgress(percent) : false;
												// // 	// 	// Do whatever you want with the native progress event
												// // 	// },
												// // 	// cancelToken
												// // })
												// // 	.then((data) => {
												// // 		console.log('data', data);
												// // 		// return callback(data);
												// // 	})
												// // 	.catch((e) => console.log('Error', e));
												// // setCellLoader(true);
												// API_CALL({
												// 	method: 'post',
												// 	fullUrl:
												// 		'https://redirect-dev.ae-erp.in/SAPDEV/SLES/SAPAPI.asmx/PostStudentAssessmentMarksUpdateCellwise',
												// 	data: {
												// 		AcademicYear: activeAcademicYear,
												// 		AssesmentDocEntry: '13992',
												// 		BranchCode: activeBranch.id,
												// 		BranchName: activeBranch.name, //"St. Andrew's School, Bowenpally",
												// 		ClassCode: serachFormikRef.current.values.class,
												// 		Period: serachFormikRef.current.values.cycle,
												// 		Section: serachFormikRef.current.values.section,
												// 		Source: 'WEB',
												// 		StdntMaxMarks: firstObj[ti],
												// 		StdntobtainedMarks: e.target.value,
												// 		StudentCode: record['Student ID'],
												// 		StudentName: record['Student Name'],
												// 		StudentRollNo: record['Roll No'],
												// 		SubTestName: ti,
												// 		SubjectCode: serachFormikRef.current.values.subject,
												// 		TestCategory: serachFormikRef.current.values.type,
												// 		UpdatedBy: userToken
												// 	},
												// 	callback: async ({ status, data }) => {
												// 		setCellLoader(false);
												// 		if (status === 200) {
												// 			// let tempData = data.ARows.slice(1);
												// 			// setAssesmentList(tempData);
												// 		}
												// 	}
												// });
											}
										}}
										style={{ width: 70 }}
										suffix={<Spin spinning={cellLoader} size="small" />}
									/>
								);
							}
						});
					}
				});
				setColumn(tempColumn);
			}
		},
		[ assesmentList ]
	);

	useEffect(
		() => {
			if (Array.isArray(academicYearList) && academicYearList.length > 0) {
				dispatch(setActiveAcademicYear(academicYearList[0].U_VALUS));
			}
		},
		[ academicYearList ]
	);
	useEffect(() => {
		dispatch(getAcademicYear());
	}, []);

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
		<div className="container-fluid  assesment">
			<Spin spinning={loader}>
				<Card className="m-2" title={<h4>Assesment Marks Entry</h4>}>
					<Card className="search-card">
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
								// if (!values.EmailId) errors.EmailId = 'Required';
								// if (!values.Password) errors.Password = 'Required';

								return errors;
							}}
							onSubmit={(values) => {
								setLoader(true);
								API_CALL({
									method: 'get',
									url: 'Assessment/GetAssessment',
									// fullUrl:
									// 	'https://redirect-dev.ae-erp.in/Ae-Erp-Api_DH/Assessment/GetAssessment?UserMailId=ann.jose%40standrewsindia.com&AcademicYear=2022-2023&Branch=LEETMP&AssessClass=VII&Section=A&Period=Term%201&Subject=Co-Scholastic%20Activities&catg=Co-Scholastic%20Activities',
									params: {
										UserMailId: userToken,
										AcademicYear: activeAcademicYear,
										Branch: activeBranch.id,
										AssessClass: values.class,
										Section: values.section,
										Period: values.cycle,
										Subject: values.subject,
										catg: values.type
									},
									callback: async ({ status, data }) => {
										setLoader(false);
										if (status === 200) {
											let tempData = data.ARows.slice(1);
											setAssesmentList(data.ARows);
										}
									}
								});
							}}
						>
							{({ values, handleSubmit, setFieldValue, resetForm }) => (
								<Form>
									<Spin spinning={searchLoader || sectionListLoader || classListLoader}>
										<Row gutter={16}>
											<Col className="gutter-row" span={6}>
												<FormField
													name="branch"
													type="select"
													placeholder="School Branch"
													required={true}
													list={branchList}
													keyword="U_VALUS"
													displayName="U_Desc"
												/>
											</Col>
											<Col className="gutter-row" span={6}>
												<FormField
													name="class"
													type="select"
													placeholder="Class"
													required={true}
													list={classList}
													keyword="U_VALUS"
													displayName="U_Desc"
													handleOnChange={(cls) => {
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
											</Col>
											<Col className="gutter-row" span={6}>
												<FormField
													name="section"
													type="select"
													placeholder="Section"
													// label="School Branch"
													required={true}
													list={sectionList}
													keyword="U_VALUS"
													displayName="U_Desc"
													handleOnChange={(sec) => {}}
												/>
											</Col>
											<Col className="gutter-row" span={6}>
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
											</Col>
										</Row>
										<Row gutter={16}>
											<Col className="gutter-row" span={6}>
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
														let tempArray = periodSubjects.filter(
															(res) => res.StudFee == assesarea
														);
														setAssesmentSubjects(tempArray);
													}}
												/>
											</Col>

											<Col className="gutter-row" span={6}>
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
											</Col>

											<Col className="gutter-row" span={6}>
												<FormField
													name="type"
													type="select"
													placeholder="Assesment Type"
													required={true}
													list={categories}
													keyword="U_VALUS"
													displayName="U_Desc"
												/>
											</Col>
										</Row>
										<Row justify="end">
											<Button type="primary" onClick={handleSubmit}>
												Search
											</Button>
											<Button className="ml-3" onClick={resetForm}>
												Reset
											</Button>
										</Row>
									</Spin>
								</Form>
							)}
						</Formik>
					</Card>
					{assesmentList &&
					!_isEmpty(assesmentList) && (
						<Card className="mt-2">
							<Spin spinning={cellLoader}>
								{/* <Table
									bordered
									columns={column}
									dataSource={assesmentList.slice(1)}
									pagination={{ pageSize: 10 }}
								/> */}
								<TableContent tableData={assesmentList} />
							</Spin>
						</Card>
					)}
					{!_isEmpty(assesmentList) && (
						<Row justify="end" className="mt-3">
							<Button type="primary" onClick={() => {}}>
								Submit
							</Button>
							<Button className="ml-3">Export</Button>
						</Row>
					)}
				</Card>
			</Spin>
		</div>
	);
};

export default MarksEntry;
