import React, {useEffect, useState} from 'react';
import {StyleSheet, View, LogBox, StatusBar, Platform, Dimensions} from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';

import Toast from 'react-native-toast-message'
import { useSelector, useDispatch} from 'react-redux';
import { ThemeProvider, Text } from 'react-native-elements';
// import messaging from '@react-native-firebase/messaging';
// import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { NetworkInfo } from "react-native-network-info";
import AuthStack from './src/routes/AuthStack';
import LoadingScreen from './src/screens/Loading/LoadingScreen';
import useCachedResources from './src/hooks/useCachedResources';
import { selectIsUserlogged, updateBalance} from './src/lib/slices/authSlice';
import { selectThemeMode } from './src/lib/slices/settingSlice';
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";
import {displayedNewMessage} from './src/lib/slices/socketSlice';
import MiniCallStream from "./src/components/Call/MiniCallStream";
import { navigationRef, isReadyRef } from './RootNavigation';
// import {fcmService} from './src/utils/FCMService';
// import {localNotificationService} from './src/utils/LocalNotificationService';
import {IP_ADDRESS} from './src/utils/auth.util';
import ActionNotification from './src/components/Notification/ActionNotification';
import ModalMatch from './src/components/common/ModalMatch';
import SocketIO from "./src/utils/SocketIO";

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
    const isLoadingComplete = useCachedResources();
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const onCallView = useSelector(state => state.calling.onCallView);
    const newNotification = useSelector(state => state.socket.newNotification);
    const [classData, setClass] = useState([])
    const notification = useSelector(
      (state) => state.notification.newNotifications,
    );
    const [isShow, setShow] = useState(false);

    useEffect(() => {
        SocketIO.connect();
    }, [])

    const handleShow = ()=>{
      setShow(false);
    }
    // useEffect(() => {
    //   if  (newNotification?.from?.id
    //     && user?._id
    //     && newNotification?.from?.id !== user?._id) {
    //     dispatch(displayedNewMessage());
    //   }
    // }, [newNotification])
    // useEffect(() => {
    //  //  if()
    //  // console.log('1newNotification',newNotification)
    //  //  const data = JSON?.parse(JSON.stringify(notification));
    //   if(notification.type ==='USER_REQUEST_CHANGE_TIME' && user?.access ==='teacher')
    //   setShow(true);
    //   setClass(notification);
    // }, [notification])
    async function requestUserPermission() {
      // const authStatus = await messaging().requestPermission();
      // const enabled =
      //   authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      //   authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    }
  // useEffect(() => {
  //   // PushNotificationIOS.addEventListener('notification', onRemoteNotification);
  //   // fcmService.registerAppWithFCM();
  //   // fcmService.register(onRegister, onNotification, onOpenNotification);
  //   // localNotificationService.configure(onOpenNotification, dispatch);
  //   function onRegister() {
  //   }
  //   function onOpenNotification(navigation) {
  //     if (navigation.screen) {
  //       props.Navigation(navigation);
  //     } else {
  //       if (navigation?.data?.data) {
  //         const data = JSON.parse(navigation.data.data);
  //         const userInfo = {
  //           fullName: data?.from?.fullName,
  //           avatar: data?.from?.avatar,
  //           online: true,
  //           _id: data?.from?._id,
  //           groupChat: data?.group,
  //         };
  //         props.Navigation({
  //           screen: 'InboxChat',
  //           params: {
  //             to: userInfo?._id,
  //             userReceive: userInfo,
  //             flagTime: new Date().getTime(),
  //           },
  //         });
  //       }
  //     }
  //   }
  //   function onNotification(notify) {
  //   }

  //   NetworkInfo.getIPAddress().then(async (ipAddress) => {
  //     await IP_ADDRESS.set(ipAddress);
  //   });

  //   return () => {
  //     fcmService.unRegister();
  //     localNotificationService.unregister();
  //   };
  // }, []);

  const onRemoteNotification = (notification) => {
    const actionIdentifier = notification.getActionIdentifier();

    if (actionIdentifier === 'open') {
      // Perform action based on open action
    }

    if (actionIdentifier === 'text') {
      // Text that of user input.
      const userText = notification.getUserText();
      // Perform action based on textinput action
    }
  };

    // useEffect(() => {
    //   requestUserPermission();
    //   // const unsubscribe = messaging().onMessage(async remoteMessage => {

    //   // });
    //   return () => {
    //     isReadyRef.current = false
    //   };
    // }, []);
    // if (!isLoadingComplete) {
    //     // if (isLoadingComplete) {
    //     // return <SplashScreen/>;
    //     return <LoadingScreen />;
    // }
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
                    // if (previousRouteName !== currentRouteName) {
                    //     await analytics().logScreenView({
                    //         screen_name: currentRouteName,
                    //         screen_class: currentRouteName,
                    //     });
                    // }
                    routeNameRef.current = currentRouteName;
                }}
                onReady={() => {
                  isReadyRef.current = true;
                  routeNameRef.current = navigationRef.current.getCurrentRoute().name;
                }}
                theme={isDarkMode ? DarkTheme : DefaultTheme}>
                {!isUserLogged  ?  <AuthStack /> : <BottomTabNavigator /> }
              </NavigationContainer>
              {
                onCallView ? (
                  <MiniCallStream />
                ) : null
              }

              <ActionNotification />

              <Toast ref={(ref) => Toast.setRef(ref)} />
                <ModalMatch data={classData}
                status={1}
                isModalVisible={isShow}
                action={handleShow} />

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
