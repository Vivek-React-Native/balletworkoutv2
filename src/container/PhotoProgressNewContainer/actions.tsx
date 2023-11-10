import PHOTO_PROGRESS from './constants';
import RNFetchBlob from 'rn-fetch-blob';


export function savingTrainingProgress(data: any) {
    return {
        type: PHOTO_PROGRESS.SAVE_TRAINING_PROGRESS,
        payload: data,
    };
}

export function saveTrainingProgress(trainingProgress: any) {
    // console.log('trainingProgress:', trainingProgress)
    return (dispatch: Function) => dispatch(savingTrainingProgress(trainingProgress));
}

export function savingPhotoProgress(data: any) {
    return {
        type: PHOTO_PROGRESS.SAVE_PHOTO_PROGRESS,
        payload: data,
    };
}

export function savingPhotoProgressSuccess() {
    return {
        type: PHOTO_PROGRESS.SAVE_PHOTO_PROGRESS_SUCCESS,
    };
}

export function savingPhotoProgressFailure(error: any) {
    return {
        type: PHOTO_PROGRESS.SAVE_PHOTO_PROGRESS_FAILURE,
        payload: error,
    };
}

export function savePhotoProgress(photoProgress: any) {
    return (dispatch: Function, getSate: Function) => {
        dispatch(savingPhotoProgress(photoProgress));
        dispatch(savingPhotoProgressSuccess());
    }
}

export function updatingPhotoProgress(photoProgress: any) {
    return {
        type: PHOTO_PROGRESS.UPDATE_PHOTO_PROGRESS,
        payload: photoProgress,
    };
}

export function updatingPhotoProgressSuccess() {
    return {
        type: PHOTO_PROGRESS.UPDATE_PHOTO_PROGRESS_SUCCESS,
    };
}

export function updatingPhotoProgressFailure(error: any) {
    return {
        type: PHOTO_PROGRESS.UPDATE_PHOTO_PROGRESS,
        payload: error,
    };
}

export function updatePhotoProgress(photoProgress: any, when: string, existingPhoto: any) {
    return (dispatch: Function, getSate: Function) => {

        if (when === 'before') {
            if (existingPhoto.before_picture !== '') {
                RNFetchBlob.fs.unlink(existingPhoto.before_picture).then(() => {
                    dispatch(updatingPhotoProgress({ photoProgress: photoProgress, when }));
                    dispatch(updatingPhotoProgressSuccess());
                }).catch((error: any) => {
                    dispatch(updatingPhotoProgressFailure(error));
                });
            } else {
                dispatch(updatingPhotoProgress({ photoProgress: photoProgress, when }));
                dispatch(updatingPhotoProgressSuccess());
            }

        } else if (when === 'after') {
            if (existingPhoto.after_picture !== '') {
                RNFetchBlob.fs.unlink(existingPhoto.after_picture).then(() => {
                    dispatch(updatingPhotoProgress({ photoProgress: photoProgress, when }));
                    dispatch(updatingPhotoProgressSuccess());
                }).catch((error: any) => {
                    dispatch(updatingPhotoProgressFailure(error));
                });
            } else {
                dispatch(updatingPhotoProgress({ photoProgress: photoProgress, when }));
                dispatch(updatingPhotoProgressSuccess());
            }
        }
    }
}

export function deletingPhotoProgress() {
    return {
        type: PHOTO_PROGRESS.DELETE_PHOTO_PROGRESS,
    };
}

export function deletingPhotoProgressSuccess() {
    return {
        type: PHOTO_PROGRESS.DELETE_PHOTO_PROGRESS_SUCCESS,
    };
}

export function deletingPhotoProgressFailure(error: any) {
    return {
        type: PHOTO_PROGRESS.DELETE_PHOTO_PROGRESS,
        payload: error,
    };
}

export function deletingPhotoProgressPhoto() {
    return {
        type: PHOTO_PROGRESS.DELETE_PHOTO_PROGRESS_PHOTO,
    };
}

export function deletingPhotoProgressPhotoSuccess() {
    return {
        type: PHOTO_PROGRESS.DELETE_PHOTO_PROGRESS_PHOTO_SUCCESS,
    };
}

export function deletingPhotoProgressPhotoFailure(error: any) {
    return {
        type: PHOTO_PROGRESS.DELETE_PHOTO_PROGRESS_PHOTO,
        payload: error,
    };
}

function completingPhotoProgressTut() {
    return {
        type: PHOTO_PROGRESS.COMPLETE_PHOTO_PROGRESS_TUTORIAL,
    };
}

export function completePhotoProgressTut() {
    return (dispatch: Function, getState: Function) => {
        dispatch(completingPhotoProgressTut())
    }
}

function completingProgressCameraTut() {
    return {
        type: PHOTO_PROGRESS.COMPLETE_PROGRESS_CAMERA_TUTORIAL,
    };
}

export function completeProgressCameraTut() {
    return (dispatch: Function, getState: Function) => {
        dispatch(completingProgressCameraTut())
    }
}
