import SCHEDULE from './constants';

const initialState = {
    isLoading: false,
    errors: null,
    schedule: {},
    registrations: [],
    registrationError: null,
    registrationDetails: {},
    availableSpots: 0,
    spotsVisible: false,
};

export default function (state: any = initialState, action: any) {

    if(SCHEDULE.FETCHING_SCHEDULE === action.type) {
        return {
            ...state,
            isLoading: true,
            errors: null,
            registrationError: null,
        }
    }

    if(SCHEDULE.FETCHING_SCHEDULE_SUCCESS === action.type) {
        return {
            ...state,
            isLoading: false,
            errors: null,
            schedule: action.payload.data,
            registrationError: null,
            spotsVisible: action.payload.spots_visible != 0,
        }
    }

    if(SCHEDULE.FETCHING_SCHEDULE_FAILURE === action.type) {
        return {
            ...state,
            isLoading: false,
            errors: action.payload.data,
            registrationError: null,
        }
    }

    if(SCHEDULE.ADD_CLASS_REGISTRATION === action.type) {
        return {
            ...state,
            isLoading: true,
            errors: null,
            registrationError: null
        }
    }

    if(SCHEDULE.ADD_CLASS_REGISTRATION_SUCCESS === action.type) {
        return {
            ...state,
            isLoading: false,
            errors: [],
            registrationError: null
        }
    }

    if(SCHEDULE.ADD_CLASS_REGISTRATION_FAILURE === action.type) {
        return {
            ...state,
            isLoading: false,
            errors: null,
            registrationError: action.payload
        }
    }

    if(SCHEDULE.REMOVE_CLASS_REGISTRATION === action.type) {
        return {
            ...state,
            isLoading: true,
            errors: null,
            registrationError: null
        }
    }

    if(SCHEDULE.REMOVE_CLASS_REGISTRATION_SUCCESS === action.type) {
        return {
            ...state,
            isLoading: false,
            errors: [],
            registrationError: null
        }
    }

    if(SCHEDULE.REMOVE_CLASS_REGISTRATION_FAILURE === action.type) {
        return {
            ...state,
            isLoading: false,
            errors: null,
            registrationError: action.payload
        }
    }

    if(SCHEDULE.FETCH_CLASS_REGISTRATION === action.type) {
        return {
            ...state,
            isLoading: true,
            errors: [],
            registrationError: null
        }
    }

    if(SCHEDULE.FETCH_CLASS_REGISTRATION_SUCCESS === action.type) {
        return {
            ...state,
            isLoading: false,
            errors: [],
            registrations: action.payload.data,
            registrationError: null,
            registrationDetails: action.payload.full_registrations,
            availableSpots: action.payload.available,
            spotsVisible: action.payload.spots_visible != 0,
        }
    }

    if(SCHEDULE.FETCH_CLASS_REGISTRATION_FAILURE === action.type) {
        return {
            ...state,
            isLoading: false,
            registrations: [],
            errors: action.payload,
            registrationError: null,
            registrationDetails: {}
        }
    }

    return state;
}
