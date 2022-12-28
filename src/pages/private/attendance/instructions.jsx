import React from 'react';
import { Card, Layout, Typography } from 'antd';
import './style.scss';

const AttendanceInstructions = () => {
	return (
		<Layout className="container-fluid  attendance d-flex">
			<Card title="Attendance Module Instructions">
				<Typography.Paragraph strong>
					<ul>
						<li>
							<Typography.Link>
								Ensure that current Academic year is selected for marking attendance.
							</Typography.Link>
						</li>
						<li>
							<Typography.Link>
								Attendance can be marked for current day – 2 days only (e.g. : if current date is 3rd
								Aug, attendance is allowed for marking only for 1st and 2nd Aug. Hence changes to
								marking is available only for these days/dates.
							</Typography.Link>
						</li>
						<li>
							<Typography.Link>
								For any additional corrections, approval from VP/PPL is mandatory.
							</Typography.Link>
						</li>
						<li>
							<Typography.Link>
								Attendance marking option is available for class teachers and mother teacher roles only.
							</Typography.Link>
						</li>
						<li>
							<Typography.Link>
								Attendance Report is accessible to all the teachers and other roles.
							</Typography.Link>
						</li>
						<li>
							<Typography.Link>
								Select month and week filters at header level to fetch the details for marking
								attendance.
							</Typography.Link>
						</li>
						<li>
							<Typography.Link>
								Select the date for mass attendance marking and make changes for any student on
								leave/absent.
							</Typography.Link>
						</li>
						<li>
							<Typography.Link>
								Click on “Save” button after marking attendance for saving the details.
							</Typography.Link>
						</li>
						<li>
							<Typography.Link>
								For any issues, raise a ticket using ticket management module.
							</Typography.Link>
						</li>
					</ul>
				</Typography.Paragraph>
			</Card>
		</Layout>
	);
};

export default AttendanceInstructions;
