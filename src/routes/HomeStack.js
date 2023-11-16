import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {Platform} from 'react-native';
import {useSelector} from 'react-redux';
import HomeScreen from '../screens/UserHome/HomeScreen';
import TeacherHome from '../screens/TeacherHome/TeacherHome';
import UserCreateRequest from '../screens/CreateRequest/UserCreateRequest';
import DetailTutor from '../screens/Tutor/DetailTutor';
import Chat from './ChatStack';
import Profile from './ProfileStack';
import Calendar from './CalendarStack';
import DetailClass from '../screens/DetailClass/DetailClass';
import ShowAllList from '../screens/UserHome/ShowAllList';
import HobbyScreen from '../screens/Login/Hobby';
import WebViewPayment from '../screens/Payment/WebViewPayment';
import Calling from '../screens/Call/CallVideo';
import ReviewScreens from '../screens/DetailClass/Review';

import ReviewScreen from '../screens/DetailClass/Review';

const Home = createStackNavigator();
const HomeStack = ({navigation, route}) => {
  React.useLayoutEffect(() => {
    if (route.state && route.state.index > 0) {
      navigation.setOptions({tabBarVisible: false});
    } else {
      navigation.setOptions({tabBarVisible: true});
    }
  }, [navigation, route]);
  const user = useSelector((state) => state.auth.user);
  return (
    <Home.Navigator
      initialRouteName="Home"
      screenOptions={{
        gestureEnabled: Platform.OS === 'ios',
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Home.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Home.Screen
        name="UserCreateRequest"
        component={UserCreateRequest}
        options={{
          headerShown: false,
        }}
      />
      <Home.Screen
        name="DetailTutor"
        component={DetailTutor}
        options={{
          headerShown: false,
        }}
      />
      <Home.Screen
        name="DetailClass"
        component={DetailClass}
        options={{
          headerShown: false,
        }}
      />
      <Home.Screen
        name="TeacherCreateClass"
        component={UserCreateRequest}
        options={{
          headerShown: false,
        }}
      />
      <Home.Screen
        name="ShowAllList"
        component={ShowAllList}
        options={{
          headerShown: false,
        }}
      />

      <Home.Screen
        name="Chat"
        component={Chat}
        options={{
          headerShown: false,
        }}
      />
      <Home.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
      <Home.Screen
        name="Calendar"
        component={Calendar}
        options={{
          headerShown: false,
        }}
      />
      <Home.Screen
        name="Hobby"
        component={HobbyScreen}
        options={{
          headerShown: false,
        }}
      />
      <Home.Screen
        name="Calling"
        component={Calling}
        options={{
          headerShown: false,
        }}
      />
      <Home.Screen
        name="WebViewPayment"
        component={WebViewPayment}
        options={{
          headerShown: false,
        }}
      />
      <Home.Screen
        name={'Review'}
        component={ReviewScreens}
        options={{
          headerShown: false,
        }}
      />
    </Home.Navigator>
  );
};

export default HomeStack;
