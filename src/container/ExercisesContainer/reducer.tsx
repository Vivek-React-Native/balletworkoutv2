import EXERCISES from './constants';

const initialState = {
    isLoading: false,
    errors: [],
    exercises: [],
}

export default function(state: any = initialState, action: any) {

    if(action.type === EXERCISES.FETCHING_EXERCISES) {
        return {
            ...state,
            isLoading: true,
            exercises: [],
            errors: [],
        }
    }

    if(action.type === EXERCISES.FETCHING_EXERCISES_SUCCESSFUL) {
        return {
            ...state,
            isLoading: false,
            exercises: action.payload.data,
            errors: [],
        };
    }

    if(action.type === EXERCISES.FETCHING_EXERCISES_FAILURE) {
        return {
            ...state,
            isLoading: false,
            exercices: [],
            errors: [],
        };
    }

    return state;

}
