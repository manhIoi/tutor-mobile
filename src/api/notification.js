// import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import {callApiNotification} from '../utils/apiCaller.util';
import {DEVICE_TOKEN, USER_TOKEN} from '../utils/auth.util';
import {localNotificationService} from '../utils/LocalNotificationService';

function updateDeviceToken(data) {
  return callApiNotification('/device-token', 'post', data);
}

async function actionUpdateDeviceToken(data) {
  try {
    const response = await updateDeviceToken(data);
  } catch (error) {
    console.log('actionUpdateDeviceToken ++>', error);
  }
}

export async function handleGetDeviceToken() {
  // const token = await USER_TOKEN.get();
  // if (token) {
  //   const authorizationStatus = await messaging().requestPermission();
  //   if (Platform.OS === 'ios') {
  //     if (authorizationStatus) {
  //       const tokenDevice = await messaging().getToken();
  //       const data = {
  //         token: tokenDevice,
  //         platform: 'ios',
  //       };
  //       await actionUpdateDeviceToken(data);
  //       await DEVICE_TOKEN.set(tokenDevice);
  //     } else {
  //       await messaging()
  //         .requestPermission()
  //         .then(async () => {
  //           const tokenDevice = await messaging().getToken();
  //           const data = {
  //             token: tokenDevice,
  //             platform: 'ios',
  //           };
  //           await actionUpdateDeviceToken(data);
  //           await DEVICE_TOKEN.set(tokenDevice);
  //         })
  //         .catch((error) => {
  //           console.log('[FCMService] Request Permission rejected ', error);
  //         });
  //     }
  //   } else {
  //     const enabled =
  //       authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL;
  //     if (enabled) {
  //       const tokenDevice = await messaging().getToken();
  //       const data = {
  //         token: tokenDevice,
  //         platform: Platform.OS,
  //       };
  //       await actionUpdateDeviceToken(data);
  //       await DEVICE_TOKEN.set(tokenDevice);
  //     }
  //   }
  // }
}

export async function removeDeviceToken() {
  const token = await DEVICE_TOKEN.get();
  return callApiNotification('/device-token', 'delete', {token: token});
}

export async function pushLocalNotificationChat(data) {
  //   try {
  //     const dataMessage = {
  //       type: 'NEW_MESSAGE',
  //       from: {
  //         _id: data?.from?._id,
  //         avatar: data?.from?.avatar,
  //         fullName: data?.from?.fullName,
  //         isOnline: data?.from?.isOnline,
  //       },
  //       group: data?.group,
  //     };
  //     const channelId = 'NEW_MASSAGE';
  //     const options = {
  //       largeIconUrl: dataMessage?.from?.avatar,
  //       vibrate: true,
  //       soundName: 'notification.mp3',
  //       playSound: 'notification.mp3',
  //       subText: 'Tin nhắn mới',
  //       smallIcon: 'ic_launcher',
  //       bigPictureUrl: data?.images?.[0]?.large,
  //     };
  //     const bigText = `Tin nhắn mới từ : ${data?.from?.fullName}`;
  //     const subText = data?.content
  //       ? data.content
  //       : data?.images?.length
  //       ? `${data?.images?.length} [Hình ảnh]`
  //       : data?.files?.length
  //       ? `${data?.files?.length} [Tập tin]`
  //       : '';
  //     await localNotificationService.createChannel(channelId, 'New message');
  //     await localNotificationService.showNotification(
  //       channelId,
  //       bigText,
  //       subText,
  //       dataMessage,
  //       options,
  //     );
  //   } catch (error) {
  //     console.log('pushLocalNotificationChat ==>');
  //   }
}
export async function pushLocalNotification(data) {
  //   try {
  //     const dataMessage = {
  //       type: data?.type,
  //       data: {
  //         ...data?.data,
  //         type: data?.type,
  //         access: data?.access,
  //       },
  //     };
  //     const channelId = data?.type || 'NEW_NOTIFICATION';
  //     const options = {
  //       vibrate: true,
  //       soundName: 'notification.mp3',
  //       playSound: 'notification.mp3',
  //       subText: 'Thông báo',
  //       smallIcon: 'ic_launcher',
  //     };
  //     const bigText = data?.title || 'Thông báo mới';
  //     const subText = data?.body;
  //     await localNotificationService.createChannel(channelId, channelId);
  //     await localNotificationService.showNotification(
  //       channelId,
  //       bigText,
  //       subText,
  //       dataMessage,
  //       options,
  //     );
  //   } catch (error) {
  //     console.log('pushLocalNotification =>');
  //   }
}

export async function getNotificationStatistic() {
  return callApiNotification('/notification/statistic');
}
export async function userNotification() {
  return callApiNotification(`/user-notification`);
}
export async function userUpdateNotification(data) {
  return callApiNotification(`/user-notification/edit`, 'put', data);
}
