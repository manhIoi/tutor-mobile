import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Keyboard,
} from 'react-native';
import {Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';

// import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import ButtonCustomize from '../../components/Tools/ButtonCustomize';
import Container from '../../components/common/Container';
import InputForm from '../../components/common/InputForm';
import CountDownTimer from '../../components/common/CountDownTimer';
import MainStyles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';
import {
  register,
  active,
  resendVerifyCode,
  verifyToResetPassword,
} from '../../api/users';
import {setUser, getUser} from '../../lib/slices/authSlice';
import {USER_TOKEN} from '../../utils/auth.util';

const INITIAL_FORM = {
  verifyCode: {
    value: '',
    msgError: '',
  },
};
const height = Dimensions.get('window').height;

function InputVerifyCodeScreen({navigation, route}) {
  const {goBack} = navigation;
  const [form, setForm] = useState(INITIAL_FORM);
  const [isBusy, setBusy] = useState(false);
  const [verify, setVerify] = useState({});
  const [resend, setResend] = useState('');
  const [smsId, setSmsId] = useState('');
  useEffect(() => {
    handleSendVerify();
    if (route?.params?.smsId) {
      setSmsId(route.params.smsId);
    }
  }, []);

  function handleSendVerify() {}
  async function onResendVerifyCode() {
    try {
      const response = await resendVerifyCode({
        phone: route?.params?.phoneNumber,
        forgotPassword: route.params?.forgotPassword,
      });
      setSmsId(response.SMSID);
      setResend(Date.now());
    } catch (error) {
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
          text1: 'Server Internal Error.',
        });
      }
    }
  }
  function handleChange(value, name) {
    const formData = JSON.parse(JSON.stringify(form));
    formData[name].value = value;
    setForm(formData);
  }

  async function verifyToForgot() {
    try {
      if (form.verifyCode?.value?.length !== 6) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'error',
          text1: 'Mã xác nhận không đúng định dạng',
        });
        return;
      }
      const data = {
        phone: route?.params?.phoneNumber,
        smsId: smsId,
        code: form.verifyCode?.value,
      };
      setBusy(true);
      const response = await verifyToResetPassword(data);
      if (response?.status) {
        navigation.replace('ResetPassword', {
          code: form.verifyCode?.value,
          phone: route?.params?.phoneNumber,
        });
      } else {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'error',
          text1: response?.error || "Lỗi hệ thống"
        });
      }
    } catch (error) {
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
          text1: 'Server Internal Error.',
        });
      }
    } finally {
      setBusy(false)
    }
  }

  const handleContinue = async () => {
    try {
      if (form.verifyCode?.value?.length !== 6) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'error',
          text1: 'Mã xác nhận không đúng định dạng',
        });
        return;
      }
      const data = {
        phone: route?.params?.phoneNumber,
        smsId: smsId,
        code: form.verifyCode?.value,
      };
      setBusy(true);
      const response = await active(data);

      setBusy(false);
      if (response) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: route?.params?.reVerify
            ? 'Xác thực tài khoản thành công'
            : 'Đăng ký tài khoản thành công',
        });
        await USER_TOKEN.set(response.token);
        navigation.navigate('Hobby');
      }
    } catch (error) {
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
          text1: 'Server Internal Error.',
        });
      }
    }
  };

  return (
    <Container keyboardShouldPersistTaps={true}>
      <View
        style={[
          MainStyles.container,
          MainStyles.marginHeaderBG,
          height < 550 ? {marginTop: 0.25 * height} : {},
        ]}
      >
        <View style={[styles.title, MainStyles.titleMBSubTitle]}>
          <TouchableOpacity onPress={() => goBack()}>
            <Icon name="arrowleft"
style={styles.titleViewText} />
          </TouchableOpacity>
          <View style={styles.titleView}>
            <Text style={[styles.titleViewText, MainStyles.textBold]}>
              Nhập mã xác nhận
            </Text>
          </View>
        </View>
        <View style={styles.subTitle}>
          <CountDownTimer
            time={180}
            isResend={resend}
            phoneNumber={route?.params?.phoneNumber}
            onCountDownClick={onResendVerifyCode}
          />
        </View>
        <View style={styles.viewPhone}>
          <InputForm
            name="verifyCode"
            label="Mã xác nhận"
            msgError={form.verifyCode.msgError}
            value={form.verifyCode.value}
            actions={handleChange}
            number={true}
          />
        </View>
        <View style={styles.viewButton}>
          <ButtonCustomize
            name="Tiếp"
            iconName="arrowright"
            onPress={() => {
              Keyboard.dismiss();
              verifyToForgot();
              // if (route.params?.forgotPassword) {
              //
              // } else {
              //   handleContinue();
              // }
            }}
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
    fontSize: ConfigStyle.RF.title2,
    color: Colors.black2,
  },
  subTitle: {
    alignItems: 'center',
    marginBottom: 50,
  },
  subTitleText: {
    color: Colors.black3,
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
  textResend: {
    color: '#004892',
  },
  textDesc: {
    textAlign: 'center',
  },
});

export default InputVerifyCodeScreen;
