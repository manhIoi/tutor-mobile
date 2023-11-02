import * as React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {Text} from 'react-native-elements';
import {Picker} from '@react-native-community/picker';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import {useState} from 'react';
import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';
import BackgroundGradient from '../common/BackgroudGradient';
import {
  getFamilyProfileId,
  updateFamilyProfileId,
} from '../../api/familyProfile';
import IconEmployee from '../../assets/images/svg/employee.svg';
import IconPhone from '../../assets/images/svg/iconPhone.svg';
import IconAddress from '../../assets/images/svg/location.svg';
import IconEmail from '../../assets/images/svg/contact.svg';
import IconDob from '../../assets/images/svg/recommendation.svg';
import IconVideo from '../../assets/images/svg/video.svg';
import CustomPicker from '../common/CustomPicker';
import Styles from '../../theme/MainStyles';
import Datepicker from './DatePicker';
import {formatYYYYMMDD} from '../../utils/string.util';
import ModalGooglePlace from '../common/ModalGooglePlace';
import BoxShadow from '../common/BoxShadow';

const width = Dimensions.get('window').width;
const CardInfo = (props) => {
  const [isBusy, setBusy] = React.useState(false);
  const [User, setUser] = React.useState({});
  const [showModalGG, setShowModalGG] = useState(false);

  function handleHideModalGG() {
    setShowModalGG(false);
  }

  function handleFocusInput() {
    // if (props.useGGPlaces) {
    Keyboard.dismiss();
    setShowModalGG(true);
    // }
  }

  async function getFamilyById() {
    try {
      const family = await getFamilyProfileId(props.data.item._id);
      setUser(family);
    } catch (error) {
      console.log(error);
    }
  }
  React.useEffect(() => {
    getFamilyById();
  }, []);
  const handleChangeSubject = (index) => {
    const arr = [...User.subjectId];
    let status;
    if (arr[index].status === 1) status = 0;
    else status = 1;
    arr[index] = {...arr[index], status: status};
    setUser((prevState) => ({
      ...prevState,
      subjectId: arr,
    }));
  };
  const handleUpdateFamilyProfile = async () => {
    const arrSubject = User?.subjectId.map((val) => {
      return val._id;
    });
    const arrTopic = User?.topicId.map((val) => {
      return val._id;
    });
    const newUser = {
      relationship: User.relationship,
      phone: User?.phone,
      gender: User?.gender === 3 ? 0 : User?.gender,
      dob: User?.dob,
      address: User?.address,
      email: User?.email,
      subjectId: arrSubject,
      avatar: props?.image?.avatar || User?.avatar,
      topicId: arrTopic,
    };
    try {
      setBusy(true);
      const update = await updateFamilyProfileId(props.data.item._id, newUser);
      setBusy(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'success',
        text1: 'Cập nhật thành công',
      });
    } catch (error) {
      console.log(error);
      setBusy(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Cập nhật không thành công',
      });
    }
  };
  function handleChange(name, val) {
    name === 'address'
      ? setUser({...User, [name]: val?.desc})
      : setUser({...User, [name]: val});
  }
  const RenderItem = (props) => {
    return props.data.map((v, i) => (
      <TouchableOpacity
        key={i.toString()}
        onPress={() => {
          handleChangeSubject(i);
        }}
      >
        <Text style={v.status === 1 ? styles.topicText1 : styles.topicText2}>
          {v.name}
        </Text>
      </TouchableOpacity>
    ));
  };
  return (
    <View style={{zIndex: 1}}>
      <BoxShadow
        style={{
          marginHorizontal: 14,
          marginVertical: 20,
          paddingVertical: 14,
          flex: 1,
        }}
      >
        <View style={styles.viewText}>
          <View style={styles.image}>
            <IconEmployee width={13}
height={19} />
          </View>
          <View style={styles.viewTitle}>
            <TextInput
              onChangeText={(value) => handleChange('relationship', value)}
              style={styles.text}
              placeholderTextColor={Colors.black4}
              value={User.relationship}
            />
          </View>
        </View>
        <View style={styles.viewText}>
          <View style={styles.image}>
            <IconPhone width={16}
height={23} />
          </View>
          <View style={styles.viewTitle}>
            <TextInput
              onChangeText={(value) => handleChange('phone', value)}
              style={styles.text}
              placeholderTextColor={Colors.black4}
              placeholder="Số điện thoại"
              value={User.phone}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.viewText}>
          <View style={styles.image}>
            <IconEmployee width={13}
