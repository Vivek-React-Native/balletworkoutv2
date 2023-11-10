import PHOTO_PROGRESS from './constants';

const initialState = {
    isLoading: false,
    photos: [],
    training: [],
    error: null,
    showPhotoProgressTut: true,
    showProgressCameraTut: true,
};

export default function (state:any = initialState, action: any) {

    if(action.type === PHOTO_PROGRESS.SAVE_TRAINING_PROGRESS) {
        // console.log('Hello World...',action.type, action.payload);
        let training = state.training;

        training.push(action.payload);

        return {
            ...state,
            isLoading: true,
            training,
        };
    }

    if(action.type === PHOTO_PROGRESS.SAVE_PHOTO_PROGRESS) {

        let photos = state.photos;

        photos.push(action.payload);

        return {
            ...state,
            isLoading: true,
            photos,
        };
    }

    if(action.type === PHOTO_PROGRESS.SAVE_PHOTO_PROGRESS_SUCCESS) {

        return {
            ...state,
            isLoading: false,
        };
    }

    if(action.type === PHOTO_PROGRESS.SAVE_PHOTO_PROGRESS_FAILURE) {

        return {
            ...state,
            error: action.payload,
        };
    }

    if(action.type === PHOTO_PROGRESS.UPDATE_PHOTO_PROGRESS) {

        let photos = state.photos.map((photo: any, index: number) => {
            if(action.payload.photoProgress.goal_id === photo.goal_id) {

                if (action.payload.when === 'before') {
                    return {
                        ...photo,
                        before_picture: action.payload.photoProgress.before_picture
                    };

                } else {
                    return {
                        ...photo,
                        after_picture: action.payload.photoProgress.after_picture
                    };
                }

            } else {
                return photo;
            }
        });

        return {
            ...state,
            isLoading: true,
            photos,
        };
    }

    if(action.type === PHOTO_PROGRESS.UPDATE_PHOTO_PROGRESS_SUCCESS) {

        return {
            ...state,
            isLoading: false,
        };
    }

    if(action.type === PHOTO_PROGRESS.UPDATE_PHOTO_PROGRESS_FAILURE) {

        return {
            ...state,
            error: action.payload,
        };
    }

    if(action.type === PHOTO_PROGRESS.COMPLETE_PHOTO_PROGRESS_TUTORIAL) {
        return {
            ...state,
            showPhotoProgressTut: false,
        };
    }

    if(action.type === PHOTO_PROGRESS.COMPLETE_PROGRESS_CAMERA_TUTORIAL) {

        return {
            ...state,
            showProgressCameraTut: false,
        };
    }

    return state;

}
