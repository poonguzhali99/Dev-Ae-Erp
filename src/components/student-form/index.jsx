import React, { useEffect, useState } from 'react';
import { Button, Card, Tabs } from 'antd';
import { useParams } from 'react-router';
import API_CALL from '../../services';
import StudentPreview from './preview';
import UpdateParent from './update-parent';
import UpdateStudent from './update-student';
import UpdateOthers from './update-others';
import UpdateMedical from './update-medical';

const StudentForm = ({ studentId, type, closeModal }) => {
	const [ studentInfo, setStudentInfo ] = useState({});
	const [ loader, setLoader ] = useState(false);

	useEffect(
		() => {
			setLoader(true);
			API_CALL({
				method: 'get',
				url: 'Registration/GetPreviewById',
				params: {
					id: studentId
				},
				callback: async ({ status, data }) => {
					setLoader(false);
					if (status == 200) setStudentInfo(data);
					else setStudentInfo({});
				}
			});
		},
		[ studentId ]
	);

	return (
		<Tabs
			defaultActiveKey="2"
			// onChange={onChange}
			type="card"
			// activeKey={type == 'preview' ? '1' : null}
			items={[
				{
					label: `PREVIEW DETAILS`,
					key: '1',
					children: <StudentPreview info={studentInfo} loader={loader} closeModal={closeModal} />
				},

				{
					label: `UPDATE STUDENT DETAILS`,
					key: '2',
					disabled: type != 'update',
					children: <UpdateStudent info={studentInfo} loader={loader} closeModal={closeModal} />
				},
				{
					label: `UPDATE PARENT DETAILS`,
					key: '3',
					disabled: type != 'update',
					children: <UpdateParent info={studentInfo} loader={loader} closeModal={closeModal} />
				},
				{
					label: `UPDATE OTHER DETAILS`,
					key: '4',
					disabled: type != 'update',
					children: <UpdateOthers info={studentInfo} loader={loader} closeModal={closeModal} />
				},
				{
					label: `UPDATE MEDICAL DETAILS`,
					key: '5',
					disabled: type != 'update',
					children: <UpdateMedical info={studentInfo} loader={loader} closeModal={closeModal} />
				}
			].filter((item) => item.label.toLocaleLowerCase().includes(type))}
		/>
	);
};

export default StudentForm;
