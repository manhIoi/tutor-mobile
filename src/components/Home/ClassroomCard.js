import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import {Text} from 'react-native-elements';
import Toast from 'react-native-toast-message';
import FastImage from '../common/FastImage';
import BoxShadow from '../common/BoxShadow';
import Styles from '../../theme/MainStyles';
import RateStar from '../common/RateStar';
import BackgroundGradient from '../common/BackgroudGradient';
import Colors from '../../theme/Colors';
import config from '../../../config/config';
import {formatDate2} from '../../utils/string.util';
import IconHeart from '../../assets/images/svg/like.svg';
import IconHeartActive from '../../assets/images/svg/like-active.svg';
import {
  registerClass,
  favoriteClass,
  teacherRegisterRequest,
} from '../../api/class';
import ConfigStyle from '../../theme/ConfigStyle';
import ButtonCustom from '../common/ButtonFooterCustom';

const ClassRoomCard = (props) => {
  // console.log(props.data?.avatar?.large)
  const [favorite, setFavorite] = useState(false);
  const [isBusy, setBusy] = useState(false);
  const [registered, setRegistered] = useState(false);
  useEffect(() => {
    setFavorite(props.data?.isFollow);
  }, [props.data]);
  async function addFavoriteClass() {
    try {
      const list = await favoriteClass({classes: props?.data?._id});
      props?.onRefresh(false);
      if (list?.payload?.class) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Theo dõi lớp thành công',
        });
      } else {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Hủy theo dõi lớp thành công',
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Theo dõi lớp thất bại',
      });
    }
  }

  useEffect(() => {
    if (props.data?.statusRegister?.id) {
      setRegistered(true);
    } else {
      setRegistered(false);
    }
  }, []);
  useEffect(() => {
    if (props.data?.statusRegister?.id) {
      setRegistered(true);
    } else {
      setRegistered(false);
    }
  }, [props.data]);
  function formatDayWeek(arr) {
    const listDay = [];
    if (!Array.isArray(arr) || !arr.length) return '';
    arr?.map((item) => {
      if (item === 0) {
        listDay.push('CN');
      } else {
        listDay.push((item + 1).toString());
      }
    });
    listDay.sort();
    let str = 'Thứ ';
    if (listDay.length === 1 && listDay[0] === 'CN') {
      return 'Chủ nhật';
    }
    listDay.map((item, index) => {
      if (index === 0) {
        str += item;
      } else {
        str += `-${item}`;
      }
    });
    return str;
  }

  function formatTime(time) {
    return `${time?.hour}h${
      time?.minute !== 0
        ? time?.minute < 10
          ? `0${time?.minute}`
          : time?.minute
        : ''
    }`;
  }

  async function handleRegister(id) {
    try {
      setBusy(true);
      const response = await registerClass(id);
      setBusy(false);
      if (response) {
        setRegistered(true);
        props?.onRefresh(false);
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Yêu cầu đăng ký đã được ghi nhận',
          text2: 'Vui lòng chờ giáo viên xác nhận',
        });
      }
    } catch (error) {
      console.log('handleRegister ==>', error);
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
          text1: 'Lỗi máy chủ',
        });
      }
    }
  }
  async function handleTeacherRegisterRequest(id) {
    try {
      setBusy(true);
      const response = await teacherRegisterRequest({requestId: id});
      setBusy(false);
      if (response) {
        setRegistered(true);
        props?.onRefresh(false);
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Yêu cầu đăng ký đã được ghi nhận',
          text2: 'Vui lòng chờ giáo viên xác nhận',
        });
      }
    } catch (error) {
      console.log('handleRegister ==>', error);
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
          text1: 'Lỗi máy chủ',
        });
      }
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={() =>
        props.navigation.navigate('DetailClass', {
          title: props.data?.title,
          _id: props.data?._id,
          classRequest: props?.classRequest,
          isRequest: props?.isRequest,
          access: props?.access,
          isPayment: props?.isPayment,
          isHomepage: props?.isHomepage,
          isFollow: favorite,
        })
      }
    >
      <View style={{width: '50%'}}>
        <BoxShadow style={styles.wrapper}>
          <View style={styles.boxImage}>
            <FastImage
              source={{
                uri: `${config.IMAGE_LG_URL}${props.data?.avatar?.large}`,
              }}
              style={styles.image}
            />
            {!props?.isRequest ? (
              favorite ? (
                <TouchableOpacity
                  style={styles.wrapIconHeart}
                  onPress={() => {
                    setFavorite(false);
                    addFavoriteClass();
                  }}
                >
                  <IconHeartActive width={20}
height={20} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.wrapIconHeart}
                  onPress={() => {
                    setFavorite(true);
                    addFavoriteClass();
                  }}
                >
                  <IconHeart width={20}
height={20} />
                </TouchableOpacity>
              )
            ) : null}
          </View>
          <View style={styles.boxInfo}>
            <View style={styles.wrapTitle}>
              <View style={styles.wrapStatus}>
                <View
                  style={[
                    styles.point,
                    {
                      backgroundColor: props.data?.isOnline
                        ? Colors.green
                        : Colors.greyBold,
                    },
                  ]}
                />
                <Text
                  style={{
                    ...styles.textStatus,
                    color: props.data?.isOnline
                      ? Colors.green
                      : Colors.greyBold,
                  }}
                >
                  {props.data?.isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>

              <Text style={styles.waypoint}>
                {(props.data?.dist?.distance !== undefined ||
                  props.data?.distance !== undefined) &&
                (props.data?.dist?.distance !== null ||
                  props.data?.distance !== null)
                  ? `${
                      Math.round(
                        ((props.data?.dist?.distance || props.data?.distance) /
                          1000) *
                          10,
                      ) / 10
                    }km`
                  : ''}
              </Text>
            </View>
            <View style={styles.wrapTitle}>
              <Text
                numberOfLines={1}
                style={{...Styles.title4RS, ...Styles.textBold}}
              >
                {props.data?.title}
              </Text>
            </View>
            <View style={styles.wrapRating}>
              <RateStar star={props.data?.rate || 0}
size={10} />
              <Text style={styles.textRating}>
                {props?.data?.order}/{props?.data?.quantity}
              </Text>
            </View>

            <View>
              <Text
                style={{
                  ...Styles.textGrey,
                  ...styles.textGrey,
                }}
              >
                {formatDayWeek(props.data?.weekDays || [])}
              </Text>
            </View>
            <View>
              <Text style={{...Styles.textGrey, ...styles.textGrey}}>
                {formatTime(props.data?.timeStartAt)} -{' '}
                {formatTime(props.data?.timeEndAt)}
              </Text>
            </View>
            <View style={styles.wrapStartTime}>
              <Text
                style={{
                  ...Styles.textGrey,
                  ...styles.timeStart,
                  ...Styles.textBold,
                  fontSize: 13,
                }}
              >
                Bắt đầu: {formatDate2(props.data?.startAt)}
              </Text>
            </View>
            <View style={styles.wrapStartTime}>
              <Text
                style={{
                  ...Styles.textGrey,
                  ...styles.timeStart,
                  // ...Styles.textBold,
                  ...styles.price,
                }}
              >
                Học phí:{' '}
                {props.data?.price.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Text>
            </View>
            <ButtonCustom
              style={styles.wrapBtn}
              textBtn={{fontSize: 10}}
              isBusy={isBusy}
              disabled={registered}
              text={registered ? 'Đã đăng ký' : 'Đăng ký'}
              onPress={() => {
                props?.access === 'teacher'
                  ? handleTeacherRegisterRequest(props?.data?._id)
                  : handleRegister(props.data._id);
                // console.log(1)
                // if (props.data?._id ) {
                //   props?.access==='teacher' ? handleTeacherRegisterRequest(props?.data?._id) :  handleRegister(props.data._id);
                // }
              }}
            />
          </View>
        </BoxShadow>
      </View>
    </TouchableWithoutFeedback>
  );
};
ClassRoomCard.prototype = {
  user: PropTypes.object,
};
export default ClassRoomCard;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginBottom: 15,
    // marginRight: 15,
  },
  boxImage: {
    position: 'relative',
    zIndex: 95,
  },
  image: {
    width: '100%',
    height: 110,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomColor: Colors.borderThin,
    borderBottomWidth: 0.8,
  },
  wrapIconHeart: {
    position: 'absolute',
    right: 5,
    top: 5,
    paddingHorizontal: 3,
    paddingVertical: 3,
  },
  iconHeart: {
    width: 26,
    height: 26,
  },
  wrapTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boxInfo: {
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 6,
  },
  wrapBtn: {
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    height: 20,
  },
  textBtn: {
    fontSize: 10,
  },
  point: {
    width: 7,
    height: 7,
    borderRadius: 7,
    marginRight: 2.3,
  },
  textStatus: {
    fontSize: 10,
  },
  wrapStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waypoint: {
    color: Colors.greyText,
    fontSize: 10,
  },
  wrapRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  textRating: {
    color: Colors.greyText,
    fontSize: 10,
    marginLeft: 5,
  },
  textGrey: {
    color: '#A1A1A1',
  },
  timeStart: {
    fontSize: 10,
  },
  wrapStartTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 12,
    color: '#EE6423',
  },
});
