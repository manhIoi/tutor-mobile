import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {Platform} from 'react-native';
import UserProfileScreen from '../screens/UserProfile/UserProfileScreen';
import FamilyProfilesScreen from '../screens/FamilyAccount/FamilyProfiles';
import FamilyAccountScreen from '../screens/FamilyAccount/FamilyProfileAccountScreen';
import AddFamilyProfileScreen from '../screens/FamilyAccount/AddFamilyProfileScreen';
import AccountScreen from '../screens/UserProfile/UserProfileAccountScreen';
import NotificationScreen from '../screens/Notification/NotificationScreen';
import ChangePasswordScreen from '../screens/UserProfile/ChangePasswordScreen';
import HobbyForm from '../screens/FamilyAccount/HobbyScreen';
import BecomeExpertStepOne from '../screens/BecomeExpert/BecomeExpertStepOne';
import BecomeExpertStepTwo from '../screens/BecomeExpert/BecomeExpertStepTwo';
import BecomeExpertStepThree from '../screens/BecomeExpert/BecomeExpertStepThree';
import PaymentScreen from '../screens/Payment/PaymentScreen';
import UpdateSuccessScreen from '../screens/FamilyAccount/UpdateSuccessScreen';
import Calling from '../screens/Call/CallVideo';
import WebViewPayment from '../screens/Payment/WebViewPayment';

import Chat from './ChatStack';

const Profile = createStackNavigator();
const HomeStack = ({navigation, route}) => {
  React.useLayoutEffect(() => {
    if (route.state && route.state.index > 0) {
      navigation.setOptions({tabBarVisible: false});
    } else {
      navigation.setOptions({tabBarVisible: true});
    }
  }, [navigation, route]);
  return (
    <Profile.Navigator
      initialRouteName="Profile"
      screenOptions={{
        gestureEnabled: Platform.OS === 'ios',
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Profile.Screen
        name="Profile"
        component={UserProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Profile.Screen
        name="FamilyProfile"
        component={FamilyProfilesScreen}
        options={{
          headerShown: false,
        }}
      />
      <Profile.Screen
        name="FamilyAccount"
        component={FamilyAccountScreen}
        options={{
          headerShown: false,
        }}
      />
      <Profile.Screen
        name="AddFamilyAccount"
        component={AddFamilyProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Profile.Screen
        name="Account"
        component={AccountScreen}
        options={{
          headerShown: false,
        }}
      />
      <Profile.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          headerShown: false,
        }}
      />
      <Profile.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          headerShown: false,
        }}
      />
      <Profile.Screen
        name="Hobby"
        component={HobbyForm}
        options={{
          headerShown: false,
        }}
      />
      <Profile.Screen
        name="BecomeExpertStepOne"
        component={BecomeExpertStepOne}
        options={{
          headerShown: false,
        }}
      />
      <Profile.Screen
        name="BecomeExpertStepTwo"
        component={BecomeExpertStepTwo}
        options={{
          headerShown: false,
        }}
      />
      <Profile.Screen
        name="BecomeExpertStepThree"
        component={BecomeExpertStepThree}
        options={{
          headerShown: false,
        }}
      />
      <Profile.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          headerShown: false,
        }}
      />
      <Profile.Screen
        name="UpdateSuccess"
        component={UpdateSuccessScreen}
        options={{
          headerShown: false,
        }}
      />
      <Profile.Screen
        name="Chat"
        component={Chat}
        options={{
          headerShown: false,
        }}
      />
      <Profile.Screen
        name="Calling"
        component={Calling}
        options={{
          headerShown: false,
        }}
      />
      <Profile.Screen
        name="WebViewPayment"
        component={WebViewPayment}
        options={{
          headerShown: false,
        }}
      />
    </Profile.Navigator>
  );
};

export default HomeStack;