height={19} />
          </View>
          <View style={{flex: 1, marginLeft: 10}}>
            <CustomPicker
              disabled={false}
              items={[
                {_id: 2, name: 'Nữ'},
                {_id: 1, name: 'Nam'},
                {_id: 0, name: 'Khác'},
              ]}
              value={User?.gender}
              title={'Giới tính'}
              onChange={(value) => handleChange('gender', value)}
              wrapStyle={{
                flex: 1,
                marginLeft: 0,
                marginBottom: 12,
                marginTop: 10,
              }}
              textStyle={Styles.textLight}
            />
          </View>
        </View>
        <Datepicker
          name="dob"
          src={<IconDob width={19}
height={25} />}
          value={new Date(formatYYYYMMDD(User?.dob))}
          actions={(value) => handleChange('dob', value)}
          editable={true}
        />
        <View style={styles.viewText}>
          <View style={styles.image}>
            <IconAddress width={19}
height={19} />
          </View>
          <View style={styles.viewTitle}>
            <TextInput
              style={styles.text}
              onFocus={handleFocusInput}
              // onChangeText={(value) => handleChange('address', value)}
              placeholderTextColor={Colors.black4}
              value={User?.address}
              placeholder="Địa chỉ"
            />
          </View>
          {showModalGG ? (
            <ModalGooglePlace
              visible={showModalGG}
              text={User?.address?.desc}
              setAddress={(value) => handleChange('address', value)}
              onHideModal={handleHideModalGG}
            />
          ) : null}
        </View>
        <View style={styles.viewText}>
          <View style={styles.image}>
            <IconEmail width={19}
height={19} />
          </View>
          <View style={styles.viewTitle}>
            <TextInput
              style={styles.text}
              onChangeText={(value) => handleChange('email', value)}
              placeholderTextColor={Colors.black4}
              value={User.email}
              placeholder="Email"
              keyboardType="email-address"
            />
          </View>
        </View>
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
              <Text style={styles.textTittle}>Sở thích</Text>
            </View>
          </View>
          <View style={{...styles.topicWrap}}>
            {User.subjectId ? <RenderItem data={User.subjectId} /> : null}
          </View>
        </View>
        <TouchableOpacity
          style={styles.gradientButton}
          disabled={!!isBusy}
          onPress={handleUpdateFamilyProfile}
        >
          <BackgroundGradient style={{borderRadius: 30, width: width - 80}}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              {isBusy ? <ActivityIndicator color={'white'} /> : null}
              <Text style={styles.gradientText}>CẬP NHẬT</Text>
            </View>
          </BackgroundGradient>
        </TouchableOpacity>
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
    // alignSelf: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  viewTitle: {justifyContent: 'center', marginLeft: 13, flex: 1},
  textTittle: {fontSize: ConfigStyle.customeTitle, color: Colors.black4},
  text: {
    fontSize: ConfigStyle.customTitle2,
    width: width - 80,
    flex: 1,
    paddingRight: 20,
    alignSelf: 'center',
    color: Colors.black4,
    paddingTop: Platform.OS === 'ios' ? 13 : 10,
    paddingBottom: Platform.OS === 'ios' ? 13 : 12,
    marginLeft: 0,
  },
  image: {
    width: 25,
    height: 25,
    alignSelf: 'center',
  },
  topicText1: {
    // marginTop :10,
    paddingHorizontal: ConfigStyle.btnPaddingHorizontal,
    marginVertical: 5,
    paddingVertical: 6,
    backgroundColor: '#FFEDDD',
    marginRight: 8,
    borderRadius: 5,
    fontSize: ConfigStyle.title4,
  },
  topicText2: {
    // marginTop :10,
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
  viewText: {
    flexDirection: 'row',
    marginHorizontal: 15,
    borderBottomColor: '#C0C0C0',
    borderBottomWidth: 1,
    marginVertical: 5,
  },
});
export default CardInfo;
