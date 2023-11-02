import React from 'react';
import {AppRegistry, StatusBar} from 'react-native';
import { Provider } from 'react-redux';
// import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';
import store from './store'
import * as RootNavigation from './RootNavigation';

AppRegistry.registerHeadlessTask('ReactNativeFirebaseMessagingHeadlessTask', () => backgroundNotificationHandler)
const backgroundNotificationHandler = async () => message => {
  return Promise.resolve()
}


const appRoot = () => (<Provider store={store}>
  <StatusBar
    translucent
    backgroundColor="#f00"
  />
  <App
    Navigation={navigate => {
      RootNavigation.navigate('Chat', navigate)
    }}
  />
</Provider>)

AppRegistry.registerComponent(appName, () => appRoot);
