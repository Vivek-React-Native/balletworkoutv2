import React from 'react';
import SvgIcon from 'react-native-svg-icon';
import svgs from './Svgs';
const Icon = (props) => <SvgIcon {...props} svgs={svgs} />;

Icon.defaultProps = {
   fill: 'none',
};


export default Icon;
