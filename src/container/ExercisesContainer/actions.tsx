import EXERCISES from './constants';
import i18n from '../../common/i18n';
import http from './../../common/tools/axiosClient';

export function fetchingExercises() {
    return {
        type: EXERCISES.FETCHING_EXERCISES,
    }
}

export function fetchingExercisesSuccessful(exercises: any) {
    return {
        type: EXERCISES.FETCHING_EXERCISES_SUCCESSFUL,
        payload: exercises
    }
}

export function fetchingExerciseFailure(errors: any) {
    return {
        type: EXERCISES.FETCHING_EXERCISES_FAILURE,
        payload: errors
    }
}

export default function fetchExercises(id: number, type: string) {

    return (dispatch: Function, getState: Function) => {
        let token = getState().auth.tokenData.token;
        let selectedLanguage = i18n.language;

        dispatch(fetchingExercises());

        if (type === "CATEGORY") {
            http('api').get(`exercise/get-all?id=${id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Accept-Language': selectedLanguage,
                }
            }).then(({ data }) => {
                dispatch(fetchingExercisesSuccessful(data));
            }).catch(({ response }) => {
                dispatch(fetchingExerciseFailure(response));
            });
        } else if (type === "GOAL") {
            http('api').get(`exercise/get-all-goals?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept-Language': selectedLanguage,
                }
            }).then(({ data }) => {
                dispatch(fetchingExercisesSuccessful(data));
            }).catch(({ response }) => {
                dispatch(fetchingExerciseFailure(response));
            });
        }

    }
}
