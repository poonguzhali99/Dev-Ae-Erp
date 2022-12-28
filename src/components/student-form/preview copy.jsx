import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Col, Collapse, Divider, Empty, Image, List, Row, Spin, Tabs, Typography } from 'antd';
import _isEmpty from 'lodash/isEmpty';
import { useParams } from 'react-router';
import API_CALL from '../../services';
import { ArrowRightOutlined, CaretRightOutlined, DownloadOutlined } from '@ant-design/icons';
import './style.scss';

const StudentPreview = ({ info, loader }) => {
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
		StudentAddressDistrict,
		StudentAddressState,
		StudentAddressPinCode,
		AadhaarCardNumber,
		Nationality,
		Religion,
		SocialCategory,
		MotherTongue,
		ActivityGroup,
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
		<Row className="student-form">
			<Col span={8}>
				<Spin spinning={loader || documentLoader}>
					<Row className="justify-content-center my-2">
						{!_isEmpty(file) ? (
							<Avatar src={'data:image/png;base64,' + Photo} />
						) : (
							<Avatar>{StudentFirstName ? StudentFirstName[0] + StudentLastName[0] : 'NA'}</Avatar>
						)}
					</Row>
					<div className="student-card">
						<DetailsRow label="Status" value={StudentStatus} />
						<DetailsRow label="Application ID" value={CardCode} />
						<DetailsRow label="Student ID" value={StudentID} />
						<DetailsRow label="First Name" value={StudentFirstName} />
						<DetailsRow label="Last Name" value={StudentLastName} />
						<DetailsRow label="Class" value={AdmissionClass} />
						<DetailsRow label="Section" value={Section} />
						<DetailsRow label="Roll Number" value={RollNumber} />
						<DetailsRow label="School Branch" value={SchoolBranchCode} />
						<DetailsRow label="Second Language" value={SecondLanguage} />
						<DetailsRow label="Third Language" value={ThirdLanguage} />
						<DetailsRow label="Gender" value={Gender} />
						<DetailsRow label="Date of Birth" value={StudentDOB} />
						<DetailsRow label="Birth Place" value={BirthPlace} />
						<DetailsRow label="Address Line 1" value={StudentAddressLine1} />
						<DetailsRow label="Address Line 2" value={StudentAddressLine2} />
						<DetailsRow label="Location" value={StudentAddressLocation} />
						<DetailsRow label="District" value={StudentAddressDistrict} />
						<DetailsRow label="State" value={StudentAddressState} />
						<DetailsRow label="PIN Code" value={StudentAddressPinCode} />
						<DetailsRow label="Aadhaar Card Number" value={AadhaarCardNumber} />
						<DetailsRow label="Nationality" value={Nationality} />
						<DetailsRow label="Religion" value={Religion} />
						<DetailsRow label="Social Category" value={SocialCategory} />
						<DetailsRow label="Mother Tongue" value={MotherTongue} />
						<DetailsRow label="Activity Group" value={ActivityGroup} />
						<DetailsRow label="Admission Date" value={AdmissionDate} />
						<DetailsRow label="Admission Number" value={AdmissionNumber} />
						<DetailsRow label="Admission Class" value={PreviousSchoolClass} />
						<DetailsRow label="CBSE Regn. No." value={CBSEREGNumber} />
					</div>
				</Spin>
			</Col>
			<Col span={16}>
				<DetailsRow label="ONLINE CLASS LOGIN ID" value={onlineStudentid} />
				<Collapse
					className="mt-2"
					ghost
					accordion
					bordered
					defaultActiveKey={[ '1' ]}
					expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
					expandIconPosition={'end'}
					onChange={() => {}}
				>
					<Collapse.Panel header="Parent Details" key="1">
						<Tabs
							defaultActiveKey="1"
							// onChange={onChange}
							items={[
								{
									label: 'Father Details',
									key: '1',
									children: (
										<ParentDetails
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
									)
								},
								{
									label: 'Mother Details',
									key: '2',
									children: (
										<ParentDetails
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
									)
								},
								{
									label: 'Guardian Details',
									key: '3',
									children: (
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
									)
								}
							]}
						/>
					</Collapse.Panel>
					<Collapse.Panel header="Other Details" key="2">
						<DetailsRow label="Siblings Student ID1:" value={SiblingsStudentId1} />
						<DetailsRow label="Siblings Student ID2:" value={SiblingsStudentId2} />
						<DetailsRow label="Siblings Student ID3:" value={SiblingsStudentId3} />
						<DetailsRow label="Previous School Name" value={PreviousSchoolNameAndAddress} />
						<DetailsRow label="Previous School Class" value={PreviousSchoolClass} />
						<DetailsRow label="Previous School Address" value={PreviousSchoolAddress} />
						<DetailsRow label="Previous School Country" value={PreviousSchoolCountry} />
						<DetailsRow label="Previous School Pincode" value={PreviousSchoolPincode} />
					</Collapse.Panel>
					<Collapse.Panel header="Uploaded Documents" key="3">
						<List
							dataSource={documents || []}
							renderItem={(item) => (
								<List.Item className="d-flex justify-content-between">
									<Typography.Text className="ml-2">
										{item.Sid}. {item.Documents}{' '}
										<Typography.Text
											className={item.StatusName == 'Verified' ? 'text-success' : 'text-danger'}
										>
											({item.StatusName})
										</Typography.Text>
									</Typography.Text>
									<Button type="link" title={`Download ${item.Documents}`}>
										<DownloadOutlined />
									</Button>
								</List.Item>
							)}
						/>
					</Collapse.Panel>
					<Collapse.Panel header="Medical Form" key="4">
						<Tabs
							defaultActiveKey="1"
							// onChange={onChange}
							items={[
								{
									label: 'Medical Details',
									key: '1',
									children: (
										<div>
											<DetailsRow label="Blood Group" value={BloodGroup} />
											<DetailsRow
												label="Marks Of Identification 1"
												value={MarksofIdentification1}
											/>
											<DetailsRow
												label="Marks Of Identification 2"
												value={MarksofIdentification2}
											/>
										</div>
									)
								},
								{
									label: 'Health Care Details',
									key: '2',
									children: (
										<div>
											<DetailsRow label="Height In CM" value={Heightincms} />
											<DetailsRow label="Weight in Kilograms" value={Weightinkilograms} />
											<DetailsRow label="Vision LR" value={VisionLR} />
											<DetailsRow label="Dental Hygeine" value={DentalHygiene} />
										</div>
									)
								},
								{
									label: 'Parent Approved Medicine',
									key: '3',
									children: (
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
									)
								},
								{
									label: 'Allergies',
									key: '4',
									children: (
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
									)
								},
								{
									label: 'Medical Issues',
									key: '5',
									children: (
										<div>
											<DetailsRow label="Medical Issues" value={MedicalIssues} />
											<DetailsRow
												label="Specific Ailments If Any"
												value={SpecificAilmentsIfAny}
											/>
										</div>
									)
								}
							]}
						/>
					</Collapse.Panel>
				</Collapse>
			</Col>
		</Row>
	);
};

