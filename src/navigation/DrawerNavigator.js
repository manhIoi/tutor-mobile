import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerCustom from '../components/DrawerCustom/DrawerCustom';
import BottomTabNavigator from './BottomTabNavigator';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <DrawerCustom {...props} />}
    >
      <Drawer.Screen name="Home"
component={BottomTabNavigator} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
