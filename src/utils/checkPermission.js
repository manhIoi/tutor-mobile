import {Platform, Linking} from 'react-native';
import {
  checkNotifications,
  requestNotifications,
  PERMISSIONS,
  checkMultiple,
  requestMultiple,
} from 'react-native-permissions';

export async function checkNotificationStatus() {
  console.log('checkNotificationStatus');
  checkNotifications().then(({status, settings}) => {
    console.log(`status :${status}`);
    console.log(settings);
    if (status !== 'granted') {
      requestNotifications(['alert', 'lockScreen', 'badge', 'sound']).then(
        ({status, settings}) => {
          console.log(`requestNotifications : ${status}`);
        },
      );
    }
  });
  // if(Platform.OS === 'ios'){
  //   await Linking.openURL('app-settings://')
  // } else {
  //   await Linking.openSettings();
  // }
}
export async function requestPermissionCall(hasVideo = true) {
  let checkPermission = [];
  if (Platform.OS === 'ios') {
    if (hasVideo) {
      checkPermission = [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE];
    } else {
      checkPermission = [PERMISSIONS.IOS.MICROPHONE];
    }
  } else {
    if (hasVideo) {
      checkPermission = [
        PERMISSIONS.ANDROID.RECORD_AUDIO,
        PERMISSIONS.ANDROID.CAMERA,
      ];
    } else {
      checkPermission = [PERMISSIONS.ANDROID.RECORD_AUDIO];
    }
  }
  requestMultiple(checkPermission).then((statuses) => {
    console.log('statuses requestMultiple ');
    console.log(statuses);
    if (Platform.OS === 'ios') {
      if (
        statuses[PERMISSIONS.IOS.MICROPHONE] === 'granted' &&
        (!statuses[PERMISSIONS.IOS.CAMERA] ||
          statuses[PERMISSIONS.IOS.CAMERA] === 'granted')
      )
        return true;
      return false;
    }
    if (
      statuses[PERMISSIONS.ANDROID.RECORD_AUDIO] === 'granted' &&
      (!statuses[PERMISSIONS.ANDROID.CAMERA] ||
        statuses[PERMISSIONS.ANDROID.CAMERA] === 'granted')
    )
      return true;
    return false;
  });
}
