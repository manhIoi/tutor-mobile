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
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import BackgroudGradient from './BackgroudGradient';
import BoxShadow from './BoxShadow';
import IconTopDown from '../../assets/images/svg/arrow-top-down.svg';
import {formatDate, formatHHMM, formatMMDDYYYY} from '../../utils/string.util';
import MainStyles from '../../theme/MainStyles';
import ConfigStyle from '../../theme/ConfigStyle';
import {changeSchedule} from '../../api/class';

const width = Dimensions.get('window').width;
const CardModal = (props) => {
  const [date, setDate] = React.useState(new Date(props?.dateStart));
  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(false);
  const [statusBarHeight, setStatusBarHeight] = useState(0);
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
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };
  async function changeScheduleStart(id, startAt) {
    try {
      const update = await changeSchedule(id, {startAt: startAt});
      if (update) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Cập nhật lịch học thành công',
        });
        props?.onRefresh();
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Cập nhật lịch học không thành công',
      });
    }
  }
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  const showDatepicker = () => {
    showMode('date');
  };
  const showTimepicker = () => {
    showMode('time');
  };
  return (
    <Modal
      isVisible={props.isModalVisible}
      backdropOpacity={ConfigStyle.backdropOpacity}
      onBackdropPress={props.action}
    >
      <View style={styles.viewModal}>
        {props.changeSchedule ? (
          <View>
            <BoxShadow style={{...styles.boxShadow, height: 150}}>
              <Text style={styles.title}>{props.title}</Text>
              <View style={styles.viewButton}>
                <View style={{...styles.datePicker, width: '50%'}}>
                  <TouchableOpacity onPress={showDatepicker}>
                    <Text style={styles.date}>
                      {formatDate(date) || formatDate(props?.dateStart)}
                    </Text>
                    <IconTopDown
                      width={'20%'}
                      height={'40%'}
                      style={styles.icon}
                    />
                    {show && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                        minimumDate={new Date()}
                      />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={{...styles.datePicker, width: '45%'}}>
                  <TouchableOpacity>
                    <Text style={styles.date}>
                      {`${props?.timeStart?.hour}:${props?.timeStart?.minute}`}{' '}
                      : {`${props?.timeEnd?.hour}:${props?.timeEnd?.minute}`}
                    </Text>
                    <IconTopDown
                      width={'20%'}
                      height={'40%'}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.bottomView}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    props.action();
                  }}
                >
                  <Text style={styles.buttonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    // props.action();
                    // console.log(date);
                    // const startDate = date.toISOString();
                    await changeScheduleStart(
                      props?._id,
                      new Date(date).toISOString(),
                    );
                    props.action();
                  }}
                >
                  <BackgroudGradient style={styles.gradientButton}>
                    <Text style={styles.btnOk}>Ok</Text>
                  </BackgroudGradient>
                </TouchableOpacity>
              </View>
            </BoxShadow>
          </View>
        ) : null}
        {props.deleted ? (
          <BoxShadow style={{...styles.boxShadow, height: 100}}>
            <Text style={styles.titleDelete}>{props.title}</Text>
            <View style={styles.btnBottom}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => {
                  props.action();
                }}
              >
                <Text style={{textAlign: 'center'}}>HỦY</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{width: '50%'}}
                onPress={() => {
                  props.action();
                }}
              >
                <BackgroudGradient
                  style={{borderRadius: 20, paddingVertical: 5}}
                >
                  <Text style={styles.btnOk}>XÓA</Text>
                </BackgroudGradient>
              </TouchableOpacity>
            </View>
          </BoxShadow>
        ) : null}
        {props.request ? (
          <BoxShadow style={{...styles.boxShadow, height: 100}}>
            <Text
              style={{
                color: '#25A053',
                fontSize: 16,
                marginTop: 18,
                textAlign: 'center',
                ...MainStyles.textBold,
              }}
            >
              Thông tin mời dạy đã được gửi đi
            </Text>
            <Text style={{fontSize: 14, textAlign: 'center', marginTop: 6}}>
              Vui lòng chờ phản hồi từ gia sư
            </Text>
          </BoxShadow>
        ) : null}
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  btnCancel: {
    width: '50%',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#FFA42C',
    paddingVertical: 5,
    marginRight: 20,
  },
  btnBottom: {
    position: 'absolute',
    bottom: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: 14,
  },
  titleDelete: {
    fontSize: 16,
    color: '#333333',
    marginTop: 18,
    textAlign: 'center',
    ...MainStyles.textBold,
  },
  viewModal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxShadow: {
    height: 100,
    paddingHorizontal: 20,
    width: width - 40,
  },
  title: {
    fontSize: 16,
    paddingTop: 16,
    color: '#EE6423',
    fontWeight: 'bold',
  },
  viewButton: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  datePicker: {
    marginTop: 12,
    backgroundColor: '#FFEDDD',
    borderRadius: 50,
    position: 'relative',
    justifyContent: 'space-between',
  },
  date: {
    paddingVertical: 6,
    justifyContent: 'center',
    textAlign: 'center',
  },
  icon: {
    position: 'absolute',
    right: 0,
    top: 8,
  },
  bottomView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 15,
    right: 20,
  },
  button: {
    borderRadius: 20,
    width: 80,
    borderColor: '#FFB02C',
    borderWidth: 1,
    marginRight: 5,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFB02C',
    fontSize: 15,
    textAlign: 'center',
  },
  gradientButton: {
    paddingVertical: 6,
    borderRadius: 20,
    width: 80,
  },
  btnOk: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
});
export default CardModal;
