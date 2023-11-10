import SCHEDULE from './constants';
import i18n from '../../common/i18n';
import http from './../../common/tools/axiosClient';

function fetchingSchedule() {
    return {
        type: SCHEDULE.FETCHING_SCHEDULE,
    }
}

function fetchingScheduleSuccess(schedule: any) {
    return {
        type: SCHEDULE.FETCHING_SCHEDULE_SUCCESS,
        payload: schedule,
    };
}

function fetchingScheduleFailure(errors: any) {
    return {
        type: SCHEDULE.FETCHING_SCHEDULE_FAILURE,
        payload: errors,
    };
}

function addingSchedule() {
    return {
        type: SCHEDULE.ADD_CLASS_REGISTRATION,
    }
}

function addingScheduleSuccess() {
    return {
        type: SCHEDULE.ADD_CLASS_REGISTRATION_SUCCESS,
    };
}

function addingScheduleFailure(errors: any) {
    return {
        type: SCHEDULE.ADD_CLASS_REGISTRATION_FAILURE,
        payload: errors,
    };
}

function deRegisteringClass() {
    return {
        type: SCHEDULE.REMOVE_CLASS_REGISTRATION,
    }
}

function deRegisteringClassSuccess() {
    return {
        type: SCHEDULE.REMOVE_CLASS_REGISTRATION_SUCCESS,
    };
}

function deRegisteringClassFailure(errors: any) {
    return {
        type: SCHEDULE.REMOVE_CLASS_REGISTRATION_FAILURE,
        payload: errors,
    };
}

function fetchingClassRegistration() {
    return {
        type: SCHEDULE.FETCH_CLASS_REGISTRATION,
    }
}

function fetchingClassRegistrationSuccess(registrations: any) {
    return {
        type: SCHEDULE.FETCH_CLASS_REGISTRATION_SUCCESS,
        payload: registrations,
    };
}

function fetchingClassRegistrationFailure(errors: any) {
    return {
        type: SCHEDULE.FETCH_CLASS_REGISTRATION_FAILURE,
        payload: errors,
    };
}

export default function fetchSchedule() {

    return (dispatch: Function, getState: Function) => {
        let token = getState().auth.tokenData.token;
        let selectedLanguage = i18n.language;
        dispatch(fetchingSchedule());
        http().get('class-schedule/get', {
            headers: {
                Authorization: 'Bearer ' + token,
                'Accept-Language': selectedLanguage,
            }
        }).then(({ data }) => {
            dispatch(fetchingScheduleSuccess(data));
        }).catch(({ response }) => {
            dispatch(fetchingScheduleFailure(response));
        });
    }
}

export function registerToclass(classId: string) {
    return (dispatch: Function, getState: Function) => {
        let token = getState().auth.tokenData.token;
        let selectedLanguage = i18n.language;
        dispatch(addingSchedule());
        http().post('class-schedule/register', { class_id: classId }, {
            headers: {
                Authorization: 'Bearer ' + token,
                'Accept-Language': selectedLanguage,
            }
        }).then(({ data }) => {
            if (data.status !== 208) {
                dispatch(addingScheduleSuccess());
                dispatch(fetchingClassRegistrationSuccess(data));
            }

            dispatch(addingScheduleSuccess());

        }).catch(({ response }) => {
            dispatch(addingScheduleFailure(response.data));
        });
    }
}

export function deRegisterToclass(id: string) {
    return (dispatch: Function, getState: Function) => {
        let token = getState().auth.tokenData.token;
        let selectedLanguage = i18n.language;
        dispatch(deRegisteringClass());
        http().post('class-schedule/delete-registration?id=' + id, {}, {
            headers: {
                Authorization: 'Bearer ' + token,
                'Accept-Language': selectedLanguage,
            }
        }).then(({ data }) => {
            if (data.status !== 208) {
                dispatch(deRegisteringClassSuccess());
                dispatch(fetchingClassRegistrationSuccess(data));
            }

            dispatch(deRegisteringClassSuccess());

        }).catch(({ response }) => {
            dispatch(deRegisteringClassFailure(response.data));
        });
    }
}

export function fetchClassRegistration() {

    return (dispatch: Function, getState: Function) => {
        let token = getState().auth.tokenData.token;
        let selectedLanguage = i18n.language;
        dispatch(fetchingClassRegistration());
        http().get('class-schedule/get-user-registration', {
            headers: {
                Authorization: 'Bearer ' + token,
                'Accept-Language': selectedLanguage,
            }
        }).then(({ data }) => {
            dispatch(fetchingClassRegistrationSuccess(data));
        }).catch(({ response }) => {
            // console.log(response);
            if (response.status === 404) {
                dispatch(fetchingClassRegistrationFailure(response.data.message));
            }
        });
    }
}
