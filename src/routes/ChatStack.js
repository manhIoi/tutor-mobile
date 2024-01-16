import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {Platform} from 'react-native';
import ChatScreen from '../screens/Chat/ChatScreen';
import InboxChat from '../screens/Chat/InboxChat';
import Contacts from '../screens/Chat/Contacts';
import DetailTutor from '../screens/Tutor/DetailTutor';
import Calling from '../screens/Call/CallVideo';
import WebViewPayment from '../screens/Payment/WebViewPayment';
import StudentClass from '../screens/ClassManager/StudentClass';
import DetailClassScreen from '../screens/ClassManager/ListClassManagement';
import InboxChatGroup from "../screens/Chat/InboxChatGroup";

const Chat = createStackNavigator();

const ChatStack = ({navigation, route}) => {
  React.useLayoutEffect(() => {
    if (route.state && route.state.index > 0) {
      navigation.setOptions({tabBarVisible: false});
    } else {
      navigation.setOptions({tabBarVisible: true});
    }
  }, [navigation, route]);
  return (
    <Chat.Navigator
      initialRouteName={'ChatScreen'}
      screenOptions={{
        gestureEnabled: Platform.OS === 'ios',
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Chat.Screen
        name={'ChatList'}
        component={ChatScreen}
        options={{
          headerShown: false,
        }}
      />
        <Chat.Screen
            name={'AssistantChat'}
            component={ChatScreen}
            options={{
                headerShown: false,
            }}
        />
      <Chat.Screen
        name={'InboxChat'}
        component={InboxChat}
        options={{
          headerShown: false,
        }}
      />
        <Chat.Screen
            name={'InboxChatGroup'}
            component={InboxChatGroup}
            options={{
                headerShown: false,
            }}
        />
      <Chat.Screen
        name={'Contacts'}
        component={Contacts}
        options={{
          headerShown: false,
        }}
      />
      <Chat.Screen
        name={'DetailTutor'}
        component={DetailTutor}
        options={{
          headerShown: false,
        }}
      />
      <Chat.Screen
        name={'Calling'}
        component={Calling}
        options={{
          headerShown: false,
        }}
      />
      <Chat.Screen
        name={'WebViewPayment'}
        component={WebViewPayment}
        options={{
          headerShown: false,
        }}
      />
      <Chat.Screen
        name={'StudentClass'}
        component={StudentClass}
        options={{
          headerShown: false,
        }}
      />
      <Chat.Screen
        name="Detail"
        component={DetailClassScreen}
        options={{
          headerShown: false,
        }}
      />
    </Chat.Navigator>
  );
};

export default ChatStack;
