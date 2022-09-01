import axios from 'axios';
// import { getAccessToken } from '../utils/common-utils';

axios.interceptors.request.use((request) => {
	// return getAccessToken()
	// 	.then((authData) => {
	// 		const { tokenType = '', accessToken = '' } = authData;
	// 		request.headers['Authorization'] = `${tokenType} ${accessToken}`;
	// 		request.headers['PATIENT360-API-KEY'] = '4400000E-D6A3-4CE8-8743-897BCAA18347';
	// 		return Promise.resolve(request);
	// 	})
	// 	.catch(() => {
	// 		return Promise.resolve(request);
	// 	});
	// return Promise.resolve(request);
});
