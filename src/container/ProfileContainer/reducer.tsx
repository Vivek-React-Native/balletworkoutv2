import PROFILE from './constants';

const initialState = {
    profile: null,
    saveErrors: [],
    fetchErrors: [],
    isFetching: false,
    isSaving: false,
    isUploadingPicture: false,
    isUploadPictureError: [],
}

export default function (state: any = initialState, action: any) {

    if(action.type === PROFILE.SAVING_ACCOUNT_DETAILS) {
        return {
            ...state,
            isSaving: true,
            isFetching: false,
            saveErrors: [],
            fetchErrors: [],
        }
    }

    if(action.type === PROFILE.SAVING_ACCOUNT_DETAILS_SUCCESS) {
        return {
            ...state,
            isSaving: false,
            isFetching: false,
            saveErrors: [],
            fetchErrors: [],
            profile: action.payload,
        }
    }

    if(action.type === PROFILE.SAVING_ACCOUNT_DETAILS_FAILURE) {
        return {
            ...state,
            isSaving: false,
            isFetching: false,
            saveErrors: action.payload,
            fetchErrors: [],
        }
    }

    if(action.type === PROFILE.FETCHING_ACCOUNT_DETAILS) {
        return {
            ...state,
            isSaving: false,
            isFetching: true,
            saveErrors: [],
            fetchErrors: [],
            profile: {},
        }
    }

    if(action.type === PROFILE.FETCHING_ACCOUNT_DETAILS_SUCCESS) {
        return {
            ...state,
            isSaving: false,
            isFetching: false,
            saveErrors: [],
            fetchErrors: [],
            profile: action.payload,
        }
    }

    if(action.type === PROFILE.FETCHING_ACCOUNT_DETAILS_FAILURE) {
        return {
            ...state,
            isSaving: false,
            isFetching: false,
            saveErrors: [],
            fetchErrors: action.payload,
            profile: {},
        }
    }

    if(action.type === PROFILE.UPLOADING_PROFILE_PICTURE) {
        return {
            ...state,
            isUploadingPicture: true
        }
    }

    if(action.type === PROFILE.UPLOADING_PROFILE_PICTURE_SUCCESS) {
        return {
            ...state,
            isUploadingPicture: false,
            isUploadPictureError: [],
        }
    }

    if(action.type === PROFILE.UPLOADING_PROFILE_PICTURE_FAILURE) {
        return {
            ...state,
            isUploadingPicture: false,
            isUploadPictureError: action.payload,
        }
    }

    return state;
}
