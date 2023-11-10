import React from 'react';
import {createBottomTabNavigator} from 'react-navigation';
import {BottomTabBar} from 'react-navigation-tabs';
import {
  BalletShoeIcon,
  RecipeIcon,
  ProgressIcon,
  BlogIcon,
} from './../assets/icons/Svgs';
import {StyleSheet, Text} from 'react-native';
import {isIpad, isIphoneWithNotch, isTab} from './../utilities/Screen';
import i18n from './../common/i18n';
import Home from './../container/HomeContainer';
import Recipes from './../container/RecipesContainer';
// import PhotoProgress from './../container/PhotoProgressContainer';
import PhotoProgress from './../container/PhotoProgressNewContainer';
import Blog from './../container/BlogContainer';
import {PRIMARY_COLOR_NEW, HEIGHT, WIDTH} from '@balletworkout/utilities/Theme';
const TabBarComponent = (props: any) => <BottomTabBar {...props} />;

const HomeTabNavigator = createBottomTabNavigator(
  {
    home: {
      screen: Home,
      navigationOptions: {
        title: 'Workouts',
        tabBarLabel: ({tintColor}) => (
          <Text
            style={[
              styles.tabBarLabel,
              {color: tintColor, marginLeft: isIpad ? 20 : 0},
            ]}>
            {i18n.t('home.tab_bar.workout')}
          </Text>
        ),
        tabBarIcon: ({tintColor}) => (
          <BalletShoeIcon width={WIDTH * 0.07} height={WIDTH * 0.07} color={tintColor} />
        ),
      },
    },
    recipes: {
      screen: Recipes,
      navigationOptions: {
        title: i18n.t('home.tab_bar.recipe'),
        tabBarLabel: ({tintColor}) => (
          <Text
            style={[
              styles.tabBarLabel,
              {color: tintColor, marginLeft: isIpad ? 20 : 0},
            ]}>
            {i18n.t('home.tab_bar.recipe')}
          </Text>
        ),
        tabBarIcon: ({tintColor}) => (
          <RecipeIcon width={WIDTH * 0.07} height={WIDTH * 0.07} color={tintColor} />
        ),
      },
    },
    photoProgress: {
      screen: PhotoProgress,
      navigationOptions: {
        title: 'Progress',
        tabBarLabel: ({tintColor}) => (
          <Text
            style={[
              styles.tabBarLabel,
              {color: tintColor, marginLeft: isIpad ? 20 : 0},
            ]}>
            {i18n.t('home.tab_bar.progress')}
          </Text>
        ),
        tabBarIcon: ({tintColor}) => (
          <ProgressIcon width={WIDTH * 0.07} height={WIDTH * 0.07} color={tintColor} />
        ),
      },
    },
    blog: {
      screen: Blog,
      navigationOptions: {
        title: 'Blog',
        tabBarLabel: ({tintColor}) => (
          <Text
            style={[
              styles.tabBarLabel,
              {color: tintColor, marginLeft: isIpad ? 20 : 0},
            ]}>
            {i18n.t('home.tab_bar.blog')}
          </Text>
        ),
        tabBarIcon: ({tintColor}) => (
          <BlogIcon width={WIDTH * 0.07} height={WIDTH * 0.07} color={tintColor} />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#fff',
      inactiveTintColor: 'rgba(255, 255, 255, 0.5)',
      style: {
        backgroundColor: PRIMARY_COLOR_NEW,
        height: isIpad || isTab ? 70 : WIDTH * 0.22,
        paddingBottom: isIphoneWithNotch() ? 20 : 5,
      },
    },
  },
);

/**
 * styles for navigators
 */
const styles = StyleSheet.create({
  tabBarLabel: {
    alignSelf: 'center',
    fontSize: isIpad || isTab ? 20 : WIDTH * 0.037,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default HomeTabNavigator;
