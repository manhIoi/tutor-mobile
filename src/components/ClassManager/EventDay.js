import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Easing,
} from 'react-native';
import {Text} from 'react-native-elements';
import Swipeable from 'react-native-swipeable';
import ArrowRight from '../../assets/images/svg/arrow-right.svg';
import TickGreen from '../../assets/images/svg/tick-green.svg';
import CalendarSvg from '../../assets/images/svg/calendar.svg';
import ArrowReset from '../../assets/images/svg/arrow-reset.svg';
import BoxShadow from '../common/BoxShadow';
import Colors from '../../theme/Colors';
import {formatdddDDMMYYYY, formatHHMM, addTime} from '../../utils/string.util';
import CardModal from '../Calendar/Modal';

const EventInDay = (props) => {
  const {item} = props;
  const [isShow, setShow] = useState(false);
  const toogleModal = () => {
    setShow(!isShow);
  };
  const rightButtons = [
    <View style={styles.wrapRightBtn}>
      <View style={styles.rightButton}>
        <TouchableOpacity style={styles.wrapBtn}>
          <TickGreen width={24}
height={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.wrapBtn}>
          <CalendarSvg width={20}
height={21} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.wrapBtn}
onPress={toogleModal}>
          <ArrowReset width={21}
height={24} />
        </TouchableOpacity>
      </View>
    </View>,
  ];
  return (
    <Swipeable
      rightButtons={
        props?.isRequest && props?.access !== 'teacher' ? rightButtons : null
      }
      rightButtonWidth={115}
      swipeReleaseAnimationConfig={{
        toValue: {x: 0, y: 0},
        duration: 200,
        easing: Easing.back(0.5),
      }}
    >
      {isShow ? (
        <CardModal
          changeSchedule={true}
          isModalVisible={isShow}
          action={toogleModal}
          title={'Đổi lịch học'}
          access={props?.access}
          id={props?.id}
          startAt={new Date(item?.date)}
          // timeEndAt={addTime(
          //   new Date(2020, 10, 30, item?.time?.hour, item?.time?.minute),
          //   props?.timeLine,
          // )}
          status={props?.status}
          timeStartAt={{hour: item?.time?.hour, minute: item?.time?.minute}}
          isRequest={props?.isRequest}
        />
      ) : null}
      <TouchableWithoutFeedback>
        <View style={styles.card}>
          <BoxShadow style={styles.wrapBox}>
            <Text style={styles.textTime}>
              {formatHHMM(
                new Date(2020, 10, 30, item?.time?.hour, item?.time?.minute),
              )}{' '}
              :{' '}
              {addTime(
                new Date(2020, 10, 30, item?.time?.hour, item?.time?.minute),
                props?.timeLine,
              )}
            </Text>
            <Text style={styles.nameClass}>
              {formatdddDDMMYYYY(new Date(item?.date))}
            </Text>
          </BoxShadow>
        </View>
      </TouchableWithoutFeedback>
    </Swipeable>
  );
};

EventInDay.prototype = {};
export default EventInDay;

const styles = StyleSheet.create({
  wrapBox: {
    overflow: 'hidden',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 0,
    backgroundColor: '#F3F3F3',
    marginVertical: 0,

    // paddingHorizontal: 12,
  },
  textButton: {
    // aa
    color: 'white',
    textAlign: 'center',
  },
  wrapRightBtn: {
    width: 100,
    height: '100%',
  },
  rightButton: {
    // aa
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    marginHorizontal: 20,
  },
  card: {
    // aa
    // borderRadius: 10,
    flexDirection: 'row',
    marginVertical: 0,
  },
  textTime: {
    color: Colors.orange,
    fontSize: 11,
    paddingHorizontal: 20,
  },
  nameClass: {
    flex: 1,
    paddingLeft: 18,
    paddingRight: 12,
    paddingVertical: 13,
    fontSize: 14,
  },
  wrapBtn: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
});
