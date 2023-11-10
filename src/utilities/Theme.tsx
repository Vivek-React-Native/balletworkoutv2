import {Platform, Dimensions} from 'react-native';

const {height, width} = Dimensions.get('window');

const PRIMARY_COLOR = '#464C6E';
const PRIMARY_COLOR_NEW = '#A45A79';
const SECONDARY_COLOR = '#D2959F';
const SECONDARY_COLOR_NEW = '#828282';
const LIGHT_PRIMARY_COLOR = '#F2E6E6';
const GREY = '#9e9e9e';
const LIGHT_GREY = '#bdbdbd';
const LIGHT_GREY_1 = '#e0e0e0';
const LIGHT_GREY_2 = '#eeeeee';

const PADDING_LEFT_RIGHT = width >= 768 ? 100 : 25;

export {
  PADDING_LEFT_RIGHT,
  width as WIDTH,
  height as HEIGHT,
  PRIMARY_COLOR,
  PRIMARY_COLOR_NEW,
  SECONDARY_COLOR,
  SECONDARY_COLOR_NEW,
  GREY,
  LIGHT_GREY,
  LIGHT_GREY_1,
  LIGHT_GREY_2,
  LIGHT_PRIMARY_COLOR,
};
