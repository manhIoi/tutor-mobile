import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {Text} from 'react-native-elements';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';
import FastImage from '../common/FastImage';
import BoxShadow from '../common/BoxShadow';
import ImageUtil from '../../utils/images.util';
import Styles from '../../theme/MainStyles';
import RateStar from '../common/RateStar';
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

const ClassRoomHorizontal = (props) => {
  const [favorite, setFavorite] = useState(false);
  const [isBusy, setBusy] = useState(false);
  const [registered, setRegistered] = useState(false);
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    setFavorite(
      props?.data?.statusIsFollow || props?.data?.isFollow || props?.isFollow,
    );
  }, [props?.data]);
  useEffect(() => {
    if (props.data?.statusRegister?.id || props.data?.statusRegister) {
      setRegistered(true);
    } else {
      setRegistered(false);
    }
  }, []);
  useEffect(() => {
    if (props.data?.statusRegister?.id || props.data?.statusRegister) {
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
  async function addFavoriteClass() {
    try {
      const list = await favoriteClass({classes: props?.data?._id});
      if (list?.payload?.class) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Theo dõi lớp thành công',
        });
        props?.onRefresh(false);
      } else {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Hủy theo dõi lớp thành công',
        });
        props?.onRefresh(false);
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

  function handleClickItem() {
    if (props?.type === 'class') {
      props.navigation.navigate('Detail', {
        _idClass: props?.data?._id,
        _idLesson: props?.data?._id,
        isRequest: props?.isRequest,
        title: props.data?.title,
        isFollow: favorite,
        isHomepage: props?.isHomepage,
        isShowStudent: props?.isShowStudent,
        registered: registered || props?.isRegistry,
        statusRegister: props.data?.statusRegister?.status,
        status: props?.status,
        access: props?.access,
      });
    } else {
      props.navigation.navigate('DetailClass', {
        title: props.data?.title,
        _id: props.data?._id,
        isRequest: props?.isRequest ? props?.isRequest : false,
        classRequest: props.classRequest,
        isPayment: props?.isPayment,
        isFollow: favorite,
        isHomepage: props?.isHomepage,
        status: props?.status,
        isShowStudent: props?.isShowStudent,
        registered: registered || props?.isRegistry,
        statusRegister: props.data?.statusRegister?.status,
      });
    }
    if (typeof props.hideModalSearch === 'function') {
      props.hideModalSearch();
    }
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
    <TouchableWithoutFeedback onPress={handleClickItem}>
      <View>
        <BoxShadow
          style={props.containerStyle ? props.containerStyle : styles.wrapper}
        >
          <View>
            <View style={styles.container}>
              <View style={styles.boxImage}>
                <FastImage
                  source={{
                    uri: `${config.IMAGE_LG_URL}${props.data?.avatar?.large}`,
                  }}
                  style={styles.image}
                />
                {user.access === 'teacher' ? null : !props?.isRequest ? (
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
                  <View style={styles.wrapLocation}>
                    {(props.data?.dist?.distance !== undefined ||
                      props.data?.distance !== undefined) &&
                    (props.data?.dist?.distance !== null ||
                      props.data?.distance !== null) ? (
                      <Image
                        source={ImageUtil.iconLocation}
                        style={styles.iconLocation}
                      />
                    ) : null}

                    <Text style={Styles.textGrey}>
                      {(props.data?.dist?.distance !== undefined ||
                        props.data?.distance !== undefined) &&
                      (props.data?.dist?.distance !== null ||
                        props.data?.distance !== null)
                        ? `${
                            Math.round(
                              ((props.data?.dist?.distance ||
                                props.data?.distance) /
                                1000) *
                                10,
                            ) / 10
                          }km`
                        : ''}
                    </Text>
                  </View>
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
                  <RateStar star={props?.data?.rate || 0}
size={10} />
                  <Text style={styles.textRating}>
                    {props.data?.order}/{props?.data?.quantity}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      ...Styles.textGrey,
                      ...styles.textGrey,
                    }}
                  >
                    Lịch học : {formatDayWeek(props.data?.weekDays || [])}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      ...Styles.textGrey,
                      ...styles.textGrey,
                    }}
                  >
                    Giờ học: {formatTime(props.data?.timeStartAt)} -{' '}
                    {formatTime(props.data?.timeEndAt)}
                  </Text>
                </View>
                <View style={styles.wrapStartTime}>
                  <Text
                    numberOfLines={1}
                    style={{
                      ...Styles.textGrey,
                      ...styles.timeStart,
                      ...Styles.textBold,
                    }}
                  >
                    Bắt đầu: {formatDate2(props.data?.startAt)}
                  </Text>
                </View>
                <View style={[Styles.flexRow, styles.groupBtn]}>
                  <Text style={{...Styles.title5RS, ...styles.price}}>
                    {props.data?.price?.toLocaleString('it-IT', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </Text>
                  {!props?.hide ? (
                    <View style={styles.wrapBtn}>
                      {!props.ownerView ? (
                        <ButtonCustom
                          textBtn={{
                            fontSize: ConfigStyle.RF.text6,
                            paddingHorizontal: registered ? 8 : 15,
                          }}
                          isBusy={isBusy}
                          disabled={
                            registered ||
                            props?.isRegistry ||
                            props?.data?.order === props?.data?.quantity ||
                            new Date().getTime() > new Date(props.data?.startAt)
                          }
                          text={
                            registered || props?.isRegistry
                              ? 'Đã đăng ý'
                              : 'Đăng ký'
                          }
                          onPress={() => {
                            props?.access === 'teacher'
                              ? handleTeacherRegisterRequest(props?.data?._id)
                              : handleRegister(props.data._id);

                            // if (props.data?._id) {
                            //   handleRegister(props.data._id);
                            // }
                          }}
                        />
                      ) : null}
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          </View>
        </BoxShadow>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default ClassRoomHorizontal;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 18,
    flex: 1,
  },
  container: {
    flexDirection: 'row',
  },
  boxImage: {
    position: 'relative',
    // zIndex: 95,
    width: '45%',
    height: '100%',
  },
  image: {
    width: '100%',
    flex: 1,
    borderBottomLeftRadius: 12,
    borderTopLeftRadius: 12,
    borderRightWidth: 0.8,
    borderRightColor: Colors.borderThin,
  },
  wrapIconHeart: {
    position: 'absolute',
    right: 5,
    top: 5,
    paddingHorizontal: 3,
    paddingVertical: 3,
  },
  boxInfo: {
    marginHorizontal: 13,
    marginBottom: 13,
    marginTop: 15,
    flex: 1,
  },
  wrapTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLocation: {
    width: 8.5,
    height: 12,
    marginRight: 3.5,
  },
  iconCake: {
    width: 8,
    height: 12,
    marginRight: 2.5,
  },
  wrapBirth: {
    alignItems: 'center',
  },
  groupBtn: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  price: {
    color: Colors.orange,
    marginRight: 5,
  },
  wrapBtn: {
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    height: 20,
  },
  point: {
    width: 7,
    height: 7,
    borderRadius: 7,
    marginRight: 2.3,
  },
  wrapStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  textRating: {
    color: Colors.greyText,
    fontSize: ConfigStyle.RF.text6,
    marginLeft: 5,
  },
  textGrey: {
    color: '#A1A1A1',
  },
  textStatus: {
    fontSize: ConfigStyle.RF.text6,
  },
  wrapStartTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  timeStart: {
    fontSize: 11,
    marginTop: 2,
  },
});
