import React, {useEffect} from 'react';
import {Container} from 'native-base';
import WelcomePage from "../../stories/screens/Welcome";
import {useSelector} from "react-redux";
import ChooseDaysCore from "../../common/chooseDays";
interface Props {
    navigation: any;
    screenProps: any;
}
const WelcomeContainer = (props: Props) => {
    const isFirst = useSelector(state => ChooseDaysCore.selectors.isFirst(state));
    useEffect(() => {
        if (!isFirst) {
            props.navigation.navigate('main');
        }
    }, [isFirst]);
    return (
        <Container>
            {isFirst && <WelcomePage {...props}/>}
        </Container>
    );
}

export default WelcomeContainer;
