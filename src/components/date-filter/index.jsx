import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import _isEmpty from 'lodash/isEmpty';
import ReactDatetimeClass from 'react-datetime';
import './style.scss';
import { changeFilter } from '../../services/date-filter/actions';

const DateFilter = () => {
	const { summaryFilter } = useSelector(({ filterReducer }) => ({
			summaryFilter: filterReducer
		})),
		dispatch = useDispatch();

	return (
		<div className="date-filter d-flex">
			<Button
				outline
				color="primary"
				size="sm"
				className={moment().format('MM/DD/YYYY') == summaryFilter.date ? 'active' : ''}
				onClick={() => dispatch(changeFilter({ date: moment().format('MM/DD/YYYY') }))}
			>
				Today
			</Button>
			<div
				className="px-3 text-muted"
				// title={previousDayTranslate}
				onClick={() =>
					dispatch(
						changeFilter({
							date: moment(summaryFilter.date).subtract(1, 'day').format('MM/DD/YYYY')
						})
					)}
			>
				<FontAwesomeIcon icon={[ 'fas', 'chevron-left' ]} />
			</div>
			<div className="text-muted date-text" style={{ fontWeight: '600' }}>
				{moment(summaryFilter.date).format('ddd DD-MMM-YYYY')}
			</div>
			<div
				className="px-3 text-muted"
				// title={nextDayTranslate}
				onClick={() =>
					dispatch(
						changeFilter({
							date: moment(summaryFilter.date).add(1, 'day').format('MM/DD/YYYY')
						})
					)}
			>
				<FontAwesomeIcon icon={[ 'fas', 'chevron-right' ]} />
			</div>

			<ReactDatetimeClass
				dateFormat={'MM/DD/YYYY'}
				value={moment(summaryFilter.date).format('MM/DD/YYYY')}
				timeFormat={false}
				closeOnSelect={true}
				onChange={(e) =>
					dispatch(
						changeFilter({
							date: e.format('MM/DD/YYYY')
						})
					)}
				renderInput={(props, openCalendar) => {
					return (
						<div className="px-3 text-muted" style={{ borderLeft: '1px solid' }} onClick={openCalendar}>
							<FontAwesomeIcon icon={[ 'fas', 'calendar-alt' ]} />
						</div>
					);
				}}
			/>
			{/* <div className="px-2 cursor_p text-muted" onClick={() => dispatch(getSummaryInfo(summaryFilter))}>
				<FontAwesomeIcon icon={[ 'fas', 'sync-alt' ]} />
			</div> */}
		</div>
	);
};

export default DateFilter;
