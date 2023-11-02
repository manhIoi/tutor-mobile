// import PushNotification from 'react-native-push-notification';
// import PushNotificationIOS from '@react-native-community/push-notification-ios';
// import {Platform} from 'react-native';
// import {
//   changeNotificationSelected,
//   updateNewNotification,
// } from '../lib/slices/notificationSlice';
// import * as RootNavigation from '../../RootNavigation';

class LocalNotificationService {
  // configure = (onOpenNotification, dispatch) => {
  //   PushNotification.configure({
  //     onRegister: function (token) {
  //       console.log('[LocalNotificationService] onRegister:', token);
  //     },
  //     onNotification: function (notification) {
  //       console.log(
  //         '[LocalNotificationService] onNotification: [LocalNotificationService] onNotification',
  //       );
  //       console.log(notification);
  //       if (!notification?.data) {
  //         return;
  //       }
  //       if (
  //         (notification.action === 'Xem ngay' &&
  //           notification?.data.type === 'REGISTER_CLASS') ||
  //         (notification?.data.type === 'REGISTER_CLASS' && !notification.action)
  //       ) {
  //         RootNavigation.navigate('Calendar', {
  //           screen: 'ListRegistry',
  //           params: {
  //             _id: notification?.data?.data?.class?._id,
  //             title: notification?.data?.data?.class?.title,
  //             isNotify: true,
  //           },
  //         });
  //         cancelLocalNotifications(notification?.id);
  //       }
  //       if (
  //         (notification.action === 'Xem ngay' &&
  //           notification?.data.type === 'ACCEPT_CHANGE_LESSON') ||
  //         (notification?.data.type === 'ACCEPT_CHANGE_LESSON' &&
  //           !notification.action) ||
  //         (notification.action === 'Xem ngay' &&
  //           notification?.data.type === 'REJECT_CHANGE_LESSON') ||
  //         (notification?.data.type === 'REJECT_CHANGE_LESSON' &&
  //           !notification.action)
  //       ) {
  //         console.log(notification?.data?.data);
  //         RootNavigation.navigate('Calendar', {
  //           screen: 'DetailRequest',
  //           params: {
  //             _idClass: notification?.data?.data?.id,
  //             title: notification?.data?.data?.title,
  //             _id: notification?.data?.data?.id,
  //             isRequest: true,
  //           },
  //         });
  //       }
  //       if (
  //         (notification.action === 'Xem ngay' &&
  //           notification?.data.type === 'TEACHER_REQUEST') ||
  //         (notification?.data.type === 'TEACHER_REQUEST' &&
  //           !notification.action)
  //       ) {
  //         RootNavigation.navigate('Calendar', {
  //           screen: 'DetailRequest',
  //           params: {
  //             _idClass: notification?.data?.data?._id,
  //             title: notification?.data?.data?.title,
  //             _id: notification?.data?.data?.class?._id,
  //             isRequest: true,
  //           },
  //         });
  //         cancelLocalNotifications(notification?.id);
  //       }
  //       if (
  //         (notification.action === 'Xem ngay' &&
  //           notification?.data.type === 'USER_REQUEST') ||
  //         (notification?.data.type === 'USER_REQUEST' && !notification.action)
  //       ) {
  //         console.log('USER_REQUEST', notification);
  //         RootNavigation.navigate('Calendar', {
  //           screen: 'DetailRequest',
  //           params: {
  //             _idClass: notification?.data?.data?.class._id,
  //             title: notification?.data?.data?.title,
  //             _id: notification?.data?.data?.class?._id,
  //             isRequest: true,
  //           },
  //         });
  //         cancelLocalNotifications(notification?.id);
  //       }
  //       if (
  //         (notification.action === 'Xem ngay' &&
  //           notification?.data.type === 'USER_REJECT_REQUEST') ||
  //         (notification?.data.type === 'USER_REJECT_REQUEST' &&
  //           !notification.action) ||
  //         (notification.action === 'Xem ngay' &&
  //           notification?.data.type === 'USER_APPROVE_REQUEST') ||
  //         (notification?.data.type === 'USER_APPROVE_REQUEST' &&
  //           !notification.action)
  //       ) {
  //         console.log(1111111);
  //         RootNavigation.navigate('Calendar', {
  //           screen: 'DetailRequest',
  //           params: {
  //             _idClass: notification?.data?.data?.class?._id,
  //             title: notification?.data?.data?.title,
  //             _id: notification?.data?.data?.class?._id,
  //             isRequest: true,
  //           },
  //         });
  //         cancelLocalNotifications(notification?.id);
  //       }
  //       if (
  //         (notification.action === 'Xem ngay' &&
  //           notification?.data.type === 'TEACHER_REJECT_REQUEST') ||
  //         (notification?.data.type === 'TEACHER_REJECT_REQUEST' &&
  //           !notification.action) ||
  //         (notification.action === 'Xem ngay' &&
  //           notification?.data.type === 'TEACHER_APPROVE_REQUEST') ||
  //         (notification?.data.type === 'TEACHER_APPROVE_REQUEST' &&
  //           !notification.action)
  //       ) {
  //         RootNavigation.navigate('Calendar', {
  //           screen: 'DetailRequest',
  //           params: {
  //             _idClass: notification?.data?.data?._id,
  //             title: notification?.data?.data?.title,
  //             _id: notification?.data?.data?.class?._id,
  //             isRequest: true,
  //           },
  //         });
  //         cancelLocalNotifications(notification?.id);
  //       }
  //       if (
  //         (notification.action === 'Xem ngay' &&
  //           notification?.data.type === 'CLASS_IS_FULLED') ||
  //         (notification?.data.type === 'CLASS_IS_FULLED' &&
  //           !notification.action)
  //       ) {
  //         RootNavigation.navigate('Calendar', {
  //           screen: 'Detail',
  //           params: {
  //             _idClass: notification?.data?.data?.class?._id,
  //             isRequest: false,
  //             title: notification?.data?.data?.title,
  //           },
  //         });
  //         cancelLocalNotifications(notification?.id);
  //       }
  //       if (
  //         (notification.action === 'Xem ngay' &&
  //           notification?.data.type === 'TEACHER_APPROVE_REGISTER_CLASS') ||
  //         (notification?.data.type === 'TEACHER_APPROVE_REGISTER_CLASS' &&
  //           !notification.action)
  //       ) {
  //         RootNavigation.navigate('Calendar', {
  //           screen: 'DetailClass',
  //           params: {
  //             _id: notification?.data?.data?.class?._id,
  //           },
  //         });
  //         cancelLocalNotifications(notification?.id);
  //       }
  //       if (
  //         (notification.action === 'Xem ngay' &&
  //           notification?.data.type === 'TEACHER_REJECT_REGISTER_CLASS') ||
  //         (notification?.data.type === 'TEACHER_REJECT_REGISTER_CLASS' &&
  //           !notification.action)
  //       ) {
  //         RootNavigation.navigate('Calendar', {
  //           screen: 'DetailClass',
  //           params: {
  //             _id: notification?.data?.data?.class?._id,
  //           },
  //         });
  //         cancelLocalNotifications(notification?.id);
  //       }
  //       if (
  //         (notification.action === 'Xem ngay' &&
  //           notification?.data.type === 'USER_REQUEST_CHANGE_TIME') ||
  //         (notification?.data.type === 'USER_REQUEST_CHANGE_TIME' &&
  //           !notification.action)
  //       ) {
  //         console.log(notification?.data);
  //         RootNavigation.navigate('Menu', {
  //           screen: 'Notification',
  //         });
  //         cancelLocalNotifications(notification?.id);
  //       }
  //       if (
  //         (notification.action === 'Xem ngay' &&
  //           (notification?.data.type === 'ADMIN_APPROVE_CLASS' ||
  //             notification?.data.type === 'ADMIN_REJECT_CLASS')) ||
  //         ((notification?.data.type === 'ADMIN_APPROVE_CLASS' ||
  //           notification?.data.type === 'ADMIN_REJECT_CLASS') &&
  //           !notification.action)
  //       ) {
  //         console.log(notification?.data?.data);
  //         if (notification?.data?.data?.access === 'teacher') {
  //           RootNavigation.navigate('Calendar', {
  //             screen: 'Detail',
  //             params: {
  //               _idClass: notification?.data?.data?.class?._id,
  //               isRequest: false,
  //               title: notification?.data?.data?.title,
  //             },
  //           });
  //           cancelLocalNotifications(notification?.id);
  //         } else if (notification?.data?.data?.access === 'student') {
  //           RootNavigation.navigate('Calendar', {
  //             screen: 'DetailRequest',
  //             params: {
  //               _idClass: notification?.data?.data?.class?._id,
  //               title: notification?.data?.data?.class?.title,
  //               _id: notification?.data?.data?.class?._id,
  //               isRequest: true,
  //             },
  //           });
  //           cancelLocalNotifications(notification?.id);
  //         }
  //       }
  //       const notificationsData = notification?.data?.data;
  //       if (
  //         (notification.action === 'Xem ngay' &&
  //           notificationsData?.type === 'TEACHER_REMIND_PAYMENT') ||
  //         (notificationsData?.type === 'TEACHER_REMIND_PAYMENT' &&
  //           !notification.action)
  //       ) {
  //         // console.log(1111)
  //         // console.log('notification',notification);
  //         if (notificationsData?.isRequest) {
  //           RootNavigation.navigate('Calendar', {
  //             screen: 'DetailRequest',
  //             params: {
  //               _idClass: notificationsData?.id,
  //               title: notificationsData?.title,
  //               _id: notificationsData?.id,
  //               isRequest: true,
  //             },
  //           });
  //         } else {
  //           RootNavigation.navigate('Calendar', {
  //             screen: 'Detail',
  //             params: {
  //               _idClass: notificationsData?.id,
  //               isRequest: false,
  //               title: notificationsData?.title,
  //               isShowStudent: false,
  //               status: 'ongoing',
  //             },
  //           });
  //         }
  //         cancelLocalNotifications(notification?.id);
  //       }
  //       if (
  //         (notification.action === 'Xem ngay' &&
  //           notification?.data.type === 'NEW_MESSAGE') ||
  //         (notification?.data.type === 'NEW_MESSAGE' && !notification.action)
  //       ) {
  //         const userInfo = {
  //           fullName: notification?.data?.from?.fullName,
  //           avatar: notification?.data?.from?.avatar,
  //           online: true,
  //           _id: notification?.data?.from?._id,
  //           groupChat: notification?.data?.group,
  //         };
  //         onOpenNotification({
  //           screen: 'InboxChat',
  //           params: {
  //             to: userInfo?._id,
  //             userReceive: userInfo,
  //             flagTime: new Date().getTime(),
  //           },
  //         });
  //         cancelLocalNotifications(notification?.id);
  //       } else if (notification.action === 'Bỏ qua') {
  //         cancelLocalNotifications(notification?.id);
  //       }
  //       notification.userInteraction = true;
  //       if (Platform.OS === 'ios') {
  //         // (required) Called when a remote is received or opened, or local notification is opened
  //         notification.finish(PushNotificationIOS.FetchResult.NoData);
  //       }
  //     },
  //     // IOS ONLY (optional): default: all - Permissions to register.
  //     permissions: {
  //       alert: true,
  //       badge: true,
  //       sound: true,
  //     },
  //     // Should the initial notification be popped automatically
  //     // default: true
  //     popInitialNotification: true,
  //     /**
  //      * (optional) default: true
  //      * - Specified if permissions (ios) and token (android and ios) will requested or not,
  //      * - if not, you must call PushNotificationsHandler.requestPermissions() later
  //      * - if you are not using remote notification or do not have Firebase installed, use this:
  //      *     requestPermissions: Platform.OS === 'ios'
  //      */
  //     requestPermissions: true,
  //   });
  // };
  // unregister = () => {
  //   PushNotification.unregister();
  // };
  // showNotification = (channelId, title, message, data = {}, options = {}) => {
  //   PushNotification.localNotification({
  //     //   /* Android Only Properties */
  //     ...this.buildAndroidNotification(
  //       channelId,
  //       title,
  //       message,
  //       data,
  //       options,
  //     ),
  //     //   /* iOS and Android properties */
  //     ...this.buildIOSNotification(channelId, title, message, data, options),
  //     //   /* iOS and Android properties */
  //     channelId: 'NEW_MESSAGE', // (required) channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
  //     // ticker: 'My Notification Ticker', // (optional)
  //     largeIcon: 'ic_launcher', // (optional) default: "ic_launcher". Use "" for no large icon.
  //     largeIconUrl: options.largeIconUrl, // (optional) default: undefined
  //     smallIcon: '', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
  //     bigText: message, // (optional) default: "message" prop
  //     subText: 'Tin nhắn mới', // (optional) default: none
  //     bigPictureUrl: options.bigPictureUrl, // (optional) default: undefined
  //     vibrate: true, // (optional) default: true
  //     vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
  //     priority: 'high', // (optional) set notification priority, default: high
  //     visibility: 'public', // (optional) set notification visibility, default: private
  //     actions: ['Xem ngay', 'Bỏ qua'], // (Android only) See the doc for notification actions to know more
  //     title: title, // (optional)
  //     message: message, // (required)
  //     userInfo: data, // (optional) default: {} (using null throws a JSON value '<null>' error)
  //     data: data,
  //   });
  // };
  // createChannel = (id, name, importance = 4, vibrate = true) => {
  //   PushNotification.createChannel(
  //     {
  //       channelId: 'NEW_MESSAGE', // (required)
  //       channelName: 'New message', // (required)
  //       // channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
  //       soundName: 'notification.mp3', // (optional) See soundName parameter of localNotification function
  //       importance: 4, // (optional) default: 4. Int value of the Android notification importance
  //       vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  //     },
  //     (created) => {
  //       console.log(created);
  //     }, // (optional) callback returns whether the channel was created, false means it already existed.
  //   );
  // };
  // buildAndroidNotification = (
  //   channelId,
  //   title,
  //   message,
  //   data = {},
  //   options = {},
  // ) => {
  //   return {
  //     channelId: channelId,
  //     autoCancel: true,
  //     largeIconUrl: options.largeIconUrl || 'ic_launcher',
  //     smallIcon: options.smallIcon || 'ic_launcher',
  //     bigText: message || '',
  //     subText: title || '',
  //     vibrate: options.vibrate || true,
  //     vibration: options.vibration || 300,
  //     priority: options.priority || 'high',
  //     importance: options.importance || 'high', // (optional) set notification importance, default: high,
  //     data: data,
  //     actions: ['Xem ngay', 'Bỏ qua'],
  //   };
  // };
  // buildIOSNotification = (
  //   channelId,
  //   title,
  //   message,
  //   data = {},
  //   options = {},
  // ) => {
  //   console.log('vvvvvvv');
  //   return {
  //     alertAction: options.alertAction || 'view',
  //     category: options.category || '',
  //     userInfo: {
  //       channelId: channelId,
  //       item: data,
  //     },
  //   };
  // };
  // cancelAll = () => {
  //   PushNotification.cancelAllLocalNotifications();
  // };
  // cancelAllLocalNotifications = () => {
  //   if (Platform.OS === 'ios') {
  //     PushNotificationIOS.removeAllDeliveredNotifications();
  //   } else {
  //     PushNotification.cancelAllLocalNotifications();
  //   }
  // };
  // removeDeliveredNotificationByID = (notificationId) => {
  //   console.log(
  //     '[LocalNotificationService] removeDeliveredNotificationByID: ',
  //     notificationId,
  //   );
  //   PushNotification.cancelLocalNotifications({id: `${notificationId}`});
  // };
}
// function cancelAll() {
//   PushNotification.cancelAllLocalNotifications();
// }

// function cancelLocalNotifications(id) {
//   PushNotification.cancelLocalNotifications({id});
// }

export const localNotificationService = new LocalNotificationService();
