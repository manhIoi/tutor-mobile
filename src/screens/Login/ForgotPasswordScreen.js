import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';
import {Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import {PHONE_CODE} from '../../utils/phoneCode';
import ButtonCustomize from '../../components/Tools/ButtonCustomize';
import Container from '../../components/common/Container';
import InputForm from '../../components/common/InputForm';
import MainStyles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';
import {checkPhoneNumber, resendVerifyCode} from '../../api/users';

const INITIAL_FORM = {
  phoneNumber: {
    value: '',
    msgError: '',
  },
};

function ForgotPasswordScreen(props) {
  const {route, navigation} = props;
  const {goBack} = navigation;
  const {params} = route;
  const [form, setForm] = useState(INITIAL_FORM);
  const [showBottom, setShowBottom] = useState(true);
  const [phoneCode, setPhoneCode] = useState('+84');
  const [isBusy, setBusy] = useState(false);
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
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

  function goToNeedSupport() {
    Alert.alert('Need support');
  }

  const handleContinue = async () => {
    try {
      setBusy(true);
      const response = await resendVerifyCode({
        phone: form.phoneNumber?.value,
        forgotPassword: true,
      });
      setBusy(false);
      if (response) {
        props.navigation.navigate('InputVerifyCodeScreen', {
          phoneNumber: form.phoneNumber.value,
          smsId: response.SMSID,
          forgotPassword: true,
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
  };

  const onGoBack = () => {
    // params.resetLoginForm();
    goBack();
  };
  const footer = showBottom ? (
    <View style={styles.footer}>
      <View style={styles.viTextBox}>
        <TouchableOpacity onPress={goToNeedSupport}
style={[styles.toRegister]}>
          <Text style={[MainStyles.textBlue]}>Bạn cần thêm trợ giúp?</Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : null;
  return (
    <Container footer={footer}>
      <View style={[MainStyles.container, MainStyles.marginHeaderBG]}>
        <View style={[styles.title, MainStyles.titleMBSubTitle]}>
          <TouchableOpacity onPress={() => onGoBack()}>
            <Icon name="arrowleft"
style={styles.titleViewText} />
          </TouchableOpacity>
          <View style={styles.titleView}>
            <Text style={[styles.titleViewText, MainStyles.textBold]}>
              Bạn gặp sự cố đăng nhập?
            </Text>
          </View>
        </View>
        <View style={styles.subTitle}>
          <Text style={styles.subTitleText}>
            Nhập số điện thoại của bạn và chúng tôi sẽ gửi
          </Text>
          <Text style={styles.subTitleText}>
            cho bạn mã để truy cập lại vào tài khoản.
          </Text>
        </View>
        <View style={styles.viewPhone}>
          <InputForm
            name="phoneNumber"
            label="Số điện thoại"
            type="number"
            required={false}
            msgError={form.phoneNumber.msgError}
            value={form.phoneNumber.value}
            actions={handleChange}
            number={true}
            // listPhoneCode={PHONE_CODE}
            phoneCode={phoneCode}
            setPhoneCode={(value) => setPhoneCode(value)}
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
  subTitle: {
    alignItems: 'center',
    marginBottom: 59,
  },
  subTitleText: {
    color: Colors.black3,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    marginBottom: ConfigStyle.footerMarginBottom,
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

export default ForgotPasswordScreen;
