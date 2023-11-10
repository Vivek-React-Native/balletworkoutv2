import TEMP from './constants';

const initialState = {
  afterRegistration: false,
};

export default function(state: any = initialState, action: any) {
  if (action.type === TEMP.REGISTERING) {
    return {
      ...state,
      afterRegistration: true,
    };
  }

  if (action.type === TEMP.DESTROY_REGISTERING) {
    return {
      ...state,
      afterRegistration: false,
    };
  }

  return state;
}
