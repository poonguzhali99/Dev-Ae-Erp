import { USER_DETAILS, USER_PROFILE_DETAILS } from './action-types';
import API_CALL from '../../services';

export const getUserDetails = (payload) => {
	return {
		type: USER_DETAILS.SET_USER_DETAILS,
		payload
	};
};
