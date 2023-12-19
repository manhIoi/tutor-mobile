import React, {useEffect} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-elements';
import PropsTypes from 'prop-types';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';
import Avatar from '../common/Avatar';
import BoxShadow from '../common/BoxShadow';
import Styles from '../../theme/MainStyles';
import RateStar from '../common/RateStar';
import Colors from '../../theme/Colors';
import config from '../../../config/config';
import IconLike from '../../assets/images/svg/like.svg';
import IconCake from '../../assets/images/svg/cake-pop.svg';
import IconLocation from '../../assets/images/svg/location.svg';
import IconPerson from '../../assets/images/svg/employee.svg';
import IconMortarboard from '../../assets/images/svg/mortarboard.svg';
import IconClock from '../../assets/images/svg/clock.svg';
import IconCalendar from '../../assets/images/svg/calendar.svg';
import IconGender from '../../assets/images/svg/gender.svg';
import BackgroundGradient from '../common/BackgroudGradient';
import Constants from '../../constants';
import IconLikeActive from '../../assets/images/svg/like-active.svg';
import {favoriteClass} from '../../api/class';
import ConfigStyle from '../../theme/ConfigStyle';

const DetailInfo = (props) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <View style={styles.container}>
      <View style={[Styles.flexRowSB, Styles.flexRowCenterVertical]}>
        <BoxShadow style={styles.wrapAvatar}>
          <Avatar
            size={90}
            source={{uri: props.data?.avatar}}
            zoomView={true}
          />
        </BoxShadow>
        <View style={[Styles.flexRowSB, styles.wrapTitleInfo]}>
          <View style={styles.titleInfo}>
            {props.type !== 'class' ? (
              <Text numberOfLines={2}
style={Styles.title2RS}>
                {props?.data?.fullName}
              </Text>
            ) : null}

            <View style={Styles.flexRowCenterVertical}>
              <RateStar star={props?.data?.rate}
