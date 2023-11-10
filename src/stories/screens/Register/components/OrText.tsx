import React from 'react';
import { Text, StyleSheet, View } from "react-native";
import i18n from '../../../../common/i18n';
import { isIphoneSe } from '../../../../utilities/Screen';
import { HEIGHT } from '../../../../utilities/Theme';

const OrText = (props: any) => {
    return (
        <View style={styles.container}>
            <Text style={[
                styles.textWhite,
                styles.textBold,
            ]}> {i18n.t('auth.or_text')} </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: -1,//isIphoneSe? .3 : .7,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: HEIGHT <= 667 ? 15 :20
    },
    textWhite: {
        color: "#ffffff",
    },
    textBold: {
        fontFamily: 'Montserrat-Bold',
    },
});

export default OrText;
