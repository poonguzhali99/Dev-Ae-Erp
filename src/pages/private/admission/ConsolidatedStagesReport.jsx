import React, { useEffect, useState } from 'react';
import { Card, Spin, Button, Table, Layout, Form, Empty, Space, Row } from 'antd';
import { Formik } from 'formik';
import { Excel } from 'antd-table-saveas-excel';

import './style.scss';
import { useNavigate } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import FormField from '../../../components/form-field';
import API_CALL from '../../../services';
import { getAcademicYear, setActiveAcademicYear } from '../../../services/academic-details/action';
import { useRef } from 'react';
import AntSidebar from '../../../components/ant-sidebar';

const ConsolidatedStagesReport = () => {
	const {
		authReducer: { userToken },
		academicYearList,
		activeAcademicYear,
		branchList,
		activeBranch,
		classListLoader,
		sectionListLoader
	} = useSelector(({ authReducer, academicYearReducer, branchReducer, classReducer, sectionReducer }) => {
		return {
			authReducer,
			academicYearList: academicYearReducer.response.availableAcademicYear,
			activeAcademicYear: academicYearReducer.response.activeAcademicYear,
			branchList: branchReducer.response.availableBranch,
			activeBranch: branchReducer.response.activeBranch,
			classListLoader: classReducer.requesting,
			sectionListLoader: sectionReducer.requesting
		};
	});

	const navigate = useNavigate(),
		dispatch = useDispatch();
	const [ loader, setLoader ] = useState(false),
		[ searchLoader, setSearchLoader ] = useState(false),
		[ report, setReport ] = useState([]),
		[ column, setColumn ] = useState([]);

	const [ form ] = Form.useForm();

	const serachFormikRef = useRef();

	useEffect(() => {
		if (!_isEmpty(report)) {
			let tempColumn = [];

			Object.entries(report[0]).forEach(([ key, value ], index) => {
				if (index != Object.entries(report[0]).length - 1) {
					tempColumn.push({
						title: key == 'StageName' ? key.replace(/([A-Z])/g, ' $1').trim() : key,
						dataIndex: key,
						width: key == 'StageName' ? 180 : 100,
						align: 'center',
						fixed: key == 'StageName' ? 'left' : '',
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

	useEffect(() => {
		dispatch(getAcademicYear());
	}, []);

	const columns = column;

	const exportToExcel = () => {
		const excel = new Excel();
		excel
			.addSheet('Consolidated Stages Report')
			.addColumns(
				columns.map((col) => {
					delete col.render;
					return col;
				})
			)
			.addDataSource(report, { str2num: false })
			.saveAs('Consolidated Stages Report.xlsx');
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
										branch: activeBranch.id
									}}
									validate={(values) => {
										let errors = {};

										return errors;
									}}
									onSubmit={(values) => {
										setReport([]);
										setSearchLoader(true);
										API_CALL({
											method: 'get',
											url: 'Master/GetAdmissionSetupList',
											params: { Branch: activeBranch.id, Year: activeAcademicYear },
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
					<Card title={<div>Consolidated Stages Report</div>}>
						{!_isEmpty(report) ? (
							<Form form={form}>
								<Table
									bordered
									columns={columns}
									dataSource={report}
									rowKey="StageName"
									scroll={{ y: 430, x: 'fit-content' }}
								/>
								<Row justify="end" className="mt-3">
									<Button type="primary" onClick={exportToExcel}>
										Export
									</Button>
								</Row>
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

export default ConsolidatedStagesReport;
