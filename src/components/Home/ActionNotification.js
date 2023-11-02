import React, {useEffect} from 'react';
import {View, Alert} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {changeNotificationSelected} from '../../lib/slices/notificationSlice';
import * as RootNavigation from '../../../RootNavigation';

const ActionNotification = (props) => {
  const dispatch = useDispatch();
  const notification = useSelector(
    (state) => state.notification.notificationSelected,
  );

  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    switchActionNotification();
  }, []);
  useEffect(() => {
    switchActionNotification();
  }, [notification]);
  async function switchActionNotification() {
    // message chat
    switch (notification.type) {
      case 'REGISTER_CLASS':
        props.navigation.navigate('Calendar', {
          screen: 'ListRegistry',
          params: {
            _id: notification?.data?.class?._id,
            isNotify: true,
            title: notification?.data?.class?.title,
          },
        });
        dispatch(changeNotificationSelected({}));
        break;
      case 'TEACHER_REQUEST':
        props.navigation.navigate('Calendar', {
          screen: 'DetailRequest',
          params: {
            _id: notification?.data?.class,
            isRequest: true,
          },
        });
        dispatch(changeNotificationSelected({}));
        break;
      case 'ACCEPT_CHANGE_LESSON':
      case 'REJECT_CHANGE_LESSON':
        console.log('11', notification);
        props.navigation.navigate('Calendar', {
          screen: 'DetailRequest',
          params: {
            _idClass: notification?.data?.data?.id,
            title: notification?.data?.data?.title,
            _id: notification?.data?.data?.id,
            isRequest: true,
          },
        });
        break;
      case 'ADMIN_APPROVE_CLASS':
      case 'ADMIN_REJECT_CLASS':
        if (user.access === 'teacher') {
          props.navigation.navigate('Calendar', {
            screen: 'Detail',
            params: {
              _idClass: notification?.data?.data?._id,
              isRequest: false,
              title: notification?.data?.data?.title,
            },
          });
        } else if (user.access === 'student') {
          props.navigation.navigate('Calendar', {
            screen: 'DetailRequest',
            params: {
              _idClass: notification?.data?.data?._id,
              title: notification?.data?.data?.title,
              _id: notification?.data?.data?._id,
              isRequest: true,
            },
          });
        }
        break;
      case 'TEACHER_APPROVE_REGISTER_CLASS':
      case 'TEACHER_REJECT_REGISTER_CLASS':
        props.navigation.navigate('DetailClass', {
          _id: notification?.data?.data?.class?._id,
          title: notification?.data?.data?.class?.title,
        });
        break;
      case 'BALANCE_CHANGE':
        props.navigation.reset({
          index: 0,
          routes: [{name: 'Profile'}],
        });
        break;
      case 'USER_REQUEST_CHANGE_TIME':
        props.navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
        break;
      case 'TEACHER_REMIND_PAYMENT':
        console.log('notification', notification?.data?.isRequest);
        // props.navigation.reset({
        //   index: 0,
        //   routes: [{name: 'Profile'}],
        // });
        if (notification?.data?.isRequest) {
          props.navigation.navigate('Calendar', {
            screen: 'DetailRequest',
            params: {
              _idClass: notification?.data?.id,
              title: notification?.title,
              _id: notification?.data?.id,
              isRequest: true,
            },
          });
        } else {
          props.navigation.navigate('Calendar', {
            screen: 'Detail',
            params: {
              _idClass: notification?.data?.id,
              isRequest: false,
              title: notification?.title,
              isShowStudent: false,
              status: 'ongoing',
            },
          });
        }
        break;
      case 'USER_REQUEST':
      case 'USER_APPROVE_REQUEST':
      case 'TEACHER_REJECT_REQUEST':
      case 'TEACHER_APPROVE_REQUEST':
      case 'USER_REJECT_REQUEST':
        props.navigation.navigate('Calendar', {
          screen: 'DetailRequest',
          params: {
            _id: notification?.data?.class,
            isRequest: true,
          },
        });
        dispatch(changeNotificationSelected({}));
        break;
      case 'ADMIN_NOTIFICATION':
        props.navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
        break;
      case 'LESSON_START':
      case 'CLASS_START_3_DAY':
      case 'CLASS_START':
        props.navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
        break;
      default:
        if (notification?.from?._id && notification?.group) {
          const userInfo = {
            fullName: notification?.from?.fullName,
            avatar: notification?.from?.avatar,
            online: true,
            _id: notification?.from?._id,
            groupChat: notification?.group,
          };
          props.navigation.navigate('Chat', {
            screen: 'InboxChat',
            params: {
              to: userInfo?._id,
              userReceive: userInfo,
              flagTime: new Date().getTime(),
            },
          });
          dispatch(changeNotificationSelected({}));
        }
        break;
    }
    // if (notification?.from?._id && notification?.group) {
    //   const userInfo = {
    //     fullName: notification?.from?.fullName,
    //     avatar: notification?.from?.avatar,
    //     online: true,
    //     _id: notification?.from?._id,
    //     groupChat: notification?.group,
    //   };
    //   props.navigation.navigate('Chat', {
    //     screen: 'InboxChat',
    //     params: {
    //       to: userInfo?._id,
    //       userReceive: userInfo,
    //       flagTime: new Date().getTime(),
    //     },
    //   });
    //   dispatch(changeNotificationSelected({}));
    // }
  }
  return <View></View>;
};
export default ActionNotification;
