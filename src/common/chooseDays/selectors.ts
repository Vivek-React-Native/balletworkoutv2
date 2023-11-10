import * as constants from './constants';

export const chooseDays = (state: any) => {
  return state[constants.NAME].chooseDays || 3;
};

export const isChanged = (state: any) => {
  return state[constants.NAME].changed;
}

export const isFirst = (state: any) => {
  return state[constants.NAME].isFirst;
}
