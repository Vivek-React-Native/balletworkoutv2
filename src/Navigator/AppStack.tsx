import React from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import HomeTabNavigator from './HomeTabNavigator';
import WelcomeContainer from '../container/WelcomeContainer';
import Exercises from '../container/ExercisesContainer';
import SubCategories from '../container/SubCategoriesContainer';
import GoalsContainer from '../container/GoalsContainer';
import GoalDetailContainer from '../container/GoalDetailContainer';
import ExercisesNew from '../container/ExercisesNewContainer';
import Exercise from '../container/ExerciseContainer';
import Settings from '../container/SettingsContainer';
import Recipe from '../container/RecipeContainer';
import Post from '../container/PostContainer';
import Schedule from '../container/ScheduleContainer';
import Profile from '../container/ProfileContainer';
import LanguageSettings from '../container/LanguageSettingsContainer';
import PhotoProgressCamera from './../container/PhotoProgressCameraContainer';
import Notifications from '../container/NotificationContainer';
import NotificationCenter from '../container/NotificationCenterContainer';
import ShopDrawer from './ShopDrawer';
import ChooseDaysContainer from '../container/ChooseDaysContainer';
import SideMenu from '../common/components/SideMenu';
import {PRIMARY_COLOR_NEW, WIDTH} from '../utilities/Theme';
import {transitionConfigForAnimations} from './NavigationStyle';

/**
 * Main navigation
 */
const AppStack = createAppContainer(
  createDrawerNavigator(
    {
      main: HomeTabNavigator,
      categories: SubCategories,
      // exercises: Exercises,
      goals: GoalsContainer,
      goalView: GoalDetailContainer,
      exercises: ExercisesNew,
      exercise: Exercise,
      settings: Settings,
      recipeView: Recipe,
      postView: Post,
      schedule: Schedule,
      profile: Profile,
      languageSettings: LanguageSettings,
      progressCamera: PhotoProgressCamera,
      notification: Notifications,
      notificationCenter: NotificationCenter,
      shop: ShopDrawer,
    },
    {
      unmountInactiveRoutes: true,
      drawerWidth: WIDTH,
      drawerPosition: 'right',
      // drawerType: 'slide',
      initialRouteName: 'main',
      initialRouteKey: 'main',
      header: null,
      headerMode: 'none',
      navigationOptions: {
        gesturesEnabled: false,
      },
      drawerBackgroundColor: PRIMARY_COLOR_NEW,
      contentComponent: SideMenu,
      transitionConfig: transitionConfigForAnimations,
    },
  ),
);

export default AppStack;