export default StudentPreview;

const DetailsRow = ({ label, value }) => (
	<div>
		<Row className="details-row">
			<Col className="text-info">{label}</Col>
			<Col className="text-muted">{value ? value : '---'}</Col>
		</Row>
		<Divider />
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
			<Row>
				<Col span={8} className="d-flex justify-content-center align-items-center">
					{/* <Avatar>{FirstName ? FirstName[0] + (LastName ? LastName[0] : '') : 'NA'}</Avatar> */}
					{!_isEmpty(Photo) ? (
						<Avatar src={'data:image/png;base64,' + Photo} />
					) : (
						<Avatar>{FirstName ? FirstName[0] + (LastName ? LastName[0] : '') : 'NA'}</Avatar>
					)}
				</Col>
				<Col span={16}>
					<DetailsRow label="First Name" value={FirstName} />
					<DetailsRow label="Last Name" value={LastName} />
					{type != 'Guardian' && <DetailsRow label="Occupation" value={Occupation} />}
					<DetailsRow label="Mobile Number" value={MobileNumber} />
					<DetailsRow label="Email Address" value={Email} />
					{type != 'Guardian' && <DetailsRow label="Organization" value={NameOfTheOrg} />}
					{type != 'Guardian' && <DetailsRow label="Designation" value={Designation} />}
					{type != 'Guardian' && <DetailsRow label="Aadhaar Card Number" value={AadhaarCardNumber} />}
					{type != 'Guardian' && <DetailsRow label="Annual Income in INR" value={AnnualIncome} />}
					{type == 'Guardian' && (
						<DetailsRow label="Relationship With Student" value={GuardianRelationshipWithStudent} />
					)}
				</Col>
			</Row>
		);
	else return <Empty />;
};
