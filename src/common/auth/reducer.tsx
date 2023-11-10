import AUTH from './../../common/auth/constants';
import { PURGE } from 'redux-persist';

const initialState = {
    tokenData: null,
    isLoading: false,
    isRegistered: false,
    isLoggedIn: false,
    notifications: {
        on: true,
        sound: 'ballet_notif_1',
    },
    errors: null,
    userData: null,
    shopToken: null,
    shopUser: null,
    freshTokenPromise: null,
    notificationTokenId: null,
};

export default function (state: any = initialState, action: any) {

    // console.log('ACTION.....', action.type);
    // console.log('All ACTION.....: ', action);

    if (action.type === AUTH.LOGIN) {
        return {
            ...state,
            isLoading: true,
            isLoggedIn: false,
            errors: null,
            tokenData: null,
        };
    }

    if (action.type === AUTH.LOGIN_SUCCESS) {
        return {
            ...state,
            tokenData: action.payload.tokenData,
            isLoggedIn: true,
            isLoading: false,
            isRegistered: true,
            errors: null,
            userData: action.payload.userData
        };
    }

    if (action.type === AUTH.LOGIN_FAILURE) {
        return {
            ...state,
            errors: action.payload,
            isLoggedIn: false,
            tokenData: null,
            isLoading: false,
        };
    }

    if (action.type === AUTH.REGISTER) {
        return {
            ...state,
            isLoading: true,
            isRegistered: false,
            errors: null,
            tokenData: null,
        };
    }

    if (action.type === AUTH.REGISTER_SUCCESS) {
        return {
            ...state,
            tokenData: action.payload.tokenData,
            isRegistered: true,
            isLoading: false,
            errors: null,
            userData: action.payload.userData
        };
    }

    if (action.type === AUTH.REGISTER_FAILURE) {
        return {
            ...state,
            errors: action.payload,
            isRegistered: false,
            tokenData: null,
            isLoading: false,
        };
    }

    if (action.type === AUTH.UPDATE_USER_DETAILS) {
        let payload = action.payload;
        let userData = state.userData;
        let newData = {
            ...userData,
            ...payload
        };

        return {
            ...state,
            userData: newData,
        };
    }

    if (action.type === AUTH.UPDATE_NOTIFICATION_PREFERENCES) {
        let payload = action.payload;
        let oldNotifications = state.notifications;
        let notifications = {
            ...oldNotifications,
            ...payload
        };

        return {
            ...state,
            notifications
        };
    }

    if (action.type === AUTH.USER_LOGOUT) {
        return {
            ...state,
            isLoading: false,
            isRegistered: false,
            errors: null,
            tokenData: null,
            userData: null,
            isLoggedIn: false,
        };
    }

    if (action.type === AUTH.USER_LOGOUT_SUCCESS) {
        return {
            ...state,
            isRegistered: false,
            isLoggedIn: false,
        };
    }

    if (action.type === AUTH.REFRESH_USER_TOKEN) {
        return {
            ...state,
            freshTokenPromise: action.payload.freshTokenPromise
        }
    }

    if (action.type === AUTH.REFRESH_USER_TOKEN_SUCCESS) {
        return {
            ...state,
        }
    }

    if (action.type === AUTH.REFRESH_USER_TOKEN_FAILURE) {
        return {
            ...state,
        }
    }

    if(action.type === AUTH.DELETE_USER) {
        return {
            ...state,
            isLoading: true,
        }
    }

    if(action.type === AUTH.DELETE_USER_SUCCESS) {
        return {
            ...state,
            isLoading: false,
        }
    }

    if(action.type === AUTH.DELETE_USER_FAILURE) {
        return {
            ...state,
            isLoading: false,
            error: action.payload,
        }
    }


    if(action.type === AUTH.VERIFY_USER_PURCHASE) {
        return {
            ...state,
            isLoading: true,
        }
    }

    if(action.type === AUTH.VERIFY_USER_PURCHASE_SUCCESS) {
        // console.log('verified purchase success in auth', action.payload);
        return {
            ...state,
            isLoading: false,
            userData: {
                ...state.userData,
                purchase_validity_expiry: action.payload
            }
        }
    }

    if(action.type === AUTH.VERIFY_USER_PURCHASE_FAILURE) {
        return {
            ...state,
            isLoading: false,
            error: action.payload
        }
    }

    if(action.type === AUTH.SAVE_NOTIFICATION_TOKEN_ID) {
        return {
            ...state,
            isLoading: true,
        }
    }

    if(action.type === AUTH.SAVE_NOTIFICATION_TOKEN_ID_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            notificationTokenId: action.payload,
            error: null,
        }
    }

    if(action.type === AUTH.SAVE_NOTIFICATION_TOKEN_ID_FAILURE) {
        return {
            ...state,
            isLoading: false,
            error: action.payload
        }
    }

    if(action.type === PURGE) {
        return initialState;
    }

    if(action.type === AUTH.SEND_NOTIFICATION_TOKEN_ID) {
        return {
            ...state,
            isLoading: true,
        }
    }

    if(action.type === AUTH.SEND_NOTIFICATION_TOKEN_ID_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            notificationTokenId: action.payload,
        }
    }

    if(action.type === AUTH.SEND_NOTIFICATION_TOKEN_ID_FAILURE) {
        return {
            ...state,
            isLoading: false,
            error: action.payload,
        }
    }

    return { ...state };
}
