import {
	STUDENT_INFO,
	ACADEMIC_YEAR_ACTIONS,
	BRANCH_LIST_ACTIONS,
	CLASS_LIST_ACTIONS,
	SECTION_LIST_ACTIONS,
	STUDENT_MASTER_LIST
} from './action-types';

import store from '../../store';
import { setActiveBranch } from './action';
import { constants } from '../../utils/constants';

const { staticVariables } = constants;
export const studentInfoReducer = (
	state = {
		requesting: true,
		errorResponse: {},
		response: {}
	},
	{ type, payload }
) => {
	switch (type) {
		case STUDENT_INFO.REQ:
			return {
				...state,
				requesting: true
			};
		case STUDENT_INFO.RES:
			return {
				...state,
				response: payload.data,
				requesting: false
			};
		case STUDENT_INFO.FAIL:
			return {
				...state,
				errorResponse: payload.data,
				requesting: false
			};
		case STUDENT_INFO.CLEAR:
			return { ...state, response: {} };
		default:
			return state;
	}
};

export const academicYearReducer = (
	state = {
		requesting: true,
		errorResponse: {},
		response: {
			availableAcademicYear: [],
			activeAcademicYear: ''
		}
	},
	{ type, payload }
) => {
	switch (type) {
		case ACADEMIC_YEAR_ACTIONS.REQ:
			return {
				...state,
				requesting: true
			};
		case ACADEMIC_YEAR_ACTIONS.RES:
			return {
				...state,
				response: { ...state.response, availableAcademicYear: payload.data },
				requesting: false
			};
		case ACADEMIC_YEAR_ACTIONS.FAIL:
			return {
				...state,
				errorResponse: payload.data,
				requesting: false
			};
		case ACADEMIC_YEAR_ACTIONS.SET_ACTIVE_ACADEMIC_YEAR:
			return {
				...state,
				requesting: false,
				response: {
					...state.response,
					...state.response,
					activeAcademicYear: payload
				}
			};
		default:
			return state;
	}
};

export const branchReducer = (
	state = {
		requesting: true,
		errorResponse: {},
		response: {
			availableBranch: [],
			activeBranch: {}
		}
	},
	{ type, payload }
) => {
	switch (type) {
		case BRANCH_LIST_ACTIONS.REQ:
			return {
				...state,
				requesting: true
			};
		case BRANCH_LIST_ACTIONS.RES:
			return {
				...state,
				response: { ...state.response, availableBranch: payload.data },
				requesting: false
			};
		case BRANCH_LIST_ACTIONS.FAIL:
			return {
				...state,
				errorResponse: payload.data,
				requesting: false
			};
		case BRANCH_LIST_ACTIONS.SET_ACTIVE_BRANCH:
			let branch = staticVariables.branchList.find((branchList) => branchList.id == payload);
			return {
				...state,
				requesting: false,
				response: {
					...state.response,
					activeBranch: branch
				}
			};
		default:
			return state;
	}
};

export const classReducer = (
	state = {
		requesting: false,
		errorResponse: {},
		response: {
			availableClass: [],
			activeClass: ''
		}
	},
	{ type, payload }
) => {
	switch (type) {
		case CLASS_LIST_ACTIONS.REQ:
			return {
				...state,
				requesting: true
			};
		case CLASS_LIST_ACTIONS.RES:
			return {
				...state,
				response: { ...state.response, availableClass: payload.data },
				requesting: false
			};
		case CLASS_LIST_ACTIONS.FAIL:
			return {
				...state,
				errorResponse: payload.data,
				requesting: false
			};
		case CLASS_LIST_ACTIONS.SET_ACTIVE_CLASS:
			return {
				...state,
				requesting: false,
				response: {
					...state.response,
					...state.response,
					activeClass: payload
				}
			};
		default:
			return state;
	}
};

export const sectionReducer = (
	state = {
		requesting: false,
		errorResponse: {},
		response: {
			availableSection: [],
			activeSection: ''
		}
	},
	{ type, payload }
) => {
	switch (type) {
		case SECTION_LIST_ACTIONS.REQ:
			return {
				...state,
				requesting: true
			};
		case SECTION_LIST_ACTIONS.RES:
			return {
				...state,
				response: { ...state.response, availableSection: payload.data },
				requesting: false
			};
		case SECTION_LIST_ACTIONS.FAIL:
			return {
				...state,
				errorResponse: payload.data,
				requesting: false
			};
		case SECTION_LIST_ACTIONS.SET_ACTIVE_SECTION:
			return {
				...state,
				requesting: false,
				response: {
					...state.response,
					...state.response,
					activeSection: payload
				}
			};
		default:
			return state;
	}
};

export const studentMasterRreducer = (
	state = {
		requesting: true,
		errorResponse: {},
		response: []
	},
	{ type, payload }
) => {
	switch (type) {
		case STUDENT_MASTER_LIST.REQ:
			return {
				...state,
				requesting: true
			};
		case STUDENT_MASTER_LIST.RES:
			return {
				...state,
				response: payload.data.GetStudentManagementList ? payload.data.GetStudentManagementList : payload.data,
				requesting: false
			};
		case STUDENT_MASTER_LIST.FAIL:
			return {
				...state,
				errorResponse: payload.data,
				requesting: false
			};
		default:
			return state;
	}
};
