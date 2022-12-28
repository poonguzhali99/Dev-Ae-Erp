import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Col, Collapse, Divider, Empty, Image, List, Row, Spin, Tabs, Typography } from 'antd';
import _isEmpty from 'lodash/isEmpty';
import { useParams } from 'react-router';
import API_CALL from '../../services';
import { ArrowRightOutlined, CaretRightOutlined, DownloadOutlined } from '@ant-design/icons';
import './style.scss';

const StudentPreview = ({ info, loader, closeModal }) => {
	const {
		StudentStatus,
		CardCode,
		StudentID,
		StudentFirstName,
		StudentLastName,
		file,
		AdmissionClass,

		Section,
		RollNumber,
		SchoolBranchCode,
		SecondLanguage,
		ThirdLanguage,
		Gender,
		StudentDOB,
		BirthPlace,
		StudentAddressLine1,
		StudentAddressLine2,
		StudentAddressLocation,
		StudentAddressCity,
		StudentAddressDistrict,
		StudentAddressState,
		StudentAddressCountry,
		StudentAddressPinCode,
		AadhaarCardNumber,
		Nationality,
		Religion,
		SocialCategory,
		MotherTongue,
		ActivityGroup,
		AdmissionYear,
		AdmissionDate,
		AdmissionNumber,
		PreviousSchoolClass,
		CBSEREGNumber,
		FatherFirstName,
		FatherLastName,
		FatherOccupation,
		FatherMobileNumber,
		FatherEmail,
		FatherNameOfTheOrg,
		FatherDesignation,
		FatherAadhaarCardNumber,
		FatherAnnualIncome,
		file1,
		MotherFirstName,
		MotherLastName,
		MotherOccupation,
		MotherMobileNumber,
		MotherEmail,
		MotherNameOfTheOrg,
		MotherDesignation,
		MotherAadhaarCardNumber,
		MotherAnnualIncome,
		file2,
		GuardianFirstName,
		GuardianLastName,
		GuardianMobileNumber,
		GuardianEmail,
		GuardianRelationshipWithStudent,
		file3,
		onlineStudentid,
		BloodGroup,
		MarksofIdentification1,
		MarksofIdentification2,
		Heightincms,
		Weightinkilograms,
		VisionLR,
		DentalHygiene,
		MedicalIssues,
		SpecificAilmentsIfAny,
		SiblingsStudentId1,
		SiblingsStudentId2,
		SiblingsStudentId3,
		PreviousSchoolNameAndAddress,
		PreviousSchoolAddress,
		PreviousSchoolCountry,
		PreviousSchoolPincode
	} = info;
	const [ documentLoader, setDocumentLoader ] = useState(false);
	const [ documents, setDocuments ] = useState([]);
	useEffect(
		() => {
			if (!_isEmpty(info)) {
				setDocumentLoader(true);
				API_CALL({
					method: 'get',
					url: 'Registration/GetUploadDocuments',
					params: {
						CardCode: info.CardCode,
						stage: '8'
					},
					callback: async ({ status, data }) => {
						setDocumentLoader(false);
						if (status == 200) setDocuments(data);
						else setDocuments([]);
					}
				});
			}
		},
		[ info ]
	);
	return (
		<Spin spinning={loader}>
			<Tabs
				defaultActiveKey="1"
				className="student-form"
				items={[
					{
						label: `Student Details`,
						key: '1',
						children: (
							<div>
								<Row>
									<Col xs={24} sm={12} md={5} lg={5} xl={5} className="d-flex justify-content-center">
										{!_isEmpty(file) ? (
											<Avatar shape="square" src={'data:image/png;base64,' + file} />
										) : (
											<Avatar shape="square">
												{StudentFirstName ? StudentFirstName[0] + StudentLastName[0] : 'NA'}
											</Avatar>
										)}
									</Col>
									<Col xs={24} sm={12} md={19} lg={19} xl={19} className="align-self-center">
										<Row>
											<Col span={6}>
												<DetailsRow label="Student ID" value={StudentID} />
											</Col>
											<Col span={6}>
												<DetailsRow label="First Name" value={StudentFirstName} />
											</Col>
											<Col span={6}>
												<DetailsRow label="Last Name" value={StudentLastName} />
											</Col>
											<Col span={6}>
												<DetailsRow label="Status" value={StudentStatus} />
											</Col>
										</Row>
										<Row>
											<Col span={4}>
												<DetailsRow label="Blood Group" value={BloodGroup} />
											</Col>
											<Col span={4}>
												<DetailsRow label="Roll No" value={RollNumber} />
											</Col>
											<Col span={4}>
												<DetailsRow label="Gender" value={Gender} />
											</Col>
											<Col span={12}>
												<DetailsRow label="Student Login ID" value={onlineStudentid} />
											</Col>
										</Row>

										<Row>
											<Col span={12}>
												<DetailsRow
													label="Marks Of Identification 1"
													value={MarksofIdentification1}
												/>
											</Col>
											<Col span={12}>
												<DetailsRow
													label="Marks Of Identification 2"
													value={MarksofIdentification2}
												/>
											</Col>
										</Row>
									</Col>
								</Row>
								<Row>
									<Col span={5} className="align-self-center">
										<DetailsRow label="Class" value={AdmissionClass} />
									</Col>
									<Col span={19} className="align-self-center">
										<Row>
											<Col span={6}>
												<DetailsRow label="Section" value={Section} />
											</Col>
											<Col span={6}>
												<DetailsRow label="Second Language" value={SecondLanguage} />
											</Col>
											<Col span={6}>
												<DetailsRow label="Third Language" value={ThirdLanguage} />
											</Col>
											<Col span={6}>
												<DetailsRow label="Activity Group" value={ActivityGroup} />
											</Col>
										</Row>
									</Col>
								</Row>
								<Row>
									<Col span={5} className="align-self-center">
										<DetailsRow label="Date of Birth" value={StudentDOB} />
									</Col>
									<Col span={19} className="align-self-center">
										<Row>
											<Col span={8}>
												<DetailsRow label="Birth Place" value={BirthPlace} />
											</Col>

											<Col span={8}>
												<DetailsRow label="Aadhaar Card No" value={AadhaarCardNumber} />
											</Col>
											<Col span={8}>
												<DetailsRow label="Primary Contact No" value={ActivityGroup} />
											</Col>
										</Row>
									</Col>
								</Row>
								<Row>
									<Col span={5} className="align-self-center">
										<DetailsRow label="Location" value={StudentAddressLocation} />
									</Col>
									<Col span={19} className="align-self-center">
										<Row>
											<Col span={8}>
												<DetailsRow label="Address Line 1" value={StudentAddressLine1} />
											</Col>
											<Col span={8}>
												<DetailsRow label="Address Line 2" value={StudentAddressLine2} />
											</Col>
											<Col span={8}>
												<DetailsRow label="City" value={StudentAddressCity} />
											</Col>
										</Row>
									</Col>
								</Row>
								<Row>
									<Col span={5} className="align-self-center">
										<DetailsRow label="PIN Code" value={StudentAddressPinCode} />
									</Col>
									<Col span={19} className="align-self-center">
										<Row>
											<Col span={8}>
												<DetailsRow label="District" value={StudentAddressDistrict} />
											</Col>
											<Col span={8}>
												<DetailsRow label="State" value={StudentAddressState} />
											</Col>
											<Col span={8}>
												<DetailsRow label="Country" value={StudentAddressCountry} />
											</Col>
										</Row>
									</Col>
								</Row>
								<Row>
									<Col span={5} className="align-self-center">
										<DetailsRow label="Mother Tongue" value={MotherTongue} />
									</Col>
									<Col span={19} className="align-self-center">
										<Row>
											<Col span={8}>
												<DetailsRow label="Social Category" value={SocialCategory} />
											</Col>
											<Col span={8}>
												<DetailsRow label="Religion" value={Religion} />
											</Col>
											<Col span={8}>
												<DetailsRow label="Nationality" value={Nationality} />
											</Col>
										</Row>
									</Col>
								</Row>
								<Row>
									<Col span={5} className="align-self-center">
										<DetailsRow label="Admission Year" value={AdmissionYear} />
									</Col>
									<Col span={19} className="align-self-center">
										<Row>
											<Col span={8}>
												<DetailsRow label="Admission Date" value={AdmissionDate} />
											</Col>
											<Col span={8}>
												<DetailsRow label="Admission Class" value={PreviousSchoolClass} />
											</Col>
											<Col span={8}>
												<DetailsRow label="Admission No" value={AdmissionNumber} />
											</Col>
										</Row>
									</Col>
								</Row>
								<Row>
									<Col span={5} className="align-self-center">
										<DetailsRow label="CBSE Regn. No." value={CBSEREGNumber} />
									</Col>
									<Col span={19} className="align-self-center">
										<Row>
											<Col span={8}>
												<DetailsRow label="InActive Date" value={AdmissionDate} />
											</Col>
											<Col span={8}>
												<DetailsRow label="Siblings ID1:" value={SiblingsStudentId1} />
											</Col>
											<Col span={8}>
												<DetailsRow label="Siblings ID2:" value={SiblingsStudentId2} />
											</Col>
										</Row>
									</Col>
								</Row>
								<Row>
									<Col span={5} className="align-self-center">
										<DetailsRow label="Previous School Class" value={PreviousSchoolClass} />
									</Col>
									<Col span={19} className="align-self-center">
										<Row>
											<Col span={8}>
												<DetailsRow
													label="Previous School Name"
													value={PreviousSchoolNameAndAddress}
												/>
											</Col>
											<Col span={8}>
												<DetailsRow
													label="Previous School Address"
													value={PreviousSchoolAddress}
												/>
											</Col>
											<Col span={8}>
												<DetailsRow
													label="Previous School Pincode"
													value={PreviousSchoolPincode}
												/>
											</Col>
										</Row>
									</Col>
								</Row>
							</div>
						)
					},
					{
						label: `Parent Details`,
						key: '2',
						children: (
							<div>
								<ParentDetails
									type="Father"
									FirstName={FatherFirstName}
									LastName={FatherLastName}
									Occupation={FatherOccupation}
									MobileNumber={FatherMobileNumber}
									Email={FatherEmail}
									NameOfTheOrg={FatherNameOfTheOrg}
									Designation={FatherDesignation}
									AadhaarCardNumber={FatherAadhaarCardNumber}
									AnnualIncome={FatherAnnualIncome}
									Photo={file1}
								/>
								<ParentDetails
									type="Mother"
									FirstName={MotherFirstName}
									LastName={MotherLastName}
									Occupation={MotherOccupation}
									MobileNumber={MotherMobileNumber}
									Email={MotherEmail}
									NameOfTheOrg={MotherNameOfTheOrg}
									Designation={MotherDesignation}
									AadhaarCardNumber={MotherAadhaarCardNumber}
									AnnualIncome={MotherAnnualIncome}
									Photo={file2}
								/>
								{GuardianFirstName && (
									<ParentDetails
										type="Guardian"
										FirstName={GuardianFirstName}
										LastName={GuardianLastName}
										Occupation={FatherOccupation}
										MobileNumber={GuardianMobileNumber}
										Email={GuardianEmail}
										GuardianRelationshipWithStudent={GuardianRelationshipWithStudent}
										NameOfTheOrg={FatherNameOfTheOrg}
										Designation={FatherDesignation}
										AadhaarCardNumber={FatherAadhaarCardNumber}
										AnnualIncome={FatherAnnualIncome}
										Photo={file3}
									/>
								)}
							</div>
						)
					},
					{
						label: `Medical Details`,
						key: '3',
						children: (
							<Collapse accordion defaultActiveKey={[ '1' ]}>
								<Collapse.Panel header="Upload Documents" key="1">
									<List
										dataSource={documents || []}
										renderItem={(item) => (
											<List.Item className="d-flex justify-content-between">
												<Typography.Text className="ml-2">
													{item.Sid}. {item.Documents}{' '}
													<Typography.Text
														className={
															item.StatusName == 'Verified' ? (
																'text-success'
															) : (
																'text-danger'
															)
														}
													>
														({item.StatusName})
													</Typography.Text>
												</Typography.Text>
												{item.StatusName == 'Verified' && (
													<Button
														onClick={() => {
															setDocumentLoader(true);
															API_CALL({
																method: 'get',
																url: 'StudentManagement/DownloadpdfForStudent',
																params: {
																	fileName: item.filename
																},
																callback: async ({ status, data }) => {
																	setDocumentLoader(false);
																	// if (status == 200) setDocuments(data);
																	// else setDocuments([]);
																}
															});
														}}
														type="link"
														title={`Download ${item.Documents}`}
													>
														<DownloadOutlined />
													</Button>
												)}
											</List.Item>
										)}
									/>
								</Collapse.Panel>
								<Collapse.Panel header="Health Care Details" key="2">
									<Row>
										<Col span={8}>
											<DetailsRow label="Height In CM" value={Heightincms} />
										</Col>
										<Col span={8}>
											<DetailsRow label="Weight in Kilograms" value={Weightinkilograms} />
										</Col>

										<Col span={8}>
											<DetailsRow label="Vision LR" value={VisionLR} />
										</Col>

										<Col span={8}>
											<DetailsRow label="Dental Hygeine" value={DentalHygiene} />
										</Col>
									</Row>
								</Collapse.Panel>
								<Collapse.Panel header="Parent Approved Medicine" key="3">
									<List
										// bordered
										dataSource={info.ParentApprovedMedicines || []}
										renderItem={(item) => (
											<List.Item className="d-flex justify-content-start">
												<ArrowRightOutlined />
												<Typography.Text className="ml-2">
													{item.parentmedicine}
												</Typography.Text>
											</List.Item>
										)}
									/>
								</Collapse.Panel>
								<Collapse.Panel header="Allergies" key="4">
									<List
										// bordered
										dataSource={info.allergies || []}
										renderItem={(item) => (
											<List.Item className="d-flex justify-content-start">
												<ArrowRightOutlined />
												<Typography.Text className="ml-2">
													{item.parentmedicine}
												</Typography.Text>
											</List.Item>
										)}
									/>
								</Collapse.Panel>
								<Collapse.Panel header="Medical Issues" key="5">
									<Row>
										<Col span={12}>
											<DetailsRow label="Medical Issues" value={MedicalIssues} />
										</Col>
										<Col span={12}>
											<DetailsRow
												label="Specific Ailments If Any"
												value={SpecificAilmentsIfAny}
											/>
										</Col>
									</Row>
								</Collapse.Panel>
							</Collapse>
						)
					}
				]}
			/>
		</Spin>
	);
};

