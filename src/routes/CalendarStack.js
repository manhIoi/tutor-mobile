import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {Platform} from 'react-native';
import CalendarScreen from '../screens/Calendar/CalendarScreen';
import ManageRegistry from '../screens/ManageRegistry/ManageRegistry';
import ClassManagement from '../screens/ClassManager/ClassManagement';
import ListClassManagement from '../screens/ClassManager/ListClassManagement';
import FeeManagement from '../screens/ClassManager/FeeManagement';
import RequestManagementScreen from '../screens/RequestManager/RequestManagementScreen';
import RegisterManagement from '../screens/RegisterManager/RegisterManagement';
import ListRegistry from '../screens/RegisterManager/ListRegistry';
import ManageClass from '../screens/ManageClass/ManageClass';
import InboxChat from '../screens/Chat/InboxChat';
import DetailClassScreen from '../screens/ClassManager/ListClassManagement';
import DetailRequestScreen from '../screens/RequestManager/DetailRequest';
import ShowAllList from '../screens/UserHome/ShowAllList';
import Calling from '../screens/Call/CallVideo';
import Chat from './ChatStack';
import BillPaymentScreen from '../screens/ManageRequest/BillPayment';
import WebViewPayment from '../screens/Payment/WebViewPayment';
import ManageRequest from '../screens/ManageRequest/ManageRequest';
import DetailClass from '../screens/DetailClass/DetailClass';
import IcomeManagement from '../screens/IcomeManager/IcomeManagement';
import UserCreateRequest from '../screens/CreateRequest/UserCreateRequest';
import ListTeacher from '../screens/RequestManager/TeacherRequest';
import StudentClass from '../screens/ClassManager/StudentClass';
import PaymentScreen from '../screens/Payment/PaymentScreen';
import DetailTutor from "../screens/Tutor/DetailTutor";

const Calendar = createStackNavigator();

const CalendarStack = ({navigation, route}) => {
  React.useLayoutEffect(() => {
    if (route.state && route.state.index > 0) {
      navigation.setOptions({tabBarVisible: false});
    } else {
      navigation.setOptions({tabBarVisible: true});
    }
  }, [navigation, route]);
  return (
    <Calendar.Navigator
      initialRouteName={'CalendarScreen'}
      screenOptions={{
        gestureEnabled: Platform.OS === 'ios',
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Calendar.Screen
        name={'CalendarScreen'}
        component={CalendarScreen}
        options={{
          headerShown: false,
        }}
      />
      <Calendar.Screen
        name={'ManageRegistry'}
        component={ManageRegistry}
        options={{
          headerShown: false,
        }}
      />
      <Calendar.Screen
        name={'ClassManagement'}
        component={ClassManagement}
        options={{
          headerShown: false,
        }}
      />
      <Calendar.Screen
        name={'ListClassManagement'}
        component={ListClassManagement}
        options={{
          headerShown: false,
        }}
      />
      <Calendar.Screen
        name={'FeeManagement'}
        component={FeeManagement}
        options={{
          headerShown: false,
        }}
      />
      <Calendar.Screen
        name={'RequestManagement'}
        component={RequestManagementScreen}
        options={{
          headerShown: false,
        }}
      />
      <Calendar.Screen
        name={'IncomeManagement'}
        component={IcomeManagement}
        options={{
          headerShown: false,
        }}
      />
      <Calendar.Screen
        name={'RegisterManagement'}
        component={RegisterManagement}
        options={{
          headerShown: false,
        }}
      />
      <Calendar.Screen
        name="DetailClass"
        component={DetailClass}
        options={{
          headerShown: false,
        }}
      />
        <Calendar.Screen
            name="DetailTutor"
            component={DetailTutor}
            options={{
                headerShown: false,
            }}
        />
      <Calendar.Screen
        name={'ListRegistry'}
        component={ListRegistry}
        options={{
          headerShown: false,
        }}
      />
      <Calendar.Screen
        name={'ManageRequest'}
        component={ManageRequest}
        options={{
          headerShown: false,
        }}
      />
      <Calendar.Screen
        name={'ManageClass'}
        component={ManageClass}
        options={{
          headerShown: false,
        }}
      />
      <Calendar.Screen
        name="TeacherCreateClass"
        component={UserCreateRequest}
        options={{
          headerShown: false,
        }}
      />
      <Calendar.Screen
        name="UserCreateRequest"
        component={UserCreateRequest}
        options={{
          headerShown: false,
        }}
      />
      <Calendar.Screen
        name="Detail"
        component={DetailClassScreen}
        options={{
          headerShown: false,
        }}
      />
      <Calendar.Screen
        name="ShowAllList"
        component={ShowAllList}
        options={{
          headerShown: false,
        }}
      />
      <Calendar.Screen
        name="Chat"
        component={Chat}
        options={{
          headerShown: false,
        }}
      />
      <Calendar.Screen
        name={'InboxChat'}
        component={InboxChat}
        options={{
          headerShown: false,
        }}
      />
      <Calendar.Screen
        name={'DetailRequest'}
        component={DetailRequestScreen}
        options={{
          headerShown: false,
        }}
      />
      <Calendar.Screen
        name={'Calling'}
        component={Calling}
        options={{
          headerShown: false,
        }}
      />
      <Calendar.Screen
        name={'BillPayment'}
        component={BillPaymentScreen}
        options={{
          headerShown: false,
        }}
      />
      <Calendar.Screen
        name={'ListTeacher'}
        component={ListTeacher}
        options={{
          headerShown: false,
        }}
      />
      <Calendar.Screen
        name={'WebViewPayment'}
        component={WebViewPayment}
        options={{
          headerShown: false,
        }}
      />
      <Calendar.Screen
        name={'StudentClass'}
        component={StudentClass}
        options={{
          headerShown: false,
        }}
      />
      <Calendar.Screen
        name={'Payment'}
        component={PaymentScreen}
        options={{
          headerShown: false,
        }}
      />
    </Calendar.Navigator>
  );
};
export default CalendarStack;
