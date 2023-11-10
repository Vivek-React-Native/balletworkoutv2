import RECIPES from './constants';

const initialState = {
    isLoading: false,
    errors: false,
    recipes: [],
};

export default function(state:any = initialState, action: any) {

    if(action.type === RECIPES.FETCHING) {
        return {
            ...state,
            isLoading: true,
        }
    }

    if(action.type === RECIPES.SUCCESS_FETCHING) {
        return {
            ...state,
            recipes: action.payload,
            isLoading: false,
        }
    }

    if(action.type === RECIPES.FAILURE_FETCHING) {
        return {
            ...state,
            isLoading: false,
            errors: action.payload,
        }
    }

    return state;
}
