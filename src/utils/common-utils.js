// import { loginRequest } from '../../AuthConfig';
// import { msalInstance } from '../../main';
import { Store as notification } from 'react-notifications-component';
import _isEmpty from 'lodash/isEmpty';

let options = {
	title: '',
	message: '',
	type: 'default',
	insert: 'top',
	container: 'top-right',
	animationIn: [ 'animated', 'fadeIn' ],
	animationOut: [ 'animated', 'fadeOut' ],
	dismiss: {
		showIcon: true,
		duration: 3000,
		pauseOnHover: true
	}
};

export const Toast = {
	add: (props) => notification.addNotification({ ...options, ...props }),
	remove: (id) => notification.removeNotification(id)
};

export const getColorCode = (status) => {
	switch (status) {
		case 'Prospective Rs':
			return 'text-blue';
		case 'Risk Categoy':
			return 'text-red';
		case 'Ed Visit Risk':
			return 'text-dark-blue';
		case 'Inpt Admit Risk':
			return 'text-orange';
		default:
			return 'text-muted';
	}
};

export const createAPIActionTypes = (prefix) =>
	[ 'REQ', 'RES', 'FAIL' ].reduce((acc, type) => ({ ...acc, [type]: `${prefix}_API_${type}` }), {});

export const createAccessorsActionTypes = (prefix) =>
	[ 'GET', 'SET' ].reduce((acc, type) => ({ ...acc, [type]: `${prefix}_API_${type}` }), {});

export const getGenderDescription = (genderCode) => {
	return genderCode && genderCode.toLowerCase() === 'f' ? 'Female' : 'Male';
};

export const getUserDetails = async () => {
	const accounts = msalInstance.getAllAccounts();
	const { name = '', username = '' } = accounts && accounts.length > 0 && accounts[0];

	return {
		name,
		username
	};
};

// export const getAccessToken = async () => {
// 	const accounts = msalInstance.getAllAccounts();
// 	const account = accounts && accounts.length > 0 && accounts[0];

// 	const resp = await msalInstance.acquireTokenSilent({
// 		...loginRequest,
// 		account
// 	});
// 	return resp;
// };

export const showUnAuthorizedAccessMsg = () => {
	Toast.add({
		type: 'danger',
		message: 'UnAurthorized',
		dismiss: {
			showIcon: true,
			duration: 6000,
			pauseOnHover: true
		}
	});
};
