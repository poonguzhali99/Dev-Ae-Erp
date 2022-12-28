import React, { useEffect, useState } from 'react';
import { Card, Spin, Button, Table, Layout, Form, Empty, Space, DatePicker, Row, notification } from 'antd';
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

const AdmissionSetup = () => {
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
		[ column, setColumn ] = useState([]);

	const [ selectedRowKeys, setSelectedRowKeys ] = useState([]);
	const [ activeRows, setActiveRows ] = useState([]);

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
						width: 145,
						align: 'center',
						render: (_, text) => {
							if (key == 'AdmissionsCloseDate')
								return (
									<Form.Item className="p-1" name={key + text.key}>
										<DatePicker
											name={key + text.key}
											defaultValue={moment(text.AdmissionsCloseDate, 'DD/MM/YYYY')}
											disabled={!isEditing(text)}
											format="DD-MMM-YYYY"
											onChange={(value) => {
												try {
													const newData = [ ...activeRows ];
													const i = newData.findIndex((item) => text.key === item['key']);
													let selectedObj = newData[i];
													selectedObj[key] = moment(value).format('DD/MM/YYYY');
													newData[i] = selectedObj;
													setActiveRows(newData);
												} catch (errInfo) {
													notification.error({
														message: 'Invalid Row Selection',
														description: 'Select the correct row to update the date'
													});
												}
											}}
										/>
									</Form.Item>
								);
							else return <a className="p-1">{text[key]}</a>;
						}
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

	const rowSelection = {
		selectedRowKeys,
		onChange: (newSelectedRowKeys, selectedRows) => {
			setActiveRows(selectedRows);
			setSelectedRowKeys(newSelectedRowKeys);
		},
		selections: [ Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE ]
	};
	const isEditing = (record) => {
		return selectedRowKeys.includes(record.key);
	};
	const submitTable = () => {
		let AdmissionsDetails = activeRows.map(({ Class, SecondLanguage, ThirdLanguage, AdmissionsCloseDate }) => {
			return {
				Class,
				SecondLanguage,
				ThirdLanguage,
				EndDate: AdmissionsCloseDate
			};
		});
		let payload = {
			AcademicYear: activeAcademicYear,
			BranchCode: activeBranch.id,
			AdmissionsDetails,
			Source: 'Web',
			UpdatedBy: userToken
		};
		setLoader(true);
		API_CALL({
			method: 'post',
			url: 'Assessment/UpdateAdmissionsEndDate',
			data: payload,
			callback: async ({ status, data }) => {
				if (status == 200) {
					if (data.SuccessCode != '') {
						notification.success({
							message: 'Data Saved',
							description: data.Result
						});
					}
				}
				setLoader(false);
			}
		});
	};
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
										class: ''
									}}
									validate={(values) => {
										let errors = {};
										if (!values.class) errors.class = 'Required';
										return errors;
									}}
									onSubmit={(values) => {
										setReport([]);
										setSearchLoader(true);
										API_CALL({
											method: 'post',
											url: 'Adminsetup/GetAdmissionSetupList',
											data: {
												AdminClass: values.class,
												AdminBranch: activeBranch.id,
												AdminAdmyear: activeAcademicYear
											},
											callback: async ({ status, data }) => {
												setSearchLoader(false);
												if (status === 200) {
													data.map((da, index) => (da.key = index));
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
					<Card title={<div>New Admission Setup</div>}>
						{!_isEmpty(report) ? (
							<Form form={form}>
								<Table
									bordered
									rowSelection={rowSelection}
									columns={columns}
									dataSource={report}
									rowKey="key"
									scroll={{ y: 500, x: 'fit-content' }}
								/>
								{!_isEmpty(selectedRowKeys) && (
									<Row justify="end" className="mt-3">
										<Button type="primary" onClick={submitTable}>
											Submit
										</Button>
									</Row>
								)}
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

export default AdmissionSetup;
