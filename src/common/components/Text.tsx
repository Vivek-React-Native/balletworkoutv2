import React from 'react';
import {Text as RNText} from 'react-native';

interface ITextProps {
    children: string;
    style?: object;
    font?: string;
    numberOfLines?: number
}

const Text = ({children, style={}, font = 'SemiBold', numberOfLines = 0}: ITextProps) => {
    return (
        numberOfLines > 0 ? <RNText style={[style, {fontFamily: `Poppins-${font}`}]} numberOfLines={numberOfLines}>{children}</RNText> : <RNText style={[style, {fontFamily: `Poppins-${font}`}]}>{children}</RNText>
    );
};
export default Text;
