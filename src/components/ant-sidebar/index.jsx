import React from 'react';

import { useNavigate } from 'react-router';
import _isEmpty from 'lodash/isEmpty';
import { Layout, Collapse, List, Button } from 'antd';
const { Sider } = Layout;
import './style.scss';

const AntSidebar = ({ Children }) => {
	const navigate = useNavigate();
	return (
		<Sider width="300px">
			{Children}
			{/* <Collapse accordion className="ant-menu">
				{menuList.map((menu, index) => {
					return (
						<Collapse.Panel className="menu-title" header={menu.MenuAuthorization} key={index}>
							{menu.SubMenuAuthorization == true ? (
								<List
									dataSource={menu.SubMenuDetails}
									renderItem={(item) => (
										<Button type="text" size="large" block onClick={() => navigate(item.path)}>
											{item.MenuAuthorization}
										</Button>
									)}
								/>
							) : (
								<div>{menu.MenuAuthorization}</div>
							)}
						</Collapse.Panel>
					);
				})}
			</Collapse> */}
		</Sider>
	);
};

export default AntSidebar;

export const menuList = [
	{
		MenuAuthorization: 'Admissions',
		SubMenuAuthorization: true,
		SubMenuDetails: [
			{
				MenuAuthorization: 'Admissions Planning View',
				path: '/'
			},
			{
				MenuAuthorization: 'Consolidated Statges Report',
				path: '/'
			},
			{
				MenuAuthorization: 'Detailed Statges Report',
				path: '/'
			},
			{
				MenuAuthorization: 'Application Verification',
				path: '/'
			},
			{
				MenuAuthorization: 'Admissions Setup',
				path: '/'
			},
			{
				MenuAuthorization: 'Admissions Count',
				path: '/'
			}
		]
	},

	{
		MenuAuthorization: 'Assessments',
		SubMenuAuthorization: true,
		SubMenuDetails: [
			{
				MenuAuthorization: 'Teacher Mark Entry',
				path: '/AssesmentMarksEntry'
			},
			{
				MenuAuthorization: 'Mark Entry Status',
				path: '/AssesmentMarksEntry'
			},
			{
				MenuAuthorization: 'Report Card',
				path: '/'
			}
		]
	}
];
