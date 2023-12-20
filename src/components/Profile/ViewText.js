import * as React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Switch,
} from 'react-native';
import {Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import ConfigStyle from '../../theme/ConfigStyle';
import {userNotification, userUpdateNotification} from '../../api/notification';
import {changeNotiStatus} from '../../lib/slices/notificationSlice';
import {setCurrentUser} from '../../lib/slices/socketSlice';

const TextForm = (props) => {
  const dispatch = useDispatch();
  const [isEnabled, setIsEnabled] = React.useState(
    props?.notification?.notification,
  );
  const user = useSelector((state) => state.auth.user);
  const notify = useSelector((state) => state.notification.notiUpdate);
  const toggleSwitch = () => {
    const currentUser = {
      _id: user._id,
      teacherId: user?.teacherId,
      access: user?.access,
      notify: !isEnabled,
    };
    dispatch(setCurrentUser(currentUser));
    updateNotificationStatus();
    setIsEnabled(!isEnabled);
  };
  async function userGetNotification() {
    try {
      const response = await userNotification();
      dispatch(changeNotiStatus(response));
    } catch (error) {
      console.log(error);
    }
  }
  async function updateNotificationStatus() {
    try {
      const data = {
        notification: !isEnabled,
        email: true,
      };
      const response = await userUpdateNotification(data);
      const res = await userGetNotification();
      if (isEnabled) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Tắt thông báo thành công',
        });
      } else {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Bật thông báo thành công',
        });
      }

      // if(response){

      // }
    } catch (error) {
      console.log(error);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Lỗi hệ thống',
      });
    }
  }
  return (
    <TouchableOpacity
      style={[styles.viewText, props?.style]}
      onPress={() => {
        props.navigation.navigate(
          props.navigate,
          props.params ? props.params : {},
        );
      }}
    >
      <View style={styles.image}>{props.src}</View>
      <View style={styles.viewTitle}>
        <Text style={styles.text}>{props.title}</Text>
      </View>
      {props.rightIcon ? (
        <Icon
          name="right"
          size={10}
          style={{position: 'absolute', right: 0, top: 20, color: '#C0C0C0'}}
        />
      ) : (
        <View />
      )}
      {props.switch ? (
        <Switch
          style={{position: 'absolute', right: 0, top: 10}}
          trackColor={{false: '#D3D3D3', true: '#FFEDDD'}}
          thumbColor={isEnabled ? '#FFB02C' : '#FFB02C'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      ) : (
        <View />
      )}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  viewText: {
    flexDirection: 'row',
    marginHorizontal: 15,
    borderBottomColor: '#C0C0C0',
    borderBottomWidth: 1,
    marginVertical: 3,
    // paddingVertical: 12,
    height: 50,
  },
  image: {
    width: 25,
    height: 25,
    alignSelf: 'center',
    position: 'absolute',
    left: 0,
  },
  viewTitle: {
    justifyContent: 'center',
    left: 20,
    paddingVertical: 13,
  },
  text: {
    fontSize: ConfigStyle.customTitle2,
    flex: 1,
    paddingRight: 20,
    // alignSelf: 'center',
    marginLeft: 13,
  },
});
export default TextForm;
