import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import Confetti from 'react-native-confetti';
import {HEIGHT, WIDTH} from '../../utilities/Theme';

interface Props {
}

interface State {

}

export default class ConfettiAnimation extends Component<Props, State> {

    _confettiView: any;

    componentDidMount() {
        if (this._confettiView) {
            this._confettiView.startConfetti();
        }
    }

    componentWillUnmount() {
        this._confettiView.stopConfetti();
    }

    render() {
        return (
            <View style={styles.container}>
                <Confetti
                    ref={(node: any) => this._confettiView = node}
                    timeout={30}
                    confettiCount={200}
                    duration={4000}/>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
