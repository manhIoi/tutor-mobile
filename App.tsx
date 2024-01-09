import React, { useEffect, useState } from 'react';
import { StyleSheet, View, LogBox, StatusBar, Platform, Dimensions } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';

import Toast from 'react-native-toast-message'
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider, Text } from 'react-native-elements';
import AuthStack from './src/routes/AuthStack';
import { selectIsUserlogged } from './src/lib/slices/authSlice';
import { selectThemeMode } from './src/lib/slices/settingSlice';
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";
import { navigationRef, isReadyRef } from './RootNavigation';
import ActionNotification from './src/components/Notification/ActionNotification';
import ModalApprove from './src/components/common/ModalMatch';
import SocketIO from "./src/utils/SocketIO";
import ConfigStyle from "./src/theme/ConfigStyle";
import Loading from './src/components/common/Loading';

const width = Dimensions.get('window').width;

const theme = {
  Text: {
    style: {
      fontFamily: Platform.OS === 'android' ? 'Segoe-UI' : null,
      color: '#333333',
      fontSize: width < 330 ? 0.8 * 12 : 12
    }
  }
};
const App = (props) => {
  LogBox.ignoreAllLogs() // hide warning
  const routeNameRef = React.useRef();
  const isUserLogged = useSelector(selectIsUserlogged);
  const isDarkMode = useSelector(selectThemeMode);
  const user = useSelector(state => state.auth.user);
  const modal = useSelector(state => state.modal);
  const { isShowApprovePopup, isShowLoading, } = modal || {}


  console.log(`🔥LOG_IT:: isShowApprovePopup`, isShowApprovePopup)

  useEffect(() => {
    SocketIO.connect();
  }, [])

  useEffect(() => {
    if (user?._id) {
      console.info(`LOG_IT:: notify_${user?._id}`,);
      SocketIO.on(`notify_${user?._id}`, data => {
        console.info(`LOG_IT::  notify_ data`, data);
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: data?.message,
        });
      })
      SocketIO.on(`become_teacher_${user?._id}`, data => {
        console.info(`LOG_IT::  notify_ data`, data);
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: data?.message,
        });
      })
      SocketIO.on(`vote_teacher_${user?._id}`, data => {
        console.info(`LOG_IT::  notify_ data`, data);
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: data?.message,
        });
      })
    }
  }, [user]);

  async function requestUserPermission() {
    // const authStatus = await messaging().requestPermission();
    // const enabled =
    //   authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //   authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  }

  return (
    <ThemeProvider theme={theme}>
      <View style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
        />
        <NavigationContainer
          ref={navigationRef}
          onStateChange={async () => {
            const previousRouteName = routeNameRef.current;
            const currentRouteName = navigationRef.current.getCurrentRoute().name;
            routeNameRef.current = currentRouteName;
          }}
          onReady={() => {
            isReadyRef.current = true;
            routeNameRef.current = navigationRef.current.getCurrentRoute().name;
          }}
          theme={isDarkMode ? DarkTheme : DefaultTheme}>
          {!isUserLogged ? <AuthStack /> : <BottomTabNavigator />}
        </NavigationContainer>
        <ActionNotification />
        <Toast ref={(ref) => Toast.setRef(ref)} />
        {isShowApprovePopup ? <ModalApprove /> : null}
        {isShowLoading ? <Loading /> : null}
      </View>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
