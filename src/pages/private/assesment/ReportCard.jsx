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
	// const data = [
	// 	{
	// 		'S. No': '1',
	// 		'Student ID': 'BP201204',
	// 		'Student Name': 'Aaron Ryan Andrew',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '1',
	// 		'Date of Birth': '21/05/2015',
	// 		'Fathers Name': 'Late Judah Emmanuel Koyyalamudi',
	// 		'Mothers Name': 'Sripriya Koyyalamudi',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Generate',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP201204_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP201204_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '2',
	// 		'Student ID': 'BP201201',
	// 		'Student Name': 'Akhil Sohan Manne',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '2',
	// 		'Date of Birth': '11/11/2014',
	// 		'Fathers Name': 'Lokesh Manne',
	// 		'Mothers Name': 'Lavanya Manne',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Generate',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP201201_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP201201_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '3',
	// 		'Student ID': 'BP180692',
	// 		'Student Name': 'Beesa Ashriel Nishika',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '3',
	// 		'Date of Birth': '02/06/2014',
	// 		'Fathers Name': 'B Moses Nishikanth',
	// 		'Mothers Name': 'B Nessy Deepika Moses',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Generate',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP180692_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP180692_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '4',
	// 		'Student ID': 'BP180794',
	// 		'Student Name': 'Chris Denzil Joseph',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '4',
	// 		'Date of Birth': '08/03/2014',
	// 		'Fathers Name': 'Denzil Joseph',
	// 		'Mothers Name': 'Joseph Silpa Maria',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Generate',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP180794_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP180794_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '5',
	// 		'Student ID': 'BP180514',
	// 		'Student Name': 'Daniel Robinson',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '5',
	// 		'Date of Birth': '04/02/2014',
	// 		'Fathers Name': 'Robinson Paradeshi',
	// 		'Mothers Name': 'Tabitha Chekuri',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Generate',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP180514_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP180514_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '6',
	// 		'Student ID': 'BP180683',
	// 		'Student Name': 'Garnipudi Dharmani Rama Himanish',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '6',
	// 		'Date of Birth': '04/11/2015',
	// 		'Fathers Name': 'Gsvrmurthy ',
	// 		'Mothers Name': 'Gnsv Lakshmi',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP180683_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP180683_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '7',
	// 		'Student ID': 'BP211060',
	// 		'Student Name': 'Gaurav Nishanth Nair',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '7',
	// 		'Date of Birth': '22/01/2015',
	// 		'Fathers Name': 'Nishanth S',
	// 		'Mothers Name': 'Hetal Gosar',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Generate',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP211060_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP211060_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '8',
	// 		'Student ID': 'BP221762',
	// 		'Student Name': 'Hanish Pabba',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '8',
	// 		'Date of Birth': '27/07/2014',
	// 		'Fathers Name': 'Anjaneyulu Pabba',
	// 		'Mothers Name': 'Kavitha Pabba',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP221762_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP221762_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '9',
	// 		'Student ID': 'BP211080',
	// 		'Student Name': 'Hrishikesh Surivirala',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '9',
	// 		'Date of Birth': '05/01/2015',
	// 		'Fathers Name': 'Venkatesh Surivirala',
	// 		'Mothers Name': 'Gayathri Surivirala',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP211080_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP211080_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '10',
	// 		'Student ID': 'BP180793',
	// 		'Student Name': 'Ishani Aruva',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '10',
	// 		'Date of Birth': '29/03/2015',
	// 		'Fathers Name': 'Aruva Venkata Ramana Rao',
	// 		'Mothers Name': 'Aruva Snehal',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP180793_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP180793_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '11',
	// 		'Student ID': 'BP221644',
	// 		'Student Name': 'Ishita Sidramaina',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '11',
	// 		'Date of Birth': '16/03/2015',
	// 		'Fathers Name': 'Venkatesh Sidramaina',
	// 		'Mothers Name': 'Jyothi Sidramaina',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP221644_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP221644_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '12',
	// 		'Student ID': 'BP170587',
	// 		'Student Name': 'Jakkannagari Sai Aarav Reddy',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '12',
	// 		'Date of Birth': '14/08/2014',
	// 		'Fathers Name': 'Madhukar Reddy J',
	// 		'Mothers Name': 'Shilpa Reddy J',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP170587_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP170587_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '13',
	// 		'Student ID': 'BP180671',
	// 		'Student Name': 'Kanapuram Shrenika Reddy',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '13',
	// 		'Date of Birth': '17/09/2014',
	// 		'Fathers Name': 'K Narender Reddy',
	// 		'Mothers Name': 'K Shashikala',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP180671_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP180671_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '14',
	// 		'Student ID': 'BP191178',
	// 		'Student Name': 'Kanish Jaiswal',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '14',
	// 		'Date of Birth': '11/02/2015',
	// 		'Fathers Name': 'Sachin Jaiswal',
	// 		'Mothers Name': 'Supriya Jaiswal',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP191178_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP191178_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '15',
	// 		'Student ID': 'BP211528',
	// 		'Student Name': 'Kartikeya Nanduru',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '15',
	// 		'Date of Birth': '30/05/2014',
	// 		'Fathers Name': 'Durga Prasad Nanduru',
	// 		'Mothers Name': 'Vaagdevi G S M',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP211528_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP211528_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '16',
	// 		'Student ID': 'BP204137',
	// 		'Student Name': 'Kodithyala Roshita',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '16',
	// 		'Date of Birth': '24/10/2014',
	// 		'Fathers Name': 'Santosh Kodithyala',
	// 		'Mothers Name': 'Kodithyala Aparna',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP204137_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP204137_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '17',
	// 		'Student ID': 'BP221673',
	// 		'Student Name': 'Kruthi Bharat M',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '17',
	// 		'Date of Birth': '16/09/2014',
	// 		'Fathers Name': 'Bharat Kumar M M',
	// 		'Mothers Name': 'Gayathri V',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP221673_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP221673_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '18',
	// 		'Student ID': 'BP221788',
	// 		'Student Name': 'Laasya Sri Padda',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '18',
	// 		'Date of Birth': '28/04/2014',
	// 		'Fathers Name': 'Balaraju Padda',
	// 		'Mothers Name': 'Meena Kumari Padda',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP221788_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP221788_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '19',
	// 		'Student ID': 'BP201359',
	// 		'Student Name': 'Litesh Kommineni',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '19',
	// 		'Date of Birth': '04/12/2014',
	// 		'Fathers Name': 'Suresh Kommineni',
	// 		'Mothers Name': 'Apoorva Bandlamudi',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP201359_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP201359_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '20',
	// 		'Student ID': 'BP221417',
	// 		'Student Name': 'Malla Beulah Keerthana',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '20',
	// 		'Date of Birth': '14/03/2015',
	// 		'Fathers Name': 'Penta Rao Malla',
	// 		'Mothers Name': 'Kamala Malla',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP221417_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP221417_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '21',
	// 		'Student ID': 'BP170551',
	// 		'Student Name': 'Marasaketla Prerna',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '21',
	// 		'Date of Birth': '08/02/2014',
	// 		'Fathers Name': 'M Suresh',
	// 		'Mothers Name': 'D Divya',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP170551_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP170551_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '22',
	// 		'Student ID': 'BP180994',
	// 		'Student Name': 'Meesala Chandrasekhar Naidu',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '22',
	// 		'Date of Birth': '03/04/2014',
	// 		'Fathers Name': 'Meesala Tirupathi Rao',
	// 		'Mothers Name': 'Meesala Lalitha Kumari',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP180994_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP180994_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '23',
	// 		'Student ID': 'BP202268',
	// 		'Student Name': 'N Nayonika',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '23',
	// 		'Date of Birth': '16/01/2015',
	// 		'Fathers Name': 'N P Shiva Kumar',
	// 		'Mothers Name': 'N Srilatha ',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP202268_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP202268_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '24',
	// 		'Student ID': 'BP221592',
	// 		'Student Name': 'Nithin Pendli',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '24',
	// 		'Date of Birth': '16/03/2014',
	// 		'Fathers Name': 'Ravi Pendli',
	// 		'Mothers Name': 'Yashoda Pendli',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP221592_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP221592_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '25',
	// 		'Student ID': 'BP201390',
	// 		'Student Name': 'Pranaya Alexander',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '25',
	// 		'Date of Birth': '29/05/2014',
	// 		'Fathers Name': 'Joseph Raj Alexander',
	// 		'Mothers Name': 'Aruna Alexander',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP201390_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP201390_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '26',
	// 		'Student ID': 'BP170660',
	// 		'Student Name': 'Prayag Goud D',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '26',
	// 		'Date of Birth': '08/01/2014',
	// 		'Fathers Name': 'D Praveen',
	// 		'Mothers Name': 'D Sulochana',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP170660_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP170660_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '27',
	// 		'Student ID': 'BP180719',
	// 		'Student Name': 'Retika B',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '27',
	// 		'Date of Birth': '15/04/2014',
	// 		'Fathers Name': 'M Brucelee',
	// 		'Mothers Name': 'B Rajani',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP180719_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP180719_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '28',
	// 		'Student ID': 'BP170522',
	// 		'Student Name': 'Rohansh G',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '28',
	// 		'Date of Birth': '18/12/2014',
	// 		'Fathers Name': 'Gurrappu Praveen',
	// 		'Mothers Name': 'Kausalya Devi',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP170522_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP170522_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '29',
	// 		'Student ID': 'BP201881',
	// 		'Student Name': 'Rujula Purthala',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '29',
	// 		'Date of Birth': '14/01/2015',
	// 		'Fathers Name': 'Pramod Kumar Purthala',
	// 		'Mothers Name': 'Kalyani Purthala',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP201881_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP201881_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '30',
	// 		'Student ID': 'BP191331',
	// 		'Student Name': 'Sahasransh Reddy Thummala',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '30',
	// 		'Date of Birth': '05/01/2015',
	// 		'Fathers Name': 'Nikhil ',
	// 		'Mothers Name': 'Sandhya ',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP191331_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP191331_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '31',
	// 		'Student ID': 'BP202327',
	// 		'Student Name': 'Sai Sathwane',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '31',
	// 		'Date of Birth': '14/12/2014',
	// 		'Fathers Name': 'Dilkhush Sathwane',
	// 		'Mothers Name': 'Gayatri Sathwane',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP202327_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP202327_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '32',
	// 		'Student ID': 'BP221729',
	// 		'Student Name': 'Setty Abisarika',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '32',
	// 		'Date of Birth': '04/07/2014',
	// 		'Fathers Name': 'Setty Ananda Rao',
	// 		'Mothers Name': 'Setty Alvi Grace',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP221729_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP221729_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '33',
	// 		'Student ID': 'BP191337',
	// 		'Student Name': 'Shanmukha Sai Sri Sanvitha Garimella',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '33',
	// 		'Date of Birth': '20/06/2014',
	// 		'Fathers Name': 'S V S Sastry Garimella',
	// 		'Mothers Name': 'Bhavana Garimella',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP191337_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP191337_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '34',
	// 		'Student ID': 'BP191335',
	// 		'Student Name': 'Sristi Maddikunta',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '34',
	// 		'Date of Birth': '12/09/2014',
	// 		'Fathers Name': 'Ravinder Reddy Maddikunta',
	// 		'Mothers Name': 'Shilpa Maddikunta',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP191335_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP191335_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '35',
	// 		'Student ID': 'BP211008',
	// 		'Student Name': 'Srivarsha Deekonda',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '35',
	// 		'Date of Birth': '12/01/2015',
	// 		'Fathers Name': 'Vamshi Krishna Deekonda',
	// 		'Mothers Name': 'Sharada Deekonda',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP211008_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP211008_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '36',
	// 		'Student ID': 'BP201183',
	// 		'Student Name': 'Suvidha Kalivemula',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '36',
	// 		'Date of Birth': '02/05/2014',
	// 		'Fathers Name': 'Anil Kumar Ch',
	// 		'Mothers Name': 'Prasoona Ch',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP201183_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP201183_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '37',
	// 		'Student ID': 'BP222012',
	// 		'Student Name': 'Tejasvi T',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '37',
	// 		'Date of Birth': '14/06/2014',
	// 		'Fathers Name': 'Thiraviarajan T',
	// 		'Mothers Name': 'Dhana Lakshmi T',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP222012_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP222012_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '38',
	// 		'Student ID': 'BP180746',
	// 		'Student Name': 'Tumbooru Hanshith Reddy',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '38',
	// 		'Date of Birth': '25/04/2015',
	// 		'Fathers Name': 'Tumbooru Subramanya Aditya Reddy',
	// 		'Mothers Name': 'Jaggavarapu Aswani',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP180746_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP180746_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '39',
	// 		'Student ID': 'BP201179',
	// 		'Student Name': 'V. Harsith Reddy',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '39',
	// 		'Date of Birth': '07/01/2015',
	// 		'Fathers Name': 'Bhaskara Reddy',
	// 		'Mothers Name': 'Sunitha Tappari',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP201179_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP201179_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	},
	// 	{
	// 		'S. No': '40',
	// 		'Student ID': 'BP180781',
	// 		'Student Name': 'Yashwita Sharma',
	// 		Class: 'III',
	// 		Section: 'A',
	// 		'Roll No.': '40',
	// 		'Date of Birth': '27/10/2014',
	// 		'Fathers Name': 'Amit Kumar Sharma',
	// 		'Mothers Name': 'Sushma Sharma',
	// 		Status: 'Generate',
	// 		OfflineStatus: 'Ready',
	// 		'View Online Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP180781_III_Term 1_Online.pdf',
	// 		'View Offline Report Card':
	// 			'E:\\Attachments\\Students Data\\Report Cards\\SLES\\2022-2023\\SLESBP\\BP180781_III_Term 1_Offline.pdf',
	// 		AccessReportCard: 'No',
	// 		MarksEntryStatus: 'Entered'
	// 	}
	// ];
	// data.map((da, index) => (da.key = index));
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

	// useEffect(() => {
	// 	if (!_isEmpty(assesmentList)) {
	// 		let title = Object.keys(assesmentList[0]);
	// 		let firstObj = assesmentList[0];
	// 		let tempColumn = [];

	// 		Object.entries(assesmentList[0]).forEach(([ key, value ], index) => {
	// 			if (index < 4) {
	// 				tempColumn.push({
	// 					title: key,
	// 					dataIndex: key,
	// 					fixed: 'left',
	// 					width: key == 'Student Name' ? 180 : key == 'Student ID' ? 100 : 80,
	// 					align: key == 'Student Name' ? 'left' : 'center',
	// 					render: (text) => <a className="p-1">{text}</a>
	// 				});
	// 			} else {
	// 				let title = key + '\n (Max Marks:' + firstObj[key] + ')';
	// 				if (key != 'key')
	// 					tempColumn.push({
	// 						title,
	// 						dataIndex: key,
	// 						align: 'center',
	// 						width: 120
	// 						// render: (_, record) => {
	// 						// 	return (
	// 						// 		<Form.Item
	// 						// 			name={key + record.key}
	// 						// 			rules={[
	// 						// 				{
	// 						// 					required: isEditing(record) && true,
	// 						// 					message: '',
	// 						// 					validator: (_, value) => {
	// 						// 						console.log('value', value);
	// 						// 						if (_isEmpty(value)) {
	// 						// 							// notification.error({
	// 						// 							// 	message: 'Invalid Input',
	// 						// 							// 	description: 'Marks entered should not be empty'
	// 						// 							// });
	// 						// 							return Promise.reject(
	// 						// 								new Error('Marks entered should not be empty')
	// 						// 							);
	// 						// 						} else if (value > parseInt(firstObj[key]) || value < 0) {
	// 						// 							console.log('Error');
	// 						// 							// notification.error({
	// 						// 							// 	message: 'Invalid Input',
	// 						// 							// 	description:
	// 						// 							// 		'Marks entered should not be greater than Max Marks'
	// 						// 							// });
	// 						// 							return Promise.reject(
	// 						// 								new Error('Price must be greater than zero!')
	// 						// 							);

	// 						// 							inputRef.current.focus();
	// 						// 						} else {
	// 						// 							// return Promise.resolve();
	// 						// 						}
	// 						// 					}
	// 						// 					// message: `${key} is required.`
	// 						// 				}
	// 						// 			]}
	// 						// 		>
	// 						// 			<Input
	// 						// 				maxLength={4}
	// 						// 				id={key + record.key}
	// 						// 				ref={inputRef}
	// 						// 				className="text-center"
	// 						// 				defaultValue={record[key]}
	// 						// 				// defaultValue={5}
	// 						// 				disabled={!isEditing(record)}
	// 						// 				onChange={(e) => {
	// 						// 					if (e.target.value > parseInt(firstObj[key]) || e.target.value < 0) {
	// 						// 						console.log('Error');
	// 						// 						inputRef.current.focus({
	// 						// 							cursor: 'all'
	// 						// 						});
	// 						// 						// notification.error({
	// 						// 						// 	message: 'Invalid Input',
	// 						// 						// 	description:
	// 						// 						// 		'Marks entered should not be greater than Max Marks'
	// 						// 						// });
	// 						// 						// e.preventDefault();
	// 						// 						return (e.target.value = '');
	// 						// 					}
	// 						// 				}}
	// 						// 				onKeyPress={(event) => {
	// 						// 					let decimalRegax = /^[0-9ABMLEXNabmlexn.]+\.?[0-9]*$/;
	// 						// 					// if (!/[0-9ABMLEXNabmlexn.][\.\d]*(,\d+)?(\d*)/.test(event.key)) {
	// 						// 					if (decimalRegax.test(event.key) == false) {
	// 						// 						console.log('incorrect Number');
	// 						// 						event.preventDefault();
	// 						// 					}
	// 						// 				}}
	// 						// 				onBlur={async (e) => {
	// 						// 					let decimalRegax = /^\d+(\.\d)?\d*$/;
	// 						// 					if (decimalRegax.test(e.key)) {
	// 						// 						console.log('incorrect Number');
	// 						// 						e.preventDefault();
	// 						// 					}
	// 						// 					if (e.target.value > parseInt(firstObj[key]) || e.target.value < 0) {
	// 						// 						console.log('Error');
	// 						// 						inputRef.current.focus({
	// 						// 							cursor: 'all'
	// 						// 						});
	// 						// 						// notification.error({
	// 						// 						// 	message: 'Invalid Input',
	// 						// 						// 	description:
	// 						// 						// 		'Marks entered should not be greater than Max Marks'
	// 						// 						// });
	// 						// 					} else {
	// 						// 						try {
	// 						// 							const row = await form.validateFields();
	// 						// 							const newData = [ ...activeRows ];
	// 						// 							const index = newData.findIndex(
	// 						// 								(item) => record.key === item['key']
	// 						// 							);
	// 						// 							let selectedObj = newData[index];
	// 						// 							selectedObj[key] = e.target.value;
	// 						// 							newData[index] = selectedObj;
	// 						// 							setActiveRows(newData);
	// 						// 						} catch (errInfo) {
	// 						// 							console.log('Validate Failed:', errInfo);
	// 						// 						}
	// 						// 					}
	// 						// 				}}
	// 						// 				style={{ width: 70 }}
	// 						// 				// suffix={<Spin spinning={cellLoader} size="small" />}
	// 						// 			/>
	// 						// 		</Form.Item>
	// 						// 	);
	// 						// }
	// 					});
	// 			}
	// 		});
	// 		setColumn(tempColumn);
	// 	}
	// });

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
							className="mt-2"
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
