import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import _isEmpty from 'lodash/isEmpty';

import './style.scss';

import Spinner from '../../../components/spinner';
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	Row,
	Col,
	Input,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Media,
	FormGroup,
	Label,
	ListGroup
} from 'reactstrap';
import { Formik } from 'formik';
import Loader from '../../../components/Loader';
import Empty from '../../../components/empty';
import { logOut } from '../../../services/auth/action';
import Header from '../../../components/header';
import DateFilter from '../../../components/date-filter';
import API_CALL from '../../../services';
import moment from 'moment';
import { labReport, wheatFlour } from './sample';
import FormField from '../../../components/form-field';

const Dashboard = () => {
	const [ loader, setLoader ] = useState(false),
		[ activeTab, setActiveTab ] = useState(1),
		[ detailLoader, setDetailLoader ] = useState(false),
		[ openModal, setOpenModal ] = useState({}),
		[ deatilModal, setDetailModal ] = useState(false),
		[ deatilModalTitle, setDetailModalTitle ] = useState(''),
		[ approvalList, setApprovalList ] = useState([]),
		[ report, setReport ] = useState([]),
		[ reportWheat, setReportWheat ] = useState([]),
		[ singleReport, setSingleReport ] = useState(''),
		[ selectedReport, setSelectedReport ] = useState({});

	const { summaryFilter } = useSelector(({ filterReducer }) => ({
			summaryFilter: filterReducer
		})),
		dispatch = useDispatch();

	return (
		<div className="container-fluid container-xl dashboard">
			<Header />
			<Suspense fallback={<Spinner />}>
				{/* <div className="justify-content-end"> */}
				<DateFilter />
			</Suspense>
		</div>
	);
};

export default Dashboard;
