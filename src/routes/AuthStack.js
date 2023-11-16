import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {Platform} from 'react-native';
import SplashScreen from '../screens/Login/SplashScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import ForgotPasswordScreen from '../screens/Login/ForgotPasswordScreen';
import InputVerifyCodeScreen from '../screens/Login/InputVerifyCodeScreen';
import ResetPassword from '../screens/Login/ResetPassword';
import Register from '../screens/register/Register';
import TestPicker from '../components/TestPicker';
import HomeScreen from '../screens/UserHome/HomeScreen';
import HobbyScreen from '../screens/Login/Hobby';

const Auth = createStackNavigator();

const AuthStack = () => {
  return (
    <Auth.Navigator
      initialRouteName="Login"
      screenOptions={{
        gestureEnabled: Platform.OS === 'ios',
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Auth.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{
          headerShown: false,
        }}
      />
      <Auth.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Auth.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{
          headerShown: false,
        }}
      />
      <Auth.Screen
        name="InputVerifyCodeScreen"
        component={InputVerifyCodeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Auth.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          headerShown: false,
        }}
      />
      <Auth.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: false,
        }}
      />
      <Auth.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Auth.Screen
        name="Hobby"
        component={HobbyScreen}
        options={{
          headerShown: false,
        }}
      />
    </Auth.Navigator>
  );
};

export default AuthStack;
