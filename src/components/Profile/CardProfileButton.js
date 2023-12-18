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
import {useSelector} from 'react-redux';
import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';
import BackgroundGradient from '../common/BackgroudGradient';
import InputForm from './ViewText';
import IconPassword from '../../assets/images/svg/IconStart.svg';
import IconPolicy from '../../assets/images/svg/IconPolicy.svg';
import IconHelp from '../../assets/images/svg/question.svg';
import IconNotification from '../../assets/images/svg/alarm.svg';
import IconUserProfile from '../../assets/images/svg/employee.svg';
import IconRelationship from '../../assets/images/svg/care.svg';
import BoxShadow from '../common/BoxShadow';
import ButtonCustom from "../common/ButtonFooterCustom";

const width = Dimensions.get('window').width;
const CardInfo = (props) => {
  const role = useSelector((state) => state.auth.user);
  const isStudent = role?.role === 'student';
  const isRequestedApprove = role?.requestBecomeTutor === true
  const renderButton = () => {
    if (isStudent && !isRequestedApprove) return (
          <View style={{ margin: 10}}>
            <ButtonCustom
                text={"Trở thành gia sư"}
              onPress={() => props.navigation.navigate('BecomeExpertStepOne', {
                  isRequestTeacher: true
              })}
            />
          </View>
    )
    if (isStudent && isRequestedApprove) {
      return <View style={{ margin: 10}}>
        <ButtonCustom text={"Chờ duyệt thành gia sư"}  disabled={true} />
      </View>
    }
    return null;
  }
  return (
    <View style={{flex:1}}>
      <BoxShadow style={{marginHorizontal: 14, paddingVertical: 15, flex: 1}}>
        {/* <View style={styles.card}> */}
        <InputForm
          src={<IconUserProfile width={13}
height={19} />}
          rightIcon={true}
          navigate={'BecomeExpertStepOne'}
          {...props}
          title="Tài khoản"
        />
        <InputForm
            src={<IconUserProfile width={13}
                                  height={19} />}
            rightIcon={true}
            navigate={'Account'}
            {...props}
            title="Tài khoản 2"
        />
        <InputForm
          src={<IconPassword width={17}
height={21} />}
          rightIcon={true}
          navigate={'ChangePassword'}
          title={'Mật khẩu'}
          {...props}
        />
{/*        <InputForm*/}
{/*          src={<IconNotification width={17}*/}
{/*height={20} />}*/}
{/*          switch={true}*/}
{/*          title="Thông báo"*/}
{/*          navigate={'Notification'}*/}
{/*          notification={props?.notification}*/}
{/*          {...props}*/}
{/*        />*/}
        {renderButton()}
      </BoxShadow>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    // bottom: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingTop: 15,
    elevation: 5,
    backgroundColor: Colors.whiteColor,
    shadowOffset: {width: 2, height: 2},
    textShadowColor: '#00000029',
    shadowOpacity: 0.5,
    shadowColor: '#00000029',
    textShadowRadius: 0.5,
    // marginTop: 5,
    flexDirection: 'column',
    marginHorizontal: 14,
    marginVertical: 0,
    flex: 1,
    // paddingBottom:98,
  },
});
export default CardInfo;
