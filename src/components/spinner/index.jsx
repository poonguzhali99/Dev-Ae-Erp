import React from 'react';
import './style.scss';

const Spinner = ({ show }) => {
	return (
		<div className="position-fixed top-50 end-50">
			<div className="la-line-scale-pulse-out-rapid">
				<div />
				<div />
				<div />
				<div />
				<div />
			</div>
		</div>
	);
};

export default Spinner;