export default StudentPreview;

const DetailsRow = ({ label, value }) => (
	<div>
		<Row className="details-row">
			<Col xs={24} sm={24} md={10} lg={10} xl={10} className="text-additional label-text text-truncate">
				{label}:{' '}
			</Col>
			<Col xs={24} sm={24} md={14} lg={14} xl={14} className="text-muted text-truncate">
				{value ? value : '---'}
			</Col>
		</Row>
		{/* <Divider /> */}
	</div>
);

const ParentDetails = ({
	type,
	FirstName,
	LastName,
	Occupation,
	MobileNumber,
	Email,
	NameOfTheOrg,
	Designation,
	AadhaarCardNumber,
	AnnualIncome,
	GuardianRelationshipWithStudent,
	Photo
}) => {
	if (!_isEmpty(FirstName))
		return (
			<Card title={type + ` Details`} className="mb-3">
				<Row>
					<Col span={5} className="d-flex justify-content-center align-items-center">
						{/* <Avatar>{FirstName ? FirstName[0] + (LastName ? LastName[0] : '') : 'NA'}</Avatar> */}
						{!_isEmpty(Photo) ? (
							<Avatar src={'data:image/png;base64,' + Photo} />
						) : (
							<Avatar>{FirstName ? FirstName[0] + (LastName ? LastName[0] : '') : 'NA'}</Avatar>
						)}
					</Col>
					<Col span={19} className="align-self-center">
						<Row>
							<Col span={8}>
								<DetailsRow label="First Name" value={FirstName} />
							</Col>
							<Col span={8}>
								<DetailsRow label="Last Name" value={LastName} />
							</Col>

							{type != 'Guardian' && (
								<Col span={8}>
									<DetailsRow label="Occupation" value={Occupation} />
								</Col>
							)}
							<Col span={8}>
								<DetailsRow label="Mobile Number" value={MobileNumber} />
							</Col>
							<Col span={8}>
								<DetailsRow label="Email Address" value={Email} />
							</Col>

							{type != 'Guardian' && (
								<Col span={8}>
									<DetailsRow label="Organization" value={NameOfTheOrg} />
								</Col>
							)}
							{type != 'Guardian' && (
								<Col span={8}>
									<DetailsRow label="Designation" value={Designation} />
								</Col>
							)}
							{type != 'Guardian' && (
								<Col span={8}>
									<DetailsRow label="Aadhaar Card Number" value={AadhaarCardNumber} />
								</Col>
							)}
							{type != 'Guardian' && (
								<Col span={8}>
									<DetailsRow label="Annual Income in INR" value={AnnualIncome} />
								</Col>
							)}
							{type == 'Guardian' && (
								<DetailsRow label="Relationship With Student" value={GuardianRelationshipWithStudent} />
							)}
						</Row>
					</Col>
				</Row>
			</Card>
		);
	else return <Empty />;
};
