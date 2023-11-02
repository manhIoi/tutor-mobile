import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useDispatch, useSelector} from 'react-redux';
import {useState} from 'react';
import {func} from 'prop-types';
import TabBarIcon from '../components/TabBarIcon/TabBarIcon';
import Colors from '../../constants/Colors';
import HomeStack from '../routes/HomeStack';
import ChatStack from '../routes/ChatStack';
import ProfileStack from '../routes/ProfileStack';
import CalendarStack from '../routes/CalendarStack';
import Socket from '../utils/socket';
import config from '../../config/config';
import {setCurrentUser, updateNewMessage} from '../lib/slices/socketSlice';
import {updateRequestCall} from '../lib/slices/callSlice';
import {handleGetDeviceToken, userNotification} from '../api/notification';
import {updateBalance} from '../lib/slices/authSlice';
import {
  changePaymentResult,
  changeNotificationSelected,
  updateNewNotification,
  updateNumberNotify,
  changeNotiStatus,
} from '../lib/slices/notificationSlice';
import {SOCKET_ID} from '../utils/auth.util';
import {getBalance} from '../api/payment';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator() {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(new Socket(config.SOCKET_HOST));
  const chatState = useSelector((state) => state.socket);
  const user = useSelector((state) => state.auth.user);
  const notify = useSelector((state) => state.notification.notiUpdate);

  async function userGetNotification() {
    try {
      const response = await userNotification();
      dispatch(changeNotiStatus(response));
    } catch (error) {
      console.log(error);
    }
  }
  async function getBalances() {
    try {
      if (user?.access === 'teacher') {
        const response = await getBalance();
        dispatch(updateBalance(response.balance));
      }
    } catch (error) {
      console.log(error);
    }
  }
  React.useEffect(() => {
    getBalances();
    userGetNotification();
    handleGetDeviceToken();
    const currentUser = {
      _id: user._id,
      access: user?.type,
      notify: notify?.notification,
    };
    dispatch(setCurrentUser(currentUser));
    if (socket) {
      socket.connect();
      socket.on('message_chat', (event) => {
        dispatch(updateNewMessage(event));
      });
      socket.on('PAYMENT_SUCCESS', (event) => {
        // 18 Toast
        dispatch(changePaymentResult(event));
      });
      socket.on('WITHDRAW_FAILED', (event) => {
        // 18 Toast
        dispatch(changePaymentResult(event));
      });
      socket.on('WITHDRAW_SUCCESS', (event) => {
        // 18 Toast
        dispatch(changePaymentResult(event));
      });
      socket.on('BALANCE_CHANGE', (event) => {
        // 19
        dispatch(changePaymentResult(event));
      });

      socket.on('PAYMENT_FAILED', (event) => {
        // 1
        dispatch(changePaymentResult(event));
      });
      socket.on('PAYMENT_TUITION_SUCCESS', (event) => {
        // 2
      });

      socket.on('REGISTER_CLASS', (event) => {
        // 3 Local push
        dispatch(updateNewNotification(event));
      });

      socket.on('TEACHER_REQUEST', (event) => {
        // 5 Local push
        dispatch(updateNewNotification(event));
      });

      socket.on('TEACHER_REJECT_REQUEST', (event) => {
        // 6
        dispatch(updateNewNotification(event));
      });

      socket.on('TEACHER_APPROVE_REQUEST', (event) => {
        // 7
        dispatch(updateNewNotification(event));
      });

      socket.on('USER_REQUEST', (event) => {
        dispatch(updateNewNotification(event));
      });

      socket.on('CLASS_START_3_DAY', (event) => {
        // 9
        dispatch(updateNewNotification(event));
      });

      socket.on('CLASS_START', (event) => {
        // 10
        dispatch(updateNewNotification(event));
      });
      socket.on('CLASS_IS_FULLED', (event) => {
        // 10
        dispatch(updateNewNotification(event));
      });
      socket.on('USER_APPROVE_REQUEST', (event) => {
        // 11
        dispatch(updateNewNotification(event));
      });

      socket.on('USER_REJECT_REQUEST', (event) => {
        // 12
        dispatch(updateNewNotification(event));
      });

      socket.on('USER_REQUEST_CHANGE_TIME', (event) => {
        // 13
        dispatch(updateNewNotification(event));
      });

      socket.on('ADMIN_NOTIFICATION', (event) => {
        // 14
        dispatch(updateNewNotification(event));
      });

      socket.on('TEACHER_APPROVE_REGISTER_CLASS', (event) => {
        // 15
        dispatch(updateNewNotification(event));
      });
      socket.on('TEACHER_REJECT_REGISTER_CLASS', (event) => {
        // 15
        dispatch(updateNewNotification(event));
      });

      socket.on('ADMIN_APPROVE_CLASS', (event) => {
        // 16
        // Local push
        dispatch(updateNewNotification({...event, access: user.access}));
      });

      socket.on('ADMIN_REJECT_CLASS', (event) => {
        // 17
        // Local push
        dispatch(updateNewNotification({...event, access: user.access}));
      });

      // Get number  notify
      socket.on('NOTIFICATION_UNVIEW', (event) => {
        dispatch(updateNumberNotify(event.unView));
      });
      socket.on('TEACHER_REMIND_PAYMENT', (event) => {
        dispatch(updateNewNotification(event));
      });
      socket.on('ACCEPT_CHANGE_LESSON', (event) => {
        dispatch(updateNewNotification(event));
      });
      socket.on('REJECT_CHANGE_LESSON', (event) => {
        dispatch(updateNewNotification(event));
      });
      socket.on('USER_REQUEST_CHANGE_TIME', (event) => {
        dispatch(updateNewNotification(event));
      });
      socket.on('LESSON_START', (event) => {
        dispatch(updateNewNotification(event));
      });
    }
    return () => {
      socket.disconnect();
    };
  }, []);

  // React.useEffect(() => {
  //   handleEmitJoinChat();
  // }, [chatState.currentChatGroup, chatState.preChatGroup]);
  //
  // React.useEffect(() => {
  //   handleEmitTyping();
  // }, [chatState.typing])

  async function handleEmitJoinChat() {
    const socketId = await SOCKET_ID.get();
    if (chatState.currentChatGroup) {
      const data = {
        groupId: chatState.currentChatGroup,
        socketId,
      };
      socket.socket.emit('join_group_chat', data);
    } else if (chatState.preChatGroup) {
      const data = {
        groupId: chatState.preChatGroup,
        socketId,
      };
      socket.socket.emit('leave_group_chat', data);
    }
  }

  async function handleEmitTyping() {
    const socketId = await SOCKET_ID.get();
    const userID = user?.access === 'teacher' ? user?.teacherId : user?._id;
    const data = {
      groupId: chatState.currentChatGroup,
      socketId: socketId,
      userID: userID,
      avatar: user?.avatar?.small,
      fullName: user?.fullName,
    };
    socket.emit('chat_writing', data);
  }

  return (
    <BottomTab.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      tabBarOptions={{
        backgroundColor: 'white',
        activeTintColor: Colors.activeTextTintColor,
        inactiveTintColor: Colors.textTintColor,
        activeBackgroundColor: Colors.whiteColor,
        inactiveBackgroundColor: Colors.whiteColor,
        showLabel: false,
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon focused={focused}
name="iconHome" />
          ),
        }}
      />
      <BottomTab.Screen
        name="CalendarStack"
        component={CalendarStack}
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon focused={focused}
name="iconMortarboard" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Chat"
        component={ChatStack}
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon focused={focused}
name="iconChat" />
          ),
          tabBarVisible: ({navigation}) => {
            let tabBarVisible = true;
            if (navigation.state.index > 0) {
              tabBarVisible = false;
            }
            return {
              tabBarVisible,
            };
          },
        }}
      />

      <BottomTab.Screen
        name="Menu"
        component={ProfileStack}
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon focused={focused}
name="iconMenu" />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
