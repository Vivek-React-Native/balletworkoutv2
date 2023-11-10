import React from 'react';
import {Body, Container, Header, Left, Right} from 'native-base';
import WelcomePage from "../../stories/screens/Welcome";
import {TouchableOpacity} from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import ChooseDaysPage from "../../stories/screens/ChooseDays";
import { WIDTH } from '../../utilities/Theme';

interface Props {
    navigation: any;
    screenProps: any;
}
const ChooseDaysContainer = (props: Props) => {
    return (
        <Container>
            <Header transparent style={{height: 50, flex: 0}}>
                <Left>
                    <TouchableOpacity style={{marginLeft: WIDTH * 0.02}} onPress={() => props.navigation.goBack()}>
                        <Icon name="left" style={{fontSize: 20}}/>
                    </TouchableOpacity>
                </Left>
                <Body></Body>
                <Right></Right>
            </Header>
            <ChooseDaysPage {...props}/>
        </Container>
    );
}

export default ChooseDaysContainer;
