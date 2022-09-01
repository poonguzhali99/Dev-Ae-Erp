import React from 'react';
import { Spinner } from 'reactstrap';
import LoadingOverlay from 'react-loading-overlay';

const Loader = ({ show, children, dark, type, size }) => (
	<LoadingOverlay
		active={show}
		styles={{
			overlay: (base) => {
				return {
					...base,
					background: '#fff'
				};
			}
		}}
		spinner={<Spinner size={size ? size : 'lg'} type={type ? type : 'grow'} color={dark ? 'primary' : 'light'} />}
	>
		{children}
	</LoadingOverlay>
);

export default Loader;
