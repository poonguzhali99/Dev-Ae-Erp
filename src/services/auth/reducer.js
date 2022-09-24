import { load } from 'react-cookies';
import * as types from './action-types';

export const authReducer = (
	state = {
		isLoggedIn: false,
		userToken: null
	},
	{ type }
) => {
	switch (type) {
		case types.LOG_IN:
			return {
				...state,
				isLoggedIn: true,
				userToken: load('session')
			};
		case types.LOG_OUT:
			return {
				...state,
				isLoggedIn: false,
				userToken: null
			};
		default:
			return state;
	}
};
