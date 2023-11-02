import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Easing,
} from 'react-native';
import {Text} from 'react-native-elements';
import Swipeable from 'react-native-swipeable';
import {useSelector} from 'react-redux';
import ArrowRight from '../../assets/images/svg/arrow-right.svg';
import TickGreen from '../../assets/images/svg/tick-green.svg';
import CalendarSvg from '../../assets/images/svg/calendar.svg';
import ArrowReset from '../../assets/images/svg/arrow-reset.svg';
import BoxShadow from '../common/BoxShadow';
import {userChangeSchedule} from '../../api/class';

import Colors from '../../theme/Colors';
import CardModal from './Modal';

const EventInDay = (props) => {
  const [isShow, setShow] = useState(false);
  const toogleModal = () => {
    setShow(!isShow);
  };
  const {classes} = props.data;
  const user = useSelector((state) => state.auth.user);
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
        <TouchableOpacity
          style={styles.wrapBtn}
          onPress={classes?.isRequest ? toogleModal : null}
        >
          <ArrowReset width={21}
height={24} />
        </TouchableOpacity>
      </View>
    </View>,
  ];

  function goToClass() {
    if (user.access === 'student') {
      props.navigation.navigate('DetailClass', {
        _id: classes?._id,
        title: classes?.title,
        isRequest: classes?.isRequest,
      });
    } else if (user.access === 'teacher') {
      props.navigation.navigate('Detail', {
        _idClass: classes?._id,
        _idLesson: classes?._id,
        title: classes?.title,
        isRequest: classes?.isRequest,
        isPayment: false,
        access: 'teacher',
      });
    }
  }

  return (
    <View>
      {classes?._id ? (
        classes.quantity > 1 || user.access === 'teacher' ? (
          // <Swipeable
          //   rightButtons={rightButtons}
          //   rightButtonWidth={115}
          //   swipeReleaseAnimationConfig={{
          //     toValue: {x: 0, y: 0},
          //     duration: 200,
          //     easing: Easing.back(0.5),
          //   }}
          // >
          <TouchableWithoutFeedback onPress={goToClass}>
            <View style={styles.card}>
              <BoxShadow style={styles.wrapBox}>
                <Text style={styles.textTime}>
                  {classes?.timeStartAt?.hour}:
                  {classes?.timeStartAt?.minute < 10
                    ? `0${classes?.timeStartAt?.minute}`
                    : classes?.timeStartAt?.minute}{' '}
                  - {classes?.timeEndAt?.hour}:
                  {classes?.timeEndAt?.minute < 10
                    ? `0${classes?.timeEndAt?.minute}`
                    : classes?.timeEndAt?.minute}
                </Text>
                <Text style={styles.nameClass}
numberOfLines={1}>
                  {classes?.title}
                </Text>
                {/* <ArrowRight width={5} height={10} /> */}
              </BoxShadow>
            </View>
          </TouchableWithoutFeedback>
        ) : (
          // </Swipeable>
          // <Swipeable
          //   rightButtons={rightButtons}
          //   rightButtonWidth={115}
          //   swipeReleaseAnimationConfig={{
          //     toValue: {x: 0, y: 0},
          //     duration: 200,
          //     easing: Easing.back(0.5),
          //   }}
          // >
          <View>
            <TouchableWithoutFeedback onPress={goToClass}>
              <View style={styles.card}>
                <BoxShadow style={styles.wrapBox}>
                  <Text style={styles.textTime}>
                    {classes?.timeStartAt?.hour}:
                    {classes?.timeStartAt?.minute < 10
                      ? `0${classes?.timeStartAt?.minute}`
                      : classes?.timeStartAt?.minute}{' '}
                    - {classes?.timeEndAt?.hour}:
                    {classes?.timeEndAt?.minute < 10
                      ? `0${classes?.timeEndAt?.minute}`
                      : classes?.timeEndAt?.minute}
                  </Text>
                  <Text style={styles.nameClass}
numberOfLines={1}>
                    {classes?.title}
                  </Text>
                  <View />
                  {/* <ArrowRight width={5} height={10} /> */}
                  <TouchableOpacity
                    style={styles.wrapBtn}
                    onPress={classes?.isRequest ? toogleModal : null}
                  >
                    <ArrowReset width={21}
height={24} />
                  </TouchableOpacity>
                </BoxShadow>
              </View>
            </TouchableWithoutFeedback>
          </View>
          // </Swipeable>
        )
      ) : null}
      {isShow ? (
        <CardModal
          changeSchedule={true}
          isModalVisible={isShow}
          action={toogleModal}
          title={'Đổi lịch học'}
          access={user?.access}
          id={classes?._id}
          startAt={props?.date}
          timeStartAt={classes?.timeStartAt}
          timeEndAt={classes?.timeEndAt}
          isRequest={classes?.isRequest}
          isChangeSchedule={true}
        />
      ) : null}
    </View>
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
    paddingHorizontal: 12,
  },
  textButton: {
    // aa
    color: 'white',
    textAlign: 'center',
  },
  wrapRightBtn: {
    width: 135,
    height: '100%',
  },
  rightButton: {
    // aa
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    marginRight: 20,
  },
  card: {
    // aa
    borderRadius: 10,
    flexDirection: 'row',
  },
  textTime: {
    color: Colors.orange,
    fontSize: 11,
    paddingHorizontal: 5,
    width: 85,
  },
  nameClass: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 12,
    paddingVertical: 13,
    fontSize: 14,
  },
  wrapBtn: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
});
