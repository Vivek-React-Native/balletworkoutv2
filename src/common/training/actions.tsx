import TRAINING from './constants';

export function savingTrainingProgress(data: any) {
    return {
        type: TRAINING.PROGRESS,
        payload: data,
    };
}

export function beforeSavingTrainingProgress(data: any) {
    return {type: TRAINING.BEFORE_PROGRESS, payload: data};
}

export function saveTrainingProgress(trainingProgress: any) {
    return async (dispatch: Function) => {
        await dispatch(beforeSavingTrainingProgress(trainingProgress));
        await dispatch(savingTrainingProgress(trainingProgress));
    };
}
