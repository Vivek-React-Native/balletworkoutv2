import HOME from './constants';

const initialState = {
	categoryList: [],
	isLoading: true,
	errors: []
};

export default function homeReducer(state: any = initialState, action: any) {
	if (action.type === HOME.FETCH_CATEGORIES) {
		return {
			...state,
			isLoading: true
		};
	}
	if (action.type === HOME.FETCH_CATEGORIES_SUCCESS) {
		return {
			...state,
			categoryList: action.payload,
			isLoading: false,
		};
	}
	if (action.type === HOME.FETCH_CATEGORIES_FAILURE) {
		return {
			...state,
			isLoading: false,
			errors: action.payload
		};
	}
	return state;
}
