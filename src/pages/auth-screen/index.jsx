import React, { useEffect } from 'react';
import Spinner from '../../components/spinner';
import { useMsal } from '@azure/msal-react';
// import { loginRequest } from '../../../AuthConfig';

import { useIsAuthenticated } from '@azure/msal-react';
const AuthScreen = () => {
	const isAuthenticated = useIsAuthenticated();
	const { instance } = useMsal();

	useEffect(() => {
		if (!isAuthenticated) {
			// instance.loginRedirect(loginRequest).then((data) => {}).catch((e) => {
			// 	console.log(e);
			// });
		}
	}, []);
	return (
		<div className="container-fluid container-xl dashboard">
			<Spinner />
		</div>
	);
};

export default AuthScreen;
