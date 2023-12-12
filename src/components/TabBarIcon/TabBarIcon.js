import * as React from 'react';
import {Image, StyleSheet} from 'react-native';
import {useEffect, useState} from 'react';
import ImageUtil from '../../utils/images.util';
import IconHome from '../../assets/images/tab/home.svg';
import IconHomeActive from '../../assets/images/tab/home1.svg';
import IconChat from '../../assets/images/tab/chat.svg';
import IconChatActive from '../../assets/images/tab/chat1.svg';
import IconMortarBoard from '../../assets/images/tab/mortarboard.svg';
import IconMortarBoardActive from '../../assets/images/tab/mortarboard1.svg';
import IconMenu from '../../assets/images/tab/menu.svg';
import IconMenuActive from '../../assets/images/tab/menu1.svg';
function TabBarIcon(props) {
  switch (props.name) {
    case 'iconHome':
      return props.focused ? (
        <IconHomeActive width={26.5} height={23} />
      ) : (
        <IconHome width={26.5}
height={23}
fill={'#000'} />
      );
    case 'iconChat':
      return props.focused ? (
        <IconChatActive width={24.5}
height={24.5} />
      ) : (
        <IconChat width={24.5}
height={24.5}
fill={'#000'} />
      );
    case 'iconMortarboard':
      return props.focused ? (
        <IconMortarBoardActive width={29.14}
height={21.78} />
      ) : (
        <IconMortarBoard width={29.14}
height={21.78}
fill={'#000'} />
      );
    case 'iconMenu':
      return props.focused ? (
        <IconMenuActive width={19.35}
height={19.02} />
      ) : (
        <IconMenu width={19.35}
height={19.02}
fill={'#000'} />
      );
    default:
      console.info(`LOGGER:: default`);
  }
}

export default TabBarIcon;

const styles = StyleSheet.create({
  icon: {
    marginBottom: -3,
  },
});
