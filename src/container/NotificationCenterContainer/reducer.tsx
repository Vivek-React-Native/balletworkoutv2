import NOTIFICATIONs from './constants';
import NOTIFICATIONS from './constants';

const initialState: any = {
    notifications: [],
    isLoading: false,
    error: [],
};

export default function (state: any = initialState, action: any) {

    if (action.type === NOTIFICATIONS.FETCH_NOTIFICATIONS) {
        return {
            ...state,
            isLoading: true,
        }
    }

    if (action.type === NOTIFICATIONS.FETCH_NOTIFICATIONS_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            notifications: action.payload,
            errors: [],
        }
    }

    if (action.type === NOTIFICATIONS.FETCH_NOTIFICATIONS_FAILURE) {
        return {
            ...state,
            isLoading: false,
            errors: action.payload
        }
    }

    return state;

}