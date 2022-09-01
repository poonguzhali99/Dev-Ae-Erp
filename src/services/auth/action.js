import { remove, save } from 'react-cookies';
import store from '../../store';
import * as types from './action-types';
import _isEmpty from 'lodash/isEmpty';
import { useSelector } from 'react-redux';

export const logIn = (data) => {
	save('session', data.emailid, { secure: true });
	save('userdetails', data);
	return {
		type: types.LOG_IN
	};
};
export const logOut = () => {
	remove('session');
	store.dispatch({ type: 'CLEAR_DATA' });
	return {
		type: types.LOG_OUT
	};
};
