import axios from 'axios';
import { constants } from '../utils/constants';
import { Toast } from '../utils/common-utils';
// import { showUnAuthorizedAccessMsg } from '../utils/common-utils';
const ROOT_URL = process.env.API_URL;

// import './axios-auth-refresh-token';

const API_CALL = ({
	method,
	url,
	fullUrl,
	data,
	params,
	type,
	callback,
	headerConfig,
	errCallback,
	file,
	onUploadProgress,
	cancelToken
}) => {
	let header;
	// To change the header configuration - specific
	headerConfig ? (header = { ...header, ...headerConfig }) : (header = header);
	if (callback) {
		axios({
			method,
			url: ROOT_URL + url,
			data,
			params,
			headers: header,
			validateStatus: (status) => {
				if (status == 401) return false;
				else return true; // I'm always returning true, you may want to do it depending on the status received
			},
			responseType: file ? 'arraybuffer' : 'json',
			onUploadProgress: ({ loaded, total }) => {
				let percent = Math.floor(loaded * 100 / total);
				return onUploadProgress ? onUploadProgress(percent) : false;
				// Do whatever you want with the native progress event
			},
			cancelToken
		}).then((data) => {
			return callback(data);
		});
	} else {
		return function(dispatch) {
			dispatch({
				type: type.REQ
			});
			axios({
				method,
				url: ROOT_URL + url,
				data,
				params,
				headers: header,
				validateStatus: (status) => {
					if (load('session') && status == 401) return false;
					else return true; // I'm always returning true, you may want to do it depending on the status received
				}
			}).then((response) => {
				if (response.status === 500 || response.status === 400) {
					Toast.add({ type: 'danger', message: response.data.message });
					dispatch({
						type: type.FAIL,
						payload: response
					});
				} else {
					dispatch({
						type: type.RES,
						payload: response
					});
				}
			});
		};
	}
};

export default API_CALL;
