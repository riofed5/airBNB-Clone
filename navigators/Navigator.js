/* eslint-disable react/display-name */

import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import Home from "../views/Home";
import Profile from "../views/Profile";
import Single from "../views/Single";
import AuthLoading from "../views/AuthLoading";
import Login from "../views/Login";
import Upload from "../views/Upload";
import { Icon } from "native-base";
import Modify from "../views/Modify";
import Saved from "../views/Saved";
import SearchPage from "../views/SearchPage";
import ModifyUserInfo from "../views/ModifyUserInfo";
import BookingInfo from "../views/BookingInfo";
import BookedSuccess from "../views/BookedSuccess";
import Booked from "../views/Booked"; 
import ChangeAvatar from "../views/ChangeAvatar";

const TabNavigator = createBottomTabNavigator(
  {
    Home,
    Saved,
    Profile
  },
  {

    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, color, size}) => {
        const {routeName} = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = 'home';
        } else if (routeName === 'Profile') {
          iconName = 'person';
        } else if (routeName === 'Saved') {
          iconName = 'bookmark';
        } 

        // You can return any component that you like here!
        return <Icon name={iconName} size={size} style={{color: focused ? 'red' : 'gray'}} color={color}/>;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'black',
      inactiveTintColor: 'gray',
    },
  },
);

TabNavigator.navigationOptions = ({navigation}) => {
  const {routeName} = navigation.state.routes[navigation.state.index];

  // You can do whatever you like here to pick the title based on the route name
  const headerTitle = routeName;

  return {
    headerTitle
  };
};

const StackNavigator = createStackNavigator(
  // RouteConfigs
  {
    Home: {
      screen: TabNavigator,
      navigationOptions: {

        headerMode: "none", // this will hide the header
        headerLeft: () => {
        } // this will hide back button
      }
    },
    Single: {
      screen: Single,
      navigationOptions: {
        headerShown: false, // this will hide the header
        headerLeft: () => {
        }, // this will hide back button
      }
    },
    Modify: {
      screen: Modify
    },
    Logout: {
      screen: Login
    },
    Upload: {
      screen: Upload
    },
    ModifyUserInfo: {
      screen: ModifyUserInfo
    },
    BookingInfo: {
      screen: BookingInfo
    },
    BookedSuccess: {
      screen: BookedSuccess,
      navigationOptions: {
        headerShown: false, // this will hide the header
        headerLeft: () => {
        }, // this will hide back button
      }
    },
    Profile: {
      screen: TabNavigator,
      navigationOptions: {

        headerMode: "none", // this will hide the header
        headerLeft: () => {
        } // this will hide back button
      }
    },
    SearchPage: {
      screen: SearchPage
    },
    Booked: {
      screen: Booked
    },
    ChangeAvatar: {
      screen: ChangeAvatar
    },
    
  }
);

const Navigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoading,
    App: StackNavigator,

    Auth: Login
  },
  {
    initialRouteName: "AuthLoading"
  }
);

export default createAppContainer(Navigator);
