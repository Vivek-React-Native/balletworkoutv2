import SUB_CATEGORIES from './constants';

const initialState = {
    isLoading: true,
    subCategories: [],
    errors: [],
}

export default function subCategoryReducer(state: any = initialState, action: any) {
    if(action.type === SUB_CATEGORIES.FETCHING_SUB_CATEGORIES) {
        return {
            ...state,
            isLoading: true,
            errors: [],
            subCategories: []
        };
    }

    if(action.type === SUB_CATEGORIES.FETCHING_SUB_CATEGORIES_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            errors: [],
            subCategories: action.payload.data
        }
    }

    if(action.type === SUB_CATEGORIES.FETCHING_SUB_CATEGORIES_FAILURE) {
        return {
            ...state,
            isLoading: false,
            errors: action.payload,
            subCategories: [],
        }
    }

    return state;
}
