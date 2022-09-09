import React from 'react';
import _isEmpty from 'lodash/isEmpty';
import { Layout, Collapse, List, Button } from 'antd';
const { Sider } = Layout;
import './style.scss';

const AntSidebar = () => {
	return (
		<Sider>
			<Collapse accordion className="ant-menu">
				{menuList.map((menu, index) => {
					return (
						<Collapse.Panel className="menu-title" header={menu.MenuAuthorization} key={index}>
							{menu.SubMenuAuthorization == true ? (
								<List
									dataSource={menu.SubMenuDetails}
									renderItem={(item) => (
										<Button type="text" size="large" block>
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
			</Collapse>
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
				MenuAuthorization: 'Admissions Planning View'
			},
			{
				MenuAuthorization: 'Consolidated Statges Report'
			},
			{
				MenuAuthorization: 'Detailed Statges Report'
			},
			{
				MenuAuthorization: 'Application Verification'
			},
			{
				MenuAuthorization: 'Admissions Setup'
			},
			{
				MenuAuthorization: 'Admissions Count'
			}
		]
	},

	{
		MenuAuthorization: 'Assessments',
		SubMenuAuthorization: true,
		SubMenuDetails: [
			{
				MenuAuthorization: 'Teacher Mark Entry'
			},
			{
				MenuAuthorization: 'Mark Entry Status'
			},
			{
				MenuAuthorization: 'Report Card'
			}
		]
	},
	{
		MenuAuthorization: 'Admissions',
		SubMenuAuthorization: true,
		SubMenuDetails: [
			{
				MenuAuthorization: 'Admissions Planning View'
			},
			{
				MenuAuthorization: 'Consolidated Statges Report'
			},
			{
				MenuAuthorization: 'Detailed Statges Report'
			},
			{
				MenuAuthorization: 'Application Verification'
			},
			{
				MenuAuthorization: 'Admissions Setup'
			},
			{
				MenuAuthorization: 'Admissions Count'
			}
		]
	},

	{
		MenuAuthorization: 'Assessments',
		SubMenuAuthorization: true,
		SubMenuDetails: [
			{
				MenuAuthorization: 'Teacher Mark Entry'
			},
			{
				MenuAuthorization: 'Mark Entry Status'
			},
			{
				MenuAuthorization: 'Report Card'
			}
		]
	}
];
