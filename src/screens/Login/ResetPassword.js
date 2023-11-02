import React, {useState} from 'react';
import {View, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';

import Toast from 'react-native-toast-message';
import ButtonCustomize from '../../components/Tools/ButtonCustomize';
import Container from '../../components/common/Container';
import InputForm from '../../components/common/InputForm';
import MainStyles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';
import ViString from '../../theme/ViString';
import {resetPassword} from '../../api/users';

const INITIAL_FORM = {
  newPassword: {
    value: '',
    msgError: '',
  },
  confirmPassword: {
    value: '',
    msgError: '',
  },
};

function ResetPassword({navigation, route}) {
  const {goBack} = navigation;
  const [form, setForm] = useState(INITIAL_FORM);
  const [isBusy, setBusy] = useState(false);
  function handleChange(value, name) {
    const formData = JSON.parse(JSON.stringify(form));
    formData[name].value = value;
    formData[name].msgError = '';
    setForm(formData);
  }
  function validateForm() {
    const formData = JSON.parse(JSON.stringify(form));
    if (
      formData.newPassword?.value?.length < 6 ||
      formData.newPassword?.value?.length > 32
    ) {
      formData.password.msgError = ViString.errorPassword;
      setForm(formData);
      return false;
    }
    if (formData.newPassword?.value !== formData.confirmPassword?.value) {
      formData.confirmPassword.msgError = ViString.errorConfirmPassword;
      setForm(formData);
      return false;
    }
    return true;
  }
  const handleContinue = async () => {
    if (!(await validateForm())) {
      return;
    }
    const data = {
      smsId: route?.params?.smsId,
      phone: route?.params?.phone,
      code: route?.params?.code,
      newPassword: form.newPassword?.value || '',
    };
    try {
      setBusy(true);
      const response = await resetPassword(data);
      setBusy(false);
      if (response) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Cập nhật mật khẩu thành công',
        });
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      }
    } catch (error) {
      console.log(error);
      setBusy(false);
      if (error?.response?.data?.errors) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'error',
          text1:
            error?.response?.data?.errors[0].message ||
            error?.response?.data?.errors[0].param,
        });
      } else {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'error',
          text1: 'Lỗi máy chủ',
        });
      }
    }
  };

  return (
    <Container>
      <View style={[MainStyles.container, MainStyles.marginHeaderBG]}>
        <View style={[styles.title, MainStyles.titleMBSubTitle]}>
          <TouchableOpacity onPress={() => goBack()}>
            <Icon name="arrowleft"
style={styles.titleViewText} />
          </TouchableOpacity>
          <View style={styles.titleView}>
            <Text style={[styles.titleViewText, MainStyles.textBold]}>
              Đặt lại mật khẩu
            </Text>
          </View>
        </View>
        <View style={styles.viewPhone}>
          <InputForm
            name="newPassword"
            label="Mật khẩu mới"
            required={true}
            msgError={form.newPassword.msgError}
            value={form.newPassword.value}
            actions={handleChange}
            icon={true}
          />
          <InputForm
            name="confirmPassword"
            label="Nhập lại mật khẩu"
            required={true}
            msgError={form.confirmPassword.msgError}
            value={form.confirmPassword.value}
            actions={handleChange}
            icon={true}
          />
        </View>
        <View style={styles.viewButton}>
          <ButtonCustomize
            name="Tiếp"
            iconName="arrowright"
            onPress={handleContinue}
            isBusy={isBusy}
          />
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.orange,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleViewText: {
    fontSize: ConfigStyle.title2,
    color: Colors.black2,
  },
  viTextBox: {
    flexDirection: 'row',
  },
  viewPhone: {
    marginBottom: 30,
  },
  viewButton: {
    alignItems: 'flex-end',
    height: 70,
    justifyContent: 'center',
    paddingRight: 10,
  },
});

export default ResetPassword;
