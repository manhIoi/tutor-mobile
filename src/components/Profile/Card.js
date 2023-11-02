import * as React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Keyboard,
} from 'react-native';
import {Text} from 'react-native-elements';
import Toast from 'react-native-toast-message';
import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';
import BackgroundGradient from '../common/BackgroudGradient';
import InputForm from './Input';
import Datepicker from './DatePicker';
import IconEmployee from '../../assets/images/svg/employee.svg';
import IconRelationship from '../../assets/images/svg/care.svg';
import IconPhone from '../../assets/images/svg/iconPhone.svg';
import IconAddress from '../../assets/images/svg/location.svg';
import IconEmail from '../../assets/images/svg/contact.svg';
import IconDob from '../../assets/images/svg/recommendation.svg';
import ViString from '../../theme/ViString';
import Styles from '../../theme/MainStyles';
import Container from '../common/ContainerAnimated';
import IconVideo from '../../assets/images/svg/video.svg';

const width = Dimensions.get('window').width;

const CardInfo = (props) => {
  const {navigation} = props;
  const User = {
    fullName: {
      value: '',
      msgError: '',
    },
    relationship: {
      value: '',
      msgError: '',
    },
    phone: {
      value: '',
      msgError: '',
    },
    gender: {
      value: 1,
      msgError: '',
    },
    dob: {
      value: new Date(),
      msgError: '',
    },
    address: {
      value: '',
      msgError: '',
    },
    email: {
      value: '',
      msgError: '',
    },
  };

  const [form, setForm] = React.useState(User);
  function validateForm() {
    let validate = true;
    const formData = {...form};
    if (!formData.fullName.value) {
      formData.fullName.msgError = ViString.fieldIsRequired;
      validate = false;
    }
    if (!formData.relationship.value) {
      formData.relationship.msgError = ViString.fieldIsRequired;
      validate = false;
    }
    if (!formData.phone.value) {
      formData.phone.msgError = ViString.fieldIsRequired;
      validate = false;
    }
    if (!formData.address.value) {
      formData.address.msgError = ViString.fieldIsRequired;
      validate = false;
    }
    if (!formData.email.value) {
      formData.email.msgError = ViString.fieldIsRequired;
      validate = false;
    }
    setForm(formData);
    return validate;
  }
  function handleChange(value, name) {
    setForm({
      ...form,
      [name]: {
        value: value,
        msgError: '',
      },
    });
  }
  function handleSubmit() {
    // props.navigation.push('Hobby', {User: form});
    if (!validateForm()) {
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Vui lòng điền đầy đủ thông tin',
      });
      return;
    }
    const dataInfo = {
      address: form?.address?.value,
      fullName: form?.fullName?.value,
      dob: form?.dob?.value,
      relationship: form?.relationship?.value,
      gender: form?.gender?.value === 3 ? 0 : form?.gender?.value,
      phone: form?.phone?.value,
      email: form?.email?.value,
      avatar: props?.image?.avatar || {},
    };
    navigation.navigate('Hobby', {dataInfo: dataInfo});
  }
  return (
    <View style={{zIndex: 1}}>
      <View style={styles.card}>
        <InputForm
          src={<IconEmployee width={13}
height={19} />}
          placeholder="Họ và tên"
          name="fullName"
          value={form.fullName.value}
          actions={handleChange}
        />
        {form?.fullName?.msgError ? (
          <Text style={{...Styles.textError, marginLeft: 20}}>
            {form?.fullName?.msgError}
          </Text>
        ) : null}
        <InputForm
          name="relationship"
          value={form.relationship.value}
          actions={handleChange}
          src={<IconRelationship width={17}
height={17} />}
          placeholder="Quan hệ với chủ tài khoản"
        />
        {form?.relationship?.msgError ? (
          <Text style={{...Styles.textError, marginLeft: 20}}>
            {form?.relationship?.msgError}
          </Text>
        ) : null}
        <InputForm
          name="phone"
          value={form.phone.value}
          actions={handleChange}
          src={<IconPhone width={16}
height={19} />}
          placeholder="Số điện thoại"
          keyboardType="numeric"
        />
        {form?.phone?.msgError ? (
          <Text style={{...Styles.textError, marginLeft: 20}}>
            {form?.phone?.msgError}
          </Text>
        ) : null}
        <InputForm
          gender={true}
          src={<IconEmployee width={'100%'}
height={'100%'} />}
          placeholder="Giới tính"
          name="gender"
          value={form.gender.value}
          actions={handleChange}
        />
        <Datepicker
          name="dob"
          src={<IconDob width={19}
height={25} />}
          value={form.dob.value}
          actions={handleChange}
        />
        <InputForm
          value={form.address.value}
          actions={handleChange}
          name="address"
          src={<IconAddress width={19}
height={19} />}
          placeholder="Địa chỉ"
        />
        {form?.address?.msgError ? (
          <Text style={{...Styles.textError, marginLeft: 20}}>
            {form?.address?.msgError}
          </Text>
        ) : null}
        <InputForm
          value={form.email.value}
          actions={handleChange}
          name="email"
          src={<IconEmail width={19}
height={19} />}
          placeholder="Email"
          keyboardType="email-address"
        />
        {form?.email?.msgError ? (
          <Text style={{...Styles.textError, marginLeft: 20}}>
            {form?.email?.msgError}
          </Text>
        ) : null}

        <TouchableOpacity
          style={{
            justifyContent: 'center',
            marginTop: 20,
            alignItems: 'center',
          }}
          onPress={handleSubmit}
        >
          <BackgroundGradient style={{borderRadius: 30, width: width - 80}}>
            <Text
              style={{
                color: Colors.whiteColor,
                paddingHorizontal: 15,
                paddingVertical: 15,
                textAlign: 'center',
              }}
            >
              Tiếp
            </Text>
          </BackgroundGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    bottom: 10,
    borderRadius: 10,
    paddingVertical: 15,
    elevation: 20,
    backgroundColor: Colors.whiteColor,
    shadowOffset: {width: 2, height: 2},
    textShadowColor: '#00000029',
    shadowOpacity: 0.5,
    shadowColor: '#00000029',
    textShadowRadius: 0.5,
    // marginTop: 5,
    flexDirection: 'column',
    marginHorizontal: 14,
    marginVertical: 20,
  },
});
export default CardInfo;
