import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Platform,
  Animated,
} from 'react-native';
import {Text} from 'react-native-elements';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import BoxShadow from './BoxShadow';
import ConfigStyle from '../../theme/ConfigStyle';
import Colors from '../../theme/Colors';
import ChoiceSpecificDay from '../CreateRequest/ChoiceSpecificDay';
import Styles from '../../theme/MainStyles';
import LabelDuration from '../Tutor/LabelDuration';
import BackgroudGradient from './BackgroudGradient';
import IconCancel from '../../assets/images/svg/cancel.svg';
import {
  getClassId,
  getLessonById,
  teacherAcceptAndReject,
} from '../../api/class';

const width = Dimensions.get('window').width;
const Width = (Dimensions.get('window').width - 88) / 2;

const CardModal = (props) => {
  const [date, setDate] = React.useState(new Date());
  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(false);
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const [classData, setClassData] = useState(props?.data);
  const [busyLeft, setBusyLeft] = useState(false);
  const [busyRight, setBusyRight] = useState(false);
  useEffect(() => {
    if (props.isModalVisible) {
      StatusBar.setBackgroundColor('rgba(0,0,0,0.5)');
    } else {
      StatusBar.setBackgroundColor('rgba(255,0,0,0)');
    }
    return () => {
      StatusBar.setBackgroundColor('rgba(255,0,0,0)');
    };
  }, [props.isModalVisible]);
  useEffect(() => {
    if (Platform.OS === 'android') {
      setStatusBarHeight(StatusBar.currentHeight);
    }
  }, []);
  useEffect(() => {
    // getLesson();
    setClassData(props?.data);
  }, [props?.data]);
  const Footer = (props) => {
    return (
      <View
        style={{
          right: 0,
          justifyContent: 'space-between',
          position: 'absolute',
          bottom: 10,
          zIndex: 1,
          marginHorizontal: 20,
          flexDirection: 'row',
        }}
      >
        {props.button1 ? (
          <TouchableOpacity
            disabled={busyLeft || busyRight}
            style={{
              paddingVertical: 3,
              borderRadius: 20,
              width: Width,
              marginHorizontal: 2,
              borderWidth: 1,
              borderColor: Colors.orange2,
              justifyContent: 'center',
            }}
            onPress={() => {
              const data = {
                date: props?.data?.change_time?.date,
                time: props?.data?.change_time?.time,
                classId: props?.data?.class?._id,
                lesson: props?.data?.change_time?.lesson,
              };
              teacherReject('reject', data);
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: Colors.orange2,
                fontSize: ConfigStyle.font14,
              }}
            >
              {props.title1}
            </Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          disabled={busyLeft || busyRight}
          onPress={() => {
            const data = {
              date: props?.data?.change_time?.date,
              time: props?.data?.change_time?.time,
              classId: props?.data?.class?._id,
              lesson: props?.data?.change_time?.lesson,
            };
            teacherAccept('accept', data);
          }}
        >
          <BackgroudGradient
            style={{
              paddingVertical: 6,
              borderRadius: 20,
              width: Width,
              marginHorizontal: 2,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: Colors.whiteColor,
                fontSize: ConfigStyle.font14,
              }}
            >
              {props.title2}
            </Text>
          </BackgroudGradient>
        </TouchableOpacity>
      </View>
    );
  };
  async function teacherAccept(type = 'accept', data) {
    try {
      setBusyLeft(true);
      setBusyRight(true);
      const accept = await teacherAcceptAndReject(type, data);
      setBusyLeft(false);
      setBusyRight(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'success',
        text1: 'Thay đổi lịch học thành công',
      });
      props?.action();
    } catch (error) {
      setBusyLeft(false);
      setBusyRight(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Thay đổi lịch học thất bại',
      });
    }
  }
  async function teacherReject(type = 'reject', data) {
    try {
      setBusyLeft(true);
      setBusyRight(true);
      const reject = await teacherAcceptAndReject(type, data);
      setBusyLeft(false);
      setBusyRight(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'success',
        text1: 'Từ chối thay đổi lịch học thành công',
      });
      props?.action();
    } catch (error) {
      setBusyLeft(false);
      setBusyRight(false);
      console.log(error);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Từ chối thay đổi lịch học thất bại',
      });
    }
  }
  const Status = (props) => {
    const {status} = props;
    return (
      <View style={{marginBottom: 0}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {status === 1 ? (
            <IconCancel style={{height: 15, width: 15, marginRight: 10}} />
          ) : (
            <Image
              source={require('../../assets/images/iconChecked.png')}
              resizeMode={'contain'}
              style={{height: 15, width: 15, marginRight: 10}}
            />
          )}
          <Text style={status ? styles.danger : styles.success}>
            {props.title1}
          </Text>
        </View>
        <Text style={status ? styles.danger : styles.normal}>
          {props.title2}
        </Text>
      </View>
    );
  };
  return (
    <Modal
      isVisible={props.isModalVisible}
      backdropOpacity={ConfigStyle.backdropOpacity}
    >
      {/*
        status={0}
        title1="Người dạy đã thanh toán phí nhận lớp"
        title2={"Vui lòng thanh toán học phí để bắt đầu"
        title1="Người dạy không thanh toán phí nhận lớp"
        title2={"Booking bị hủy"}
      */}
      <View style={styles.viewModal}>
        <View>
          <BoxShadow style={{...styles.boxShadow, height: 200}}>
            <Status
              status={0}
              title1={props?.data?.body}
              // title1={props?.title1}
              title2={null}
            />
            <LabelDuration
              startDate={new Date(props?.data?.data?.out_time?.data)}
              finishDate={new Date(props?.data?.data?.change_time?.date)}
              startTime={
                new Date(
                  2020,
                  12,
                  12,
                  props?.data?.data?.out_time?.time?.hour,
                  props?.data?.data?.out_time?.time?.minute,
                )
              }
              finishTime={
                new Date(
                  2020,
                  12,
                  12,
                  props?.data?.data?.change_time?.time?.hour,
                  props?.data?.data?.change_time?.time?.hour,
                )
              }
              totalLesson={100}
              isShow={true}
            />
            <Footer
              button1={true}
              button2={true}
              title1={'TỪ CHỐI'}
              title2={'ĐỒNG Ý'}
              data={props?.data?.data}
            />
            <View></View>
          </BoxShadow>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  danger: {
    color: Colors.red,
    fontSize: ConfigStyle.font14,
  },
  success: {
    color: '#25A053',
    fontSize: ConfigStyle.font14,
    marginRight: 10,
  },
  normal: {
    ...Styles.textLight,
    ...Styles.textBlack3,
    fontSize: 12,
    marginTop: 2,
  },
  viewModal: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:"red"
  },
  boxShadow: {
    paddingHorizontal: 20,
    width: width - 40,
    paddingVertical: 16,
  },
});
export default CardModal;
