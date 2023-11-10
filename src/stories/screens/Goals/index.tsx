import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import SpanHeader from '../../../common/components/SpanHeader';
import {Content} from 'native-base';
import GoalsList from './components/GoalsList';
import {FootModal} from '../../../common/components/FootModal';
import {Text} from '@balletworkout/components';
import i18n from '@balletworkout/common/i18n';

interface Props {
  navigation: any;
}

const GoalsScreen = ({navigation}: Props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const onPressHandler = item => {
    setModalVisible(true);
  };

  return (
    <>
      <SpanHeader
        navigation={navigation}
        title={i18n.t('goals.goals_overview')}
        subtitle={i18n.t('goals.goals_overview_subtitle')}
        hideMenu
      />
      <Content>
        <GoalsList onPressList={onPressHandler} />
        <FootModal
          visible={modalVisible}
          title={i18n.t('goals.setting_up_goals')}
          cancelCallBack={() => setModalVisible(false)}>
          <Text font={'Regular'}>
            {i18n.t('goals.goals_reach_your_goal_text')}
          </Text>
          <Text font={'Regular'}>{i18n.t('goals.goals_flexibilty_text')}</Text>
        </FootModal>
      </Content>
    </>
  );
};
export default GoalsScreen;
