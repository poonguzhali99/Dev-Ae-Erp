import React from 'react';
import { Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Empty = ({ description }) => {
	return (
		<div className="justify-content-center align-items-center animated fadeIn">
			<Col className="text-center text-muted p-4">
				<FontAwesomeIcon icon={[ 'fas', 'inbox' ]} size={'2x'} style={{ color: '#dce0e6' }} /> <br />
				<span style={{ color: '#b4b9be' }}>{description ? description : 'No Data'}</span>
			</Col>
		</div>
	);
};

export default Empty;
