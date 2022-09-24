import API_CALL from '..';
import store from '../../store';
import { constants } from '../../utils/constants';
import {
	STUDENT_INFO,
	ACADEMIC_YEAR_ACTIONS,
	BRANCH_LIST_ACTIONS,
	CLASS_LIST_ACTIONS,
	SECTION_LIST_ACTIONS,
	STUDENT_MASTER_LIST
} from './action-types';

// export const userDetails = store.getState().userDetailsReducer.response;

export function getStudentInfoById(studentId) {
	if (studentId) {
		return API_CALL({
			method: 'get',
			url: 'Registration/GetPreviewById',
			params: { id: studentId },
			type: STUDENT_INFO
		});
	} else {
		return {
			type: STUDENT_INFO.CLEAR
		};
	}
}

export const getAcademicYear = () => {
	return API_CALL({
		method: 'get',
		url: 'Master/GetMasters',
		params: { id: 'AcademicYear' },
		type: ACADEMIC_YEAR_ACTIONS
	});
};

export const setActiveAcademicYear = (academicYear) => {
	return {
		type: ACADEMIC_YEAR_ACTIONS.SET_ACTIVE_ACADEMIC_YEAR,
		payload: academicYear
	};
};

export function getBranch() {
	return API_CALL({
		method: 'get',
		url: 'Master/GetEmailidBranches',
		params: { EmailId: store.getState().authReducer.userToken },
		type: BRANCH_LIST_ACTIONS
	});
}

export const setActiveBranch = (branch) => {
	return {
		type: BRANCH_LIST_ACTIONS.SET_ACTIVE_BRANCH,
		payload: branch
	};
};

export function getClass(type, params) {
	if (type == 'Teacher') {
		return API_CALL({
			method: 'get',
			url: 'Master/GetStuTeacherClass',
			params: params,
			type: CLASS_LIST_ACTIONS
		});
	} else {
		return API_CALL({
			method: 'get',
			url: 'Assessment/GetAssessmentClass',
			params: params,
			type: CLASS_LIST_ACTIONS
		});
	}
}

export const setActiveClass = (selectedClass) => {
	return {
		type: CLASS_LIST_ACTIONS.SET_ACTIVE_CLASS,
		payload: selectedClass
	};
};

export function getSection(type, params) {
	if (type == 'Teacher') {
		return API_CALL({
			method: 'get',
			url: 'Master/GetStuTeachersections',
			params: params,
			type: SECTION_LIST_ACTIONS
		});
	} else {
		return API_CALL({
			method: 'get',
			url: 'Assessment/GetAssessmentSection',
			params: params,
			type: SECTION_LIST_ACTIONS
		});
	}
}

export const setActiveSection = (section) => {
	return {
		type: SECTION_LIST_ACTIONS.SET_ACTIVE_SECTION,
		payload: section
	};
};

export function getStudentMasterList(userType, data) {
	if (userType == constants.userRole.parent) {
		return API_CALL({
			url: 'Master/GetOtherlinkStudentdrop',
			params: data,
			type: STUDENT_MASTER_LIST
		});
	} else {
		return API_CALL({
			method: 'post',
			url: 'StudentManagement/GetStudentDashboard',
			data: data,
			type: STUDENT_MASTER_LIST
		});
	}
}
