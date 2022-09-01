import * as types from './action-types';

export const authReducer = (
	state = {
		isLoggedIn: false
	},
	{ type }
) => {
	switch (type) {
		case types.LOG_IN:
			return {
				...state,
				isLoggedIn: true
			};
		case types.LOG_OUT:
			return {
				...state,
				isLoggedIn: false
			};
		default:
			return state;
	}
};
