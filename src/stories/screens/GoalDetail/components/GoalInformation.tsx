import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '@balletworkout/components';
import GoalTag from './GoalTag';
import ExercisesList from './ExercisesList';
import {FootModal} from '../../../../common/components/FootModal';
import i18n from '@balletworkout/common/i18n';

interface Props {
  navigation?: any;
}

const GoalInformation = ({navigation}: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const onPressHandler = item => {
    setModalVisible(true);
  };
  return (
    <View style={styles.container}>
      <Text style={{textAlign: 'center'}} font={'Regular'}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </Text>
      <GoalTag navigation={navigation} />
      <Text style={{fontSize: 20, marginTop: 20}}>
        {i18n.t('goals.goal_exercise_view')}
      </Text>
      <ExercisesList onPressList={onPressHandler} />
      <FootModal
        visible={modalVisible}
        title={i18n.t('goals.setting_up_goals')}
        cancelCallBack={() => setModalVisible(false)}>
        <Text font={'Regular'}>
          {i18n.t('goals.goals_rfeach_your_goal_text')}
        </Text>
        <Text font={'Regular'}>{i18n.t('goals.goals_flexibilty_text')}</Text>
      </FootModal>
    </View>
  );
};
export default GoalInformation;
const styles = StyleSheet.create({
  container: {},
});
