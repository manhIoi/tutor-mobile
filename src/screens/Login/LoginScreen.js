import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Dimensions,
} from 'react-native';
import {Button, Text} from 'react-native-elements';
// import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import ViString from '../../theme/ViString';
import ButtonCustomize from '../../components/Tools/ButtonCustomize';
import Container from '../../components/common/ContainerLogin';
import InputForm from '../../components/common/InputForm';
import MainStyles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';
import {getUser, loginUserAsync} from '../../lib/slices/authSlice';
import {login, resendVerifyCode} from '../../api/users';
import {USER_TOKEN} from '../../utils/auth.util';
import {checkNotificationStatus} from '../../utils/checkPermission';
import Constants from '../../../constants/Values';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const INITIAL_FORM = {
  phoneNumber: {
    value: '',
    msgError: '',
  },
  password: {
    value: '',
    msgError: '',
  },
};
function LoginScreen(props) {
  const {navigation, route} = props;
  const {goBack} = navigation;
  const dispatch = useDispatch();
  const [form, setForm] = useState(INITIAL_FORM);
  const [isBusy, setBusy] = useState(false);
  const [showBottom, setShowBottom] = useState(true);
  const [showBottom1, setShowBottom1] = useState(true);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [showVerify, setShowVerify] = useState(false);
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    return () => {
      Keyboard.removeAllListeners('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setShowVerify(false);
    }, []),
  );

  const _keyboardDidShow = () => {
    setShowKeyboard(false);
  };
  const _keyboardDidHide = () => {
    setShowKeyboard(true);
  };

  function handleChange(value, name) {
    const formData = JSON.parse(JSON.stringify(form));
    if (name === 'phoneNumber') {
      setShowVerify(false);
    }
    formData[name].value = value;
    formData[name].msgError = '';
    setForm(formData);
  }

  function goToRegister() {
    navigation.navigate('Register');
  }
  function goToForgotPassword() {
    navigation.navigate('ForgotPasswordScreen');
  }

  function validateForm() {
    let validate = true;
    const formData = {...form};

    if (!formData.phoneNumber.value) {
      formData.phoneNumber.msgError = ViString.errorPhoneNumberNotRegister;
      validate = false;
    }
    if (!formData.password.value) {
      formData.password.msgError = ViString.errorPasswordLogin;
      validate = false;
    }

    setForm(formData);
    return validate;
  }

  async function handleResendCode() {
    try {
      const response = await resendVerifyCode({
        phone: form.phoneNumber.value,
      });
      if (response) {
        props.navigation.navigate('InputVerifyCodeScreen', {
          phoneNumber: form.phoneNumber.value,
          smsId: response.SMSID,
          reVerify: true,
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
    }
  }

  const actionActiveAccount = (
    <Text style={MainStyles.textBlue}
onPress={() => handleResendCode()}>
      Xác thực tài khoản
    </Text>
  );

  async function handleLogin() {
    Keyboard.dismiss();
    if (validateForm()) {
      const data = {
        phone: form.phoneNumber.value,
        password: form.password.value,
        type: props.route?.params?.type,
      };
      try {
        setBusy(true);
        const response = await login(data);
        const { token, user, chatBot } = response || {}
        if (user) {
          await USER_TOKEN.set(token);
          setBusy(false);
          props.navigation.replace('Home');
          Toast.show({
            ...ConfigStyle.toastDefault,
            type: 'success',
            text1: 'Đăng nhập thành công',
            visibilityTime: 1000,
          });
          const propmise = [
            dispatch(getUser({...user, chatBot}))
            //TODO: checkNotificationStatus(),
          ];
          await Promise.all(propmise);
        } else {
          Toast.show({
            ...ConfigStyle.toastDefault,
            type: 'error',
            text1: 'Lỗi. Vui lòng thử lại sau.',
          });
        }
      } catch (error) {
        console.info("LOGGER:: call handle login error",error);
        setBusy(false);
        if (
          error?.response?.data?.errors[0]?.param ===
            'Tài khoản chưa được xác thực' ||
          error?.response?.data?.errors[0]?.message ===
            'Tài khoản chưa được xác thực'
        ) {
          setShowVerify(true);
        }
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
    } else {
      // Alert.alert('Login fail');
    }
  }

  const footer =
      <View style={styles.footer}>
        <View style={{...styles.viTextBox, marginBottom: 30}}>
          <Text style={[MainStyles.textBlue, styles.txNotAccount]}>
            Tôi chưa có tài khoản?
          </Text>
          <TouchableOpacity
              onPress={goToRegister}
              disabled={isBusy}
              style={[styles.toRegister]}
          >
            <Text style={[styles.textLogin, styles.txNotAccount]}>
              {' '}
              Đăng ký!
            </Text>
          </TouchableOpacity>
        </View>
      </View>;
  return (
    <Container keyboardShouldPersistTaps={true}
footer={footer}>
      <View
        style={[
          MainStyles.container,
          MainStyles.marginHeaderBG,
          height < 550 ? {marginTop: 0.2 * height} : {},
        ]}
      >
        <View style={[styles.content]}>
          <View style={styles.subContent}>
            <View style={{flexDirection: 'row'}}>
              <Text style={[MainStyles.title1, styles.title]}>Đăng nhập</Text>
            </View>
            <InputForm
              name="phoneNumber"
              label="Số điện thoại"
              msgError={form.phoneNumber.msgError}
              value={form.phoneNumber.value}
              actions={handleChange}
              number={true}
              isFocus={true}
              onFocus={(value) => setShowBottom(value)}
              actionActiveAccount={showVerify ? actionActiveAccount : null}
            />
            <InputForm
              name="password"
              label="Mật khẩu"
              msgError={form.password.msgError}
              value={form.password.value}
              actions={handleChange}
              icon={true}
              onFocus={(value) => setShowBottom1(value)}
            />
            <View style={styles.viewLogin}>
              <TouchableOpacity onPress={goToForgotPassword}
disabled={isBusy}>
                <Text style={MainStyles.textBlue}>Quên mật khẩu?</Text>
              </TouchableOpacity>
              <ButtonCustomize
                name="Đăng nhập"
                iconName="arrowright"
                onPress={handleLogin}
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
  textLogin: {
    color: '#004892',
    fontWeight: 'bold',
    paddingLeft: 5,
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
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  viTextBox: {
    flexDirection: 'row',
  },
  txNotAccount: {
    lineHeight: 20,
  },
  txRegister: {
    margin: 0,
    fontWeight: 'bold',
  },
  title: {
    marginHorizontal: 10,
  },
  viewLogin: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: '100%',
    marginTop: 20,
  },
  titleViewText: {
    fontSize: ConfigStyle.title2,
    color: Colors.black2,
    marginTop: 5,
  },
});

export default LoginScreen;
