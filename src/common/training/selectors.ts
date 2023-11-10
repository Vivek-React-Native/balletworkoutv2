import * as constants from './constants';

export const trainings = (state: any) => {
  return state[constants.NAME].trainings || {};
};

export const isChanged = (state: any) => {
  return state[constants.NAME].changed;
}
