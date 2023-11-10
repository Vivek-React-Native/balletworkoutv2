import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';
import i18n from '../i18n';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../../utilities/Theme';
import AsyncStorage from '@react-native-community/async-storage';

interface Props {
    onLangChange?: Function;
};
interface State {
    lang: string;
};

export default class LanguageSwitcher extends Component<Props, State> {


    async setLang(lang: string) {
        const language = await AsyncStorage.getItem('language');
        const currentLang: any = lang || language 

        i18n.changeLanguage(currentLang);
        this.setState({lang: currentLang});

        if (this.props.onLangChange) {
            this.props.onLangChange(currentLang);
        }
    }

    languages: any = [
        { label: 'Dutch', value: 'nl-BE' },
        { label: 'English', value: 'en-US', },
        { label: 'Russian', value: 'ru-RU', },
    ]

    render() {
        let langIndex = this.languages.findIndex((lang: any) => lang.value === i18n.language);

        langIndex = langIndex !== -1 ? langIndex : 1;

        return (
            <View style={styles.container}>
                <SwitchSelector
                    initial={langIndex}
                    onPress={(value: string) => this.setLang(value)}
                    textColor={PRIMARY_COLOR}
                    textStyle={styles.textStyle}
                    selectedTextStyle={styles.textStyle}
                    selectedColor={SECONDARY_COLOR}
                    buttonColor={PRIMARY_COLOR}
                    borderColor={PRIMARY_COLOR}
                    options={this.languages}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        alignSelf: 'stretch',
        marginTop: 15,
        marginBottom: 15,
    },
    textStyle: {
        fontFamily: 'Montserrat-SemiBold'
    }
});
