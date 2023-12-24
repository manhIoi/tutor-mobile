import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Keyboard} from 'react-native';
import {Button, Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import ViString from '../../theme/ViString';
import ButtonCustomize from '../../components/Tools/ButtonCustomize';
import Container from '../../components/common/ContainerAnimated';
import InputForm from '../../components/common/InputForm';
import MainStyles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';
import Header from '../../components/Profile/Header';
import {changePassword} from '../../api/users';
import StatusBar from '../../components/common/StatusBar';

const INITIAL_FORM = {
  currentPassword: {
    value: '',
    msgError: '',
  },
  newPassword: {
    value: '',
    msgError: '',
  },
  confirmPassword: {
    value: '',
    msgError: '',
  },
};
function ChangePasswordScreen(props) {
  const {navigation, route} = props;
  const [form, setForm] = useState(INITIAL_FORM);
  const [isBusy, setBusy] = useState(false);
  const [showBottom, setShowBottom] = useState(true);
  const user = useSelector(state => state.auth?.user);

  useEffect(() => {
    Keyboard?.addListener?.('keyboardDidShow', _keyboardDidShow);
    Keyboard?.addListener?.('keyboardDidHide', _keyboardDidHide);
    return () => {
      Keyboard?.removeListener?.('keyboardDidShow', _keyboardDidShow);
      Keyboard?.removeListener?.('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    setShowBottom(false);
  };

  const _keyboardDidHide = () => {
    setShowBottom(true);
  };

  function handleChange(value, name) {
    const formData = JSON.parse(JSON.stringify(form));
    formData[name].value = value;
    setForm(formData);
  }

  function validateForm() {
    let validate = true;
    const formData = {...form};
    if (
      !formData.currentPassword.value ||
      formData.currentPassword.value.length < 6 ||
      formData.currentPassword.value.length > 32
    ) {
      formData.currentPassword.msgError = ViString.errorPassword;
      validate = false;
    }
    if (
      !formData.newPassword.value ||
      formData.newPassword.value.length < 6 ||
      formData.newPassword.value.length > 32
    ) {
      formData.newPassword.msgError = ViString.errorPassword;
      validate = false;
    }
    // confirm password
    if (!formData.confirmPassword.value) {
      formData.confirmPassword.msgError = ViString.errorConfirmPassword;
      validate = false;
    } else if (formData.newPassword.value !== formData.confirmPassword.value) {
      formData.confirmPassword.msgError = ViString.errorConfirmPassword;
      validate = false;
    }
    setForm(formData);
    return validate;
  }

  async function handleChangePassword() {
    if (validateForm()) {
      const data = {
        currentPassword: form.currentPassword.value,
        newPassword: form.newPassword.value,
        _id: user?._id,
      };
      form.currentPassword.msgError = '';
      form.newPassword.msgError = '';
      form.confirmPassword.msgError = '';
      try {
        setBusy(true);
        const res = await changePassword(data);
        setBusy(false);
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Thay đổi mật khẩu thành công',
        });
        navigation.replace('UpdateSuccess');
      } catch (error) {
        console.log(error);
        setBusy(false);
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'error',
          text1: 'Mật khẩu hiện tại chưa đúng',
        });
      }
    } else {
      // Alert.alert('Login fail');
    }
  }

  return (
    <Container
      title="Đổi mật khẩu"
      arrowBack={true}
      contentBarStyles={{justifyContent: 'space-between'}}
      navigation={props.navigation}
      headerHeight={ConfigStyle.statusBarHomeHeightTutor}
      hideBackground={false}
    >
      <View style={[MainStyles.container, MainStyles.marginHeaderBG]}>
        <View style={[styles.content]}>
          <View style={styles.subContent}>
            <View style={styles.viewInput}>
              <InputForm
                name="currentPassword"
                label="Mật khẩu hiện tại"
                msgError={form.currentPassword.msgError}
                value={form.currentPassword.value}
                actions={handleChange}
                icon={true}
              />
            </View>
            <View style={styles.viewInput}>
              <InputForm
                name="newPassword"
                label="Mật khẩu mới"
                msgError={form.newPassword.msgError}
                value={form.newPassword.value}
                actions={handleChange}
                icon={true}
              />
            </View>
            <View style={styles.viewInput}>
              <InputForm
                name="confirmPassword"
                label="Nhập lại khẩu mới"
                msgError={form.confirmPassword.msgError}
                value={form.confirmPassword.value}
                actions={handleChange}
                icon={true}
              />
            </View>
            <View style={styles.viewBtnConfirm}>
              <ButtonCustomize
                name="Hoàn tất"
                iconName="arrowright"
                onPress={handleChangePassword}
                isBusy={isBusy}
              />
            </View>
          </View>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  viewInput: {
    marginBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContent: {
    // backgroundColor: Colors.whiteColor,
    paddingTop: 5,
    width: '100%',
  },
  footer: {
    // position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    marginBottom: ConfigStyle.footerMarginBottom,
    // backgroundColor: 'red'
  },
  viTextBox: {
    flexDirection: 'row',
  },
  txNotAccount: {
    lineHeight: 20,
  },
  txRegister: {
    margin: 0,
  },
  title: {
    marginHorizontal: 10,
  },
  viewBtnConfirm: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: '100%',
    marginTop: 20,
  },
});

export default ChangePasswordScreen;
