// import { loginRequest } from '../../AuthConfig';
// import { msalInstance } from '../../main';
import { notification } from 'antd';
// import { Store as notification } from 'react-notifications-component';
import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';

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
	add: (props) => {
		const { type, message, title, duration } = props;
		notification[type]({
			message: title ? title : type.toUpperCase(),
			description: message,
			duration: duration ? duration : 3,
			top: 35
		});
	},
	remove: () => notification.destroy()
};

export const weeksInMonth = (monthIndex, year) => {
	// Code for getting week list data for month :
	function getMomentDate(start, end) {
		return {
			startDate: moment([ year, monthIndex - 1, start ]),
			endDate: moment([ year, monthIndex - 1, end ])
		};
	}

	function weeks(month) {
		const weekStartEndDay = [];
		const first = month.day() == 0 ? 6 : month.day() - 1;
		let day = 7 - first;
		const last = month.daysInMonth();
		const count = (last - day) / 7;

		weekStartEndDay.push(getMomentDate(1, day));
		for (let i = 0; i < count; i++) {
			weekStartEndDay.push(getMomentDate(day + 1, Math.min((day += 7), last)));
		}
		return weekStartEndDay;
	}

	const month = moment([ year, monthIndex - 1 ]);
	const weekList = weeks(month);
	let weeksList = [];
	weekList.forEach((date) => {
		let obj = {
			U_VALUS: `${date.startDate.format('YYYY-MM-DD')} to ${date.endDate.format('YYYY-MM-DD')}`,
			U_Desc: `${date.startDate.format('DD-MMM')} to ${date.endDate.format('DD-MMM')}`
		};
		weeksList.push(obj);
	});
	return weeksList;
};