size={10} />
              {props?.data?.totalRate ? (
                <Text style={{marginLeft: 5}}>({props?.data?.totalRate})</Text>
              ) : null}
            </View>
            {props.type !== 'class' ? (
              <Text numberOfLines={2}
style={{fontSize: 14}}>
                {props?.data?.anotherCertificate}
              </Text>
            ) : (
              <View>
                <View style={styles.wrapStatus}>
                  <View
                    style={[
                      styles.point,
                      {
                        backgroundColor: props?.data?.isOnline
                          ? Colors.green
                          : Colors.greyBold,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.textStatus,
                      {
                        color: props?.data?.isOnline
                          ? Colors.green
                          : Colors.greyBold,
                      },
                    ]}
                  >
                    {props?.data?.isOnline ? 'Online' : 'Offline'}
                  </Text>
                </View>
                {props?.data?.order < props?.data?.quantity ? (
                  props.chat ? (
                    <View style={Styles.flexRow}>
                      <Text
                        style={{
                          ...Styles.textGreen,
                          flexWrap: 'wrap',
                          marginRight: 5,
                          color:
                            Constants.STATUS_CLASS_COLOR[
                              props.data?.status || 'pending'
                            ],
                        }}
                      >
                        {
                          Constants.STATUS_CLASS[
                            props.data?.status || 'pending'
                          ]
                        }
                      </Text>
                      <Text>
                        ({props?.data?.order || 0}/{props?.data?.quantity || 0})
                      </Text>
                    </View>
                  ) : null
                ) : (
                  <View style={Styles.flexRow}>
                    <Text
                      style={{
                        ...Styles.textOrange,
                        flexWrap: 'wrap',
                        marginRight: 5,
                      }}
                    >
                      Đã đủ số lượng
                    </Text>
                    <Text>
                      ({props?.data?.order || 0}/{props?.data?.quantity || 0})
                    </Text>
                  </View>
                )}
                {props.classRequest ? (
                  <>
                    <Text>
                      Học phí:{' '}
                      <Text style={Styles.textBold}>
                        {props.data?.price.toLocaleString('it-IT', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                      </Text>
                    </Text>
                    <Text>
                      Phí nhận lớp:{' '}
                      <Text style={Styles.textBold}>
                        {props.data?.fee.toLocaleString('it-IT', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                      </Text>
                    </Text>
                  </>
                ) : (
                  <Text style={{fontSize: ConfigStyle.RF.font14}}>
                    Bắt đầu {new Date(props?.data?.startAt)?.getDate()} th{' '}
                    {new Date(props?.data?.startAt)?.getMonth() + 1},{' '}
                    {new Date(props?.data?.startAt)?.getFullYear()}
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
      {props.type !== 'class' ? (
        <View style={{marginVertical: 5}}>
          <View
            style={[
              Styles.flexRow,
              Styles.marginVertical2,
              Styles.flexRowCenterVertical,
            ]}
          >
            <View style={[Styles.flexRowCenter, {width: 30}]}>
              <IconCake width={12.2}
height={16.8} />
            </View>
            <Text numberOfLines={2}
style={styles.textDetail}>
              {new Date(props.data?.dob).getFullYear()}
            </Text>
          </View>
          <View
              style={[
                Styles.flexRow,
                Styles.marginVertical2,
                Styles.flexRowCenterVertical,
                {
                  marginRight: 20,
                },
              ]}
          >
            <View style={[Styles.flexRowCenter, {width: 30}]}>
              <IconPerson width={16.4} height={16} />
            </View>
            <Text
                numberOfLines={2}
                style={{...styles.textDetail, marginRight: 15}}
            >
              {props?.data?.phone}
            </Text>
          </View>
          <View
            style={[
              Styles.flexRow,
              Styles.marginVertical2,
              Styles.flexRowCenterVertical,
              {
                marginRight: 20,
              },
            ]}
          >
            <View style={[Styles.flexRowCenter, {width: 30}]}>
              <IconLocation width={16.4}
height={16} />
            </View>
            <Text
              numberOfLines={2}
              style={{...styles.textDetail, marginRight: 15}}
            >
              {props?.data?.address}
            </Text>
          </View>
          <View
            style={[
              Styles.flexRow,
              Styles.marginVertical2,
              Styles.flexRowCenterVertical,
              {
                marginRight: 20,
              },
            ]}
          >
            <View style={[Styles.flexRowCenter, {width: 30}]}>
              <IconMortarboard width={20.5}
height={13.5} />
            </View>

            <Text numberOfLines={2}
style={styles.textDetail}>
              {props?.data?.position}
            </Text>
          </View>
        </View>
      ) : (
        <View style={{marginVertical: 5}}>
          {props?.isHomepage ? (
            <View style={Styles.flexRow}>
              <View style={[Styles.flexRowCenter, {width: 30}]}>
                <IconMortarboard width={20.5}
height={13.5} />
              </View>
              <Text style={{...styles.textDetail, ...Styles.textBold}}>
                {props?.data?.teacherId?.fullName ||
                  props?.data?.teacher?.fullName}
              </Text>
            </View>
          ) : null}
          <View style={[Styles.flexRow, Styles.marginVertical2]}>
            <View style={[Styles.flexRowCenter, {width: 30}]}>
              {props?.isHomepage ? (
                <IconGender width={16.4}
height={16} />
              ) : (
                <IconLocation width={16.4}
height={16} />
              )}
            </View>
            {props?.isHomepage ? (
              <Text numberOfLines={2}
style={styles.textDetail}>
                {props?.data?.teacherId?.gender === '1'
                  ? 'Nam'
                  : props?.data?.teacherId?.gender === '2'
                  ? 'Nữ'
                  : 'Khác'}
              </Text>
            ) : (
              <Text
                numberOfLines={2}
                style={{...styles.textDetail, marginRight: 15}}
              >
                {props?.data?.address}
              </Text>
            )}
          </View>
          <View style={[Styles.flexRow, Styles.marginVertical2]}>
            <View style={[Styles.flexRowCenter, {width: 30}]}>
              {props?.isHomepage ? (
                <IconCalendar width={16.4}
height={16} />
              ) : (
                <IconClock width={15.5}
height={15.5} />
              )}
            </View>
            {props?.isHomepage ? (
              <Text numberOfLines={2}
style={styles.textDetail}>
                1999
              </Text>
            ) : (
              <Text numberOfLines={2}
style={styles.textDetail}>
                {props?.data?.timeStartAt?.hour}h
                {props?.data?.timeStartAt?.minute < 10
                  ? `0${props?.data?.timeStartAt?.minute}`
                  : props?.data?.timeStartAt?.minute}
              </Text>
            )}
          </View>
          <View
            style={[
              Styles.flexRow,
              Styles.marginVertical2,
              {justifyContent: 'space-between'},
            ]}
          >
            <View style={Styles.flexRow}>
              <View style={[Styles.flexRowCenter, {width: 30}]}>
                {props?.isHomepage ? (
                  <IconLocation width={16.4}
height={16} />
                ) : (
                  <IconMortarboard width={20.5}
height={13.5} />
                )}
              </View>
              {props?.isHomepage ? (
                <Text
                  numberOfLines={2}
                  style={{...styles.textDetail, width: '70%'}}
                >
                  {props?.data?.address}
                </Text>
              ) : (
                <View style={Styles.flexRow}>
                  <Text style={styles.textDetail}>Teacher :</Text>
                  <Text style={{...styles.textDetail, ...Styles.textBold}}>
                    {props?.data?.teacherId?.fullName ||
                      props?.data?.teacher?.fullName}
                  </Text>
                </View>
              )}
            </View>
            {props.chat || props.type === 'class' ? (
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('Chat', {
                    screen: 'InboxChat',
                    params: {
                      to:
                        props.data?.user ||
                        props.data?.teacher ||
                        props.data?.teacherId ||
                        props.data?._id ||
                        props.data?.id,
                      userReceive: {
                        ...props.data?.teacherId,
                        online:
                          props.data?.teacherId?.online ||
                          props.data?.teacherId?.isOnline,
                      },
                    },
                  });
                }}
              >
                <BackgroundGradient style={styles.wrapBtn}>
                  <Text style={[Styles.textWhite, styles.textBtn]}>Chat</Text>
                </BackgroundGradient>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      )}
      <Text
        style={{
          ...Styles.title2RS,
          ...Styles.textNormal,
          marginBottom: 5,
          marginLeft: 5,
          marginTop: 10,
        }}
      >
        Thông tin
      </Text>
      <Text
        style={{
          ...Styles.textLight,
          ...Styles.textBlack3,
          ...styles.detailTutor,
          marginLeft: 5,
          marginBottom: 10,
        }}
      >
        {props.data?.metaData?.description}
      </Text>
    </View>
  );
};

DetailInfo.prototype = {
  data: PropsTypes.object,
  type: PropsTypes.string,
};

export default DetailInfo;

const styles = StyleSheet.create({
  wrapAvatar: {
    borderRadius: 150,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  wrapTitleInfo: {
    flex: 1,
    marginLeft: 10,
  },
  titleInfo: {
    flex: 1,
  },
  paddingBtn: {
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  textDetail: {
    fontSize: 14,
    marginLeft: 10,
  },
  detailTutor: {
    textAlign: 'justify',
    fontSize: 14,
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
  textBtn: {
    fontSize: 14,
  },
  wrapBtn: {
    paddingHorizontal: 20,
    paddingVertical: 2,
    borderRadius: 20,
    marginHorizontal: 0,
    alignItems: 'center',
  },
});
