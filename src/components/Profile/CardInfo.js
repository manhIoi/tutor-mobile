import * as React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {Text} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';
import InputForm from './Input';
import BackgroundGradient from '../common/BackgroudGradient';
import IconEmployee from '../../assets/images/svg/employee.svg';
import IconPhone from '../../assets/images/svg/iconPhone.svg';
import IconAddress from '../../assets/images/svg/location.svg';
import IconEmail from '../../assets/images/svg/contact.svg';
import IconDob from '../../assets/images/svg/recommendation.svg';
import IconVideo from '../../assets/images/svg/video.svg';
import {getprofile, updateProfile} from '../../api/users';
import Datepicker from './DatePicker';
import {formatYYYYMMDD} from '../../utils/string.util';
import Styles from '../../theme/MainStyles';
import ViString from '../../theme/ViString';
import {checkUser} from '../../lib/slices/authSlice';
import BoxShadow from '../common/BoxShadow';

const CardInfo = (props) => {
  const {isClicked} = props;
  const {action} = props;
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [form, setForm] = React.useState({
    fullName: {
      value: user?.fullName,
      msgError: '',
    },
    phone: {
      value: user?.phone,
      msgError: '',
    },
    gender: {
      value: user?.metaData?.gender || 1,
      msgError: '',
    },
    dob: {
      value: user?.dob,
    },
    address: {
      value: user?.address,
      msgError: '',
    },
    email: {
      value: user?.metaData?.email,
      msgError: '',
    },
  });
  const [isBusy, setBusy] = React.useState(false);
  function validateForm() {
    let validate = true;
    const formData = {...form};
    if (!formData.address.value?.desc) {
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
        ...form[name],
        value: value,
        msgError: '',
      },
    });
  }
  async function handleUpdateProfile() {
    if (!validateForm()) {
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Vui lòng điền đầy đủ thông tin',
      });
      return;
    }
    try {
      setBusy(true);
      const data = {
        fullName: form.fullName.value,
        gender: form?.gender?.value,
        dob: form.dob.value,
        address: form.address.value?.desc,
        lng: form.address.value?.lng,
        lat: form.address.value?.lat,
        email: form.email.value,
      };
      const update = await updateProfile(data);
      if (update) {
        await dispatch(checkUser());
      }
      setBusy(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'success',
        text1: 'Cập nhật thành công',
      });
      action(isClicked);
    } catch (error) {
      console.log(error);
      setBusy(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Cập nhật không thành công',
      });
    }
  }
  const HobbyView = (
    <View style={{marginHorizontal: 15}}>
      <View
        style={{
          ...styles.viewText,
          marginHorizontal: 0,
          borderBottomColor: 'transparent',
        }}
      >
        <View style={styles.image}>
          <IconVideo width={19}
height={19} />
        </View>
        <View style={styles.viewTitle}>
          <TouchableOpacity
            disabled={!isClicked}
            onPress={() => {
              const newTopics = [];
              const newSubject = [];
              props?.profile?.topic?.map((val) => {
                newTopics.push(val?._id);
              });
              props?.profile?.subject?.map((val) => {
                newSubject.push(val?._id);
              });
              props?.navigation.navigate('Hobby', {
                data: {
                  topic: newTopics,
                  subject: newSubject,
                  typeOfTeacher: props?.profile?.typeOfTeacher,
                },
                _id: props?.profile?._id,
              });
            }}
          >
            <Text style={styles.textTittle}>
              Sở thích {isClicked ? '(Chỉnh sửa)' : null}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{...styles.topicWrap}}>
        {user?.topic
          ? user?.topic.map((v) => (
              <TouchableOpacity
                key={v._id.toString()}
                disabled={!isClicked}
                onPress={() => {
                  const newTopics = [];
                  const newSubject = [];
                  props?.profile?.topic?.map((val) => {
                    newTopics.push(val?._id);
                  });
                  props?.profile?.subject?.map((val) => {
                    newSubject.push(val?._id);
                  });
                  props?.navigation.navigate('Hobby', {
                    data: {
                      topic: newTopics,
                      subject: newSubject,
                      typeOfTeacher: props?.profile?.typeOfTeacher,
                    },
                    _id: props?.profile?._id,
                  });
                }}
              >
                <Text
                  style={v.status === 1 ? styles.topicText1 : styles.topicText2}
                >
                  {v.name}
                </Text>
              </TouchableOpacity>
            ))
          : null}
      </View>
    </View>
  );
  return (
    <View style={{zIndex: 1}}>
      <BoxShadow style={{marginHorizontal: 14, paddingVertical: 15, flex: 1}}>
        <InputForm
          name="phone"
          value={form.phone.value}
          actions={handleChange}
          src={<IconPhone width={16}
height={19} />}
          placeholder="Số điện thoại"
          keyboardType="numeric"
          editable={false}
          isDisabled={true}
        />
        <InputForm
          gender={true}
          src={<IconEmployee width={13}
height={19} />}
          placeholder="Giới tính"
          name="gender"
          value={form?.gender?.value}
          actions={handleChange}
          editable={isClicked || false}
        />

        <Datepicker
          name="dob"
          src={<IconDob width={19}
height={25} />}
          value={form.dob.value}
          actions={handleChange}
          editable={isClicked || false}
        />
        <InputForm
          value={form?.address?.value?.desc}
          actions={handleChange}
          name="address"
          useGGPlaces={true}
          src={<IconAddress width={19}
height={19} />}
          placeholder="Địa chỉ"
          editable={isClicked || false}
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
          editable={isClicked || false}
        />
        {form?.email?.msgError ? (
          <Text style={{...Styles.textError, marginLeft: 20}}>
            {form?.email?.msgError}
          </Text>
        ) : null}
        {HobbyView}
        {isClicked ? (
          <View style={{marginHorizontal: 40}}>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignSelf: 'center',
                width: '100%',
                marginTop: 20,
              }}
              onPress={handleUpdateProfile}
            >
              <BackgroundGradient style={{borderRadius: 30}}>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  {isBusy ? <ActivityIndicator color={'white'} /> : null}
                  <Text style={styles.gradientText}>CẬP NHẬT</Text>
                </View>
              </BackgroundGradient>
            </TouchableOpacity>
          </View>
        ) : null}
      </BoxShadow>
    </View>
  );
};
const styles = StyleSheet.create({
  gradientText: {
    color: Colors.whiteColor,
    paddingHorizontal: 15,
    paddingVertical: 15,
    textAlign: 'center',
    height: 49,
    fontSize: ConfigStyle.title3,
  },
  gradientButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  viewTitle: {justifyContent: 'center'},
  textTittle: {
    fontSize: ConfigStyle.customeTitle1,
    marginLeft: 15,
  },
  image: {
    width: 25,
    height: 25,
  },
  topicText1: {
    paddingHorizontal: ConfigStyle.btnPaddingHorizontal,
    marginVertical: 5,
    paddingVertical: 6,
    backgroundColor: '#FFEDDD',
    marginRight: 8,
    borderRadius: 5,
    fontSize: ConfigStyle.title4,
  },
  topicText2: {
    paddingHorizontal: ConfigStyle.btnPaddingHorizontal,
    marginVertical: 5,
    paddingVertical: 6,
    backgroundColor: '#F3F3F3',
    marginRight: 8,
    borderRadius: 5,
    fontSize: ConfigStyle.title4,
  },
  topicWrap: {
    left: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    flex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // borderRadius: 10,
    paddingVertical: 15,
    elevation: 20,
    backgroundColor: Colors.whiteColor,
    shadowOffset: {width: 2, height: 2},
    textShadowColor: '#00000029',
    shadowOpacity: 0.5,
    shadowColor: '#00000029',
    textShadowRadius: 0.5,
    marginTop: 5,
    flexDirection: 'column',
    marginHorizontal: 14,
    // marginVertical: ,
  },
  viewText: {
    flexDirection: 'row',
    marginHorizontal: 15,
    paddingVertical: 10,
    borderBottomColor: '#C0C0C0',
    borderBottomWidth: 1,
    marginVertical: 5,
  },
});
export default CardInfo;
