import React from 'react';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {StyleSheet, View} from 'react-native';
import {ListItem, Text, Icon, Avatar} from 'react-native-elements';

import {useDispatch} from 'react-redux';
import {useTheme} from '@react-navigation/native';
import Colors from '../../../constants/Colors';
import {USER_TOKEN} from '../../utils/auth.util';
import {logout} from '../../lib/slices/authSlice';

const DrawerCustom = (props) => {
  const dispatch = useDispatch();
  const {colors} = useTheme();
  const handleLogout = async () => {
    dispatch(logout());
    await USER_TOKEN.delete();
  };

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.logo}>
          <Text h4
style={styles.textLogo}>
            Menu
          </Text>
        </View>
        <View>
          <ListItem
            containerStyle={{
              backgroundColor: colors.card,
            }}
          >
            <Avatar
              source={{
                uri:
                  'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
              }}
            />
            <ListItem.Content>
              <ListItem.Title>ABCD</ListItem.Title>
              <ListItem.Subtitle>TEST</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        </View>
      </DrawerContentScrollView>
      <View style={styles.drawerBottom}>
        <DrawerItem
          icon={({color, size}) => (
            <Icon
              type="ionicon"
              name="md-exit"
              size={24}
              color={Colors.drawerIcon}
            />
          )}
          label="Đăng xuất"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  textLogo: {
    textAlign: 'center',
    color: Colors.whiteColor,
  },
  drawerBottom: {
    borderColor: Colors.borderColor,
    borderTopWidth: 1,
  },
});

export default DrawerCustom;
