import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {Text} from 'react-native-elements';
import Toast from 'react-native-toast-message';
import ViString from '../../theme/ViString';
import InputForm from '../../components/common/InputForm';
import Styles from '../../theme/MainStyles';
import ButtonCustomize from '../../components/Tools/ButtonCustomize';
import Container from '../../components/common/Container';
import ConfigStyle from '../../theme/ConfigStyle';
import {PHONE_CODE} from '../../utils/phoneCode';
import {register} from '../../api/users';
import StatusBar from '../../components/common/StatusBar';
import MainStyles from '../../theme/MainStyles';
import {USER_TOKEN} from "../../utils/auth.util";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const INITIAL_FORM = {
  fullName: {
    value: '',
    msgError: '',
  },
  phoneNumber: {
    value: '',
    msgError: '',
  },
  password: {
    value: '',
    msgError: '',
  },
  confirmPassword: {
    value: '',
    msgError: '',
  },
};

const Register = (props) => {
  const {navigation, route} = props;
  const {params} = route;
  const [form, setForm] = useState(INITIAL_FORM);
  const [isBusy, setBusy] = useState(false);
  const [phoneCode, setPhoneCode] = useState('+84');
  const [showBottom1, setShowBottom1] = useState(true);
  const [showBottom2, setShowBottom2] = useState(true);
  const [showBottom3, setShowBottom3] = useState(true);
  const [showBottom4, setShowBottom4] = useState(true);
  const [showKeyboard, setShowKeyboard] = useState(true);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    setShowKeyboard(false);
  };
  const _keyboardDidHide = () => {
    setShowKeyboard(true);
  };
  function changeForm(value, name) {
    const formData = JSON.parse(JSON.stringify(form));
    if (name === 'phoneNumber') {
      formData[name].value = value.replace(/[^a-zA-Z0-9]/g, '');
    } else {
      formData[name].value = value;
    }
    formData[name].msgError = '';
    setForm(formData);
  }
  function validateForm() {
    let validate = true;
    const formData = JSON.parse(JSON.stringify(form));
    // fullName
    if (!formData.fullName.value) {
      formData.fullName.msgError = ViString.errorFullName;
      validate = false;
    }
    // phoneNumber
    if (!formData.phoneNumber.value) {
      formData.phoneNumber.msgError = ViString.errorPhoneNumber;
      validate = false;
    }
    // password
    if (
      !formData.password.value ||
      formData.password.value.length < 6 ||
      formData.password.value.length > 32
    ) {
      formData.password.msgError = ViString.errorPassword;
      validate = false;
    }
    // confirm password
    if (!formData.confirmPassword.value) {
      formData.confirmPassword.msgError = ViString.errorConfirmPassword;
      validate = false;
    } else if (formData.password.value !== formData.confirmPassword.value) {
      formData.confirmPassword.msgError = ViString.errorConfirmPassword;
      validate = false;
    }
    setForm(formData);
    return validate;
  }

  async function handleSubmit() {
    const validate = await validateForm();
    if (!validate) {
      return;
    }
    if (form.phoneNumber.value.length !== 10) {
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Số điện thoại không đúng định dạng',
      });
      return;
    }
    setBusy(true);
    const data = {
      fullName: form.fullName.value,
      phone: form.phoneNumber.value,
      password: form.password.value,
    };
    try {
      const response = await register(data);
      setBusy(false);
      const { token, user } = response || {}
      if (user) {
        await USER_TOKEN.set(token);
        setBusy(false);
        props.navigation.replace('Home');
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Đăng ký thành công',
          visibilityTime: 1000,
        });
      } else {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'error',
          text1: 'Đăng ký thất bại',
          visibilityTime: 1000,
        });
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
  }

  const footer =
    showBottom1 && showBottom2 && showBottom3 && showBottom4 && showKeyboard ? (
      <View style={styles.textFooter}>
        <Text style={[MainStyles.textBlue, styles.txNotAccount]}>
          Tôi đã có tài khoản?{' '}
        </Text>
        <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
          <Text style={[MainStyles.textBlue, {fontWeight: 'bold'}]}>
            Đăng nhập!
          </Text>
        </TouchableOpacity>
      </View>
    ) : null;
  return (
    <Container footer={footer}
keyboardShouldPersistTaps={true}>
      <View
        style={[
          styles.container,
          Styles.marginHeaderBG,
          height < 550 ? {marginTop: 0.12 * height} : {},
        ]}
      >
        <Text style={[Styles.title1, styles.title]}>Đăng ký</Text>
        <View>
          <InputForm
            name="fullName"
            label="Họ và tên"
            required={true}
            msgError={form.fullName.msgError}
            value={form.fullName.value}
            actions={changeForm}
            isFocus={true}
            onFocus={(val) => {
              setShowBottom1(val);
            }}
          />
          <InputForm
            name="phoneNumber"
            label="Số điện thoại"
            type="number"
            required={true}
            msgError={form.phoneNumber.msgError}
            value={form.phoneNumber.value}
            actions={changeForm}
            number={true}
            // listPhoneCode={PHONE_CODE}
            phoneCode={phoneCode}
            setPhoneCode={(value) => setPhoneCode(value)}
            isFocus={true}
            onFocus={(val) => {
              setShowBottom2(val);
            }}
          />
          <InputForm
            name="password"
            label="Mật khẩu"
            required={true}
            msgError={form.password.msgError}
            value={form.password.value}
            actions={changeForm}
            icon={true}
            isFocus={true}
            onFocus={(val) => {
              setShowBottom3(val);
            }}
          />
          <InputForm
            name="confirmPassword"
            label="Nhập lại mật khẩu"
            required={true}
            msgError={form.confirmPassword.msgError}
            value={form.confirmPassword.value}
            actions={changeForm}
            icon={true}
            isFocus={true}
            onFocus={(val) => {
              setShowBottom4(val);
            }}
          />
        </View>
        <View>
          <Text style={[styles.textHelp, MainStyles.textBlue]}>
            Bạn đã đọc và đồng ý{' '}
            <TouchableWithoutFeedback
              style={styles.textLink}
              onPress={() => props.navigation.navigate('Policy')}
            >
              <Text style={[styles.textHightLine, MainStyles.textBlue]}>
                Điều khoản và chính sách
              </Text>
            </TouchableWithoutFeedback>{' '}
            của chúng tôi.
          </Text>
        </View>
        <View style={styles.btnNext}>
          <ButtonCustomize
            name="Đăng ký"
            iconName="arrowright"
            onPress={handleSubmit}
            isBusy={isBusy}
          />
        </View>
      </View>
    </Container>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    margin: 15,
    marginTop: 0,
  },
  title: {
    marginTop: 0,
    marginLeft: 10,
    marginBottom: 10,
  },
  textFooter: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    width: width,
    marginBottom: 30,
    color: '#004892',
  },
  scrollContainer: {
    position: 'relative',
  },
  btnNext: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  textLogin: {
    color: '#004892',
    fontWeight: 'bold',
    paddingLeft: 5,
  },
  textHelp: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 15,
    textAlign: 'center',
    fontSize: ConfigStyle.RF.title5,
  },
  textHightLine: {
    paddingHorizontal: 5,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontStyle: 'italic',
  },
});
