import * as React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import IconFeather from 'react-native-vector-icons/Feather';
import {useDispatch, useSelector} from 'react-redux';
import {Text} from 'react-native-elements';
import MainStyles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';
import {logoutAsync} from '../../lib/slices/authSlice';
import config from '../../../config/config';
import FastImage from '../common/FastImage';
import IconLogout from '../../assets/images/svg/logout.svg';
import {removeDeviceToken} from '../../api/notification';
import {checkIsTeacher} from "../../utils/profile.util";

const Avatar = (props) => {
  const dispatch = useDispatch();
  const balance = useSelector((state) => state.auth.balance);
  const user = useSelector((state) => state.auth.user);
  async function handleLogout() {
    //TODO: imeplemnt removeDeviceToken
    // await removeDeviceToken();
    await dispatch(logoutAsync());
  }
  return (
    <View>
      <View style={{marginBottom: 30, marginTop: 40}}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.viewImage}>
            <FastImage
              zoomView={false}
              style={styles.image}
              source={{uri: user.avatar}}
            />
          </View>
          <View
            style={
              (Platform.OS === 'android'
                ? {marginTop: 10}
                : {marginLeft: 30, marginTop: 10},
              {
                flex: 1,
                width: '40%',
                flexDirection: 'column',
                justifyContent: 'center',
              })
            }
          >
            <Text style={styles.textNormal}>Xin chào!!</Text>
            <Text style={styles.name}>{user.fullName}</Text>
          </View>
        </View>
        <View style={styles.phoneNumberView}>
          <Text style={styles.phoneNumber}>
            Số điện thoại :{' '}
            <Text style={styles.phoneNumberText}>{user.phone}</Text>
          </Text>
        </View>
        {checkIsTeacher(user) ? (
          <View style={styles.phoneNumberView}>
            <Text style={styles.phoneNumber}>
              Vai trò :{' '}
              <Text style={styles.phoneNumberText}>{"Giáo viên"}</Text>
            </Text>
            <Text style={styles.phoneNumber}>
              Số dư tài khoản :{' '}
              <Text style={{...styles.phoneNumberText, ...styles.textBalance}}>
                {balance?.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Text>
            </Text>
          </View>
        ) : null}
      </View>
{/*      <TouchableOpacity onPress={handleLogout}*/}
{/*style={styles.btnLogout}>*/}
{/*        <Text>Đăng xuất</Text>*/}
{/*        <IconLogout style={{marginLeft: 8}}*/}
{/*width={18}*/}
{/*height={19} />*/}
{/*      </TouchableOpacity>*/}
    </View>
  );
};
const styles = StyleSheet.create({
  textNormal: {
    // alignSelf: 'center',
    // marginHorizontal: 10,
    textAlign: 'center',
    fontSize: 14,
    color: Colors.black4,
    ...MainStyles.textNormal,
    width: '50%',
  },
  viewModal: {
    left: 0,
    position: 'absolute',
    top: 30,
    marginHorizontal: 30,
  },
  phoneNumberView: {
    marginHorizontal: 17,
    top: 10,
  },
  phoneNumber: {
    fontSize: ConfigStyle.customTitle2,
  },
  phoneNumberText: {
    fontSize: ConfigStyle.RF.title4,
    ...MainStyles.textBold,
  },
  textBalance: {
    color: Colors.black2,
  },
  btnLogout: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    width: 110,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderColor: Colors.borderThin,
    borderWidth: 1,
  },
  btnClose: {position: 'absolute', top: 10, right: 20},
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'lightgray',
    height: 180,
    backgroundColor: 'white',
  },
  name: {
    fontSize: ConfigStyle.font25,
    color: Colors.black4,
    ...MainStyles.textBold,
    flexWrap: 'wrap',
    width: '80%',
  },
  title: {
    fontSize: ConfigStyle.customTitle2,
    color: Colors.black4,
    textAlign: 'center',
  },
  viewtext: {
    marginTop: 10,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  camera: {
    color: '#FFB02C',
    alignSelf: 'center',
  },
  viewcamera: {
    position: 'absolute',
    justifyContent: 'center',
    right: 0,
    zIndex: 1,
    color: Colors.orange,
    bottom: 10,
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderRadius: 15,
    width: 25,
    height: 25,
    elevation: 7,
    backgroundColor: Colors.whiteColor,
    shadowOffset: {width: 1, height: 1},
    textShadowColor: Colors.black4,
    shadowOpacity: 0.5,
  },
  viewImage: {
    flexDirection: 'row',
    marginHorizontal: 16,
    // justifyContent: 'flex-start',
    // alignSelf :"center",
    width: 110,
    height: 110,
    borderRadius: 60,
    elevation: 6,
    backgroundColor: Colors.whiteColor,
    shadowOffset: {width: 1, height: 1},
    textShadowColor: Colors.black4,
    shadowOpacity: 0.5,
    textShadowRadius: 0.5,
    borderWidth: 0.8,
    borderColor: Colors.borderThin,
  },
  image: {
    marginHorizontal: 4,
    marginVertical: 4,
    width: 100,
    height: 100,
    borderRadius: 80,
    backgroundColor: '#C0C0C0',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 35,
    paddingVertical: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
export default Avatar;
