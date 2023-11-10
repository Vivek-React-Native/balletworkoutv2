import TEMP from './constants';

function navigatingAfterRegistration() {
  return {
    type: TEMP.REGISTERING,
  };
}

function destroyAfterRegistration() {
  return {
    type: TEMP.DESTROY_REGISTERING,
  };
}

export function navigationAfterRegistration(type: string = 'set') {
  return (dispatch: Function, getState: Function) => {
    if (type === 'set') {
      dispatch(navigatingAfterRegistration());
    } else if (type === 'destroy') {
      dispatch(destroyAfterRegistration());
    }
  };
}
