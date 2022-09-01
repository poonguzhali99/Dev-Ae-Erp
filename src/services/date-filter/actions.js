import { FILTER_TYPES } from './action-types';

export const changeFilter = (payload) => {
	return {
		type: FILTER_TYPES.CHANGE,
		payload
	};
};
