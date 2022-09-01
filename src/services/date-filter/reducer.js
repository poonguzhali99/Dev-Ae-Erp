import moment from 'moment';
import { FILTER_TYPES } from './action-types';

export const filterReducer = (
	state = { date: moment().format('MM/DD/YYYY'), offset: moment().format('Z') },
	{ type, payload }
) => {
	switch (type) {
		case FILTER_TYPES.CHANGE:
			// if (payload.provider)
			return { ...state, ...payload };
		// else {
		// 	let temp = { ...state, ...payload };
		// 	delete temp.provider;
		// 	return temp;
		// }
		default:
			return state;
	}
};
