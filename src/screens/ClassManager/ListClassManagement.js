import React, {useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';
import {View, StyleSheet, FlatList, ScrollView} from 'react-native';
import {Text} from 'react-native-elements';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import {useSelector} from 'react-redux';
import ConfigStyle from '../../theme/ConfigStyle';
import Container from '../../components/common/ContainerAnimated';
import DetailInfo from '../../components/Tutor/DetailInfo';
import Styles from '../../theme/MainStyles';
import BoxShadow from '../../components/common/BoxShadow';
import Colors from '../../theme/Colors';
import ChoiceSpecificDay from '../../components/CreateRequest/ChoiceSpecificDay';
import LabelDuration from '../../components/Tutor/LabelDuration';
import Loading from '../../components/common/Loading';
import ImageUtils from '../../utils/images.util';
import {createPayment} from '../../api/payment';

import {
  getClassById,
  getClassId,
  getLessonById,
  getManagementRequestOfUser,
  teacherRemind,
} from '../../api/class';
import RecentActive from '../../components/ClassManager/RecentActive';
import EventInDay from '../../components/ClassManager/EventDay';
import Constants from '../../constants';
import ButtonCustom from '../../components/common/ButtonFooterCustom';
import {IP_ADDRESS} from '../../utils/auth.util';

const DetailClass = (props) => {
  const {navigation, route} = props;
  const isFocused = useIsFocused();
  const user = useSelector((state) => state.auth.user);
  const {params} = route;
  const {_idClass} = params;
  const [classData, setClassData] = useState({});
  const [lessonData, setLessonData] = useState({});
  const [isBusy1, setIsbusy1] = useState(true);
  const [isBusy2, setIsbusy2] = useState(true);
  const [url, setUrl] = useState('');
  async function teacherRemindPayment(id) {
    try {
      const remind = await teacherRemind(id);
      if (remind)
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Nhắc thanh toán thành công!',
        });
    } catch (error) {
      console.log(error);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Nhắc thanh toán thất bại!',
      });
    }
  }

  const footer = (
    <BoxShadow style={styles.wrapFooter}>
      <ButtonCustom
        style={styles.wrapBtn}
        // isBusy={rightRequest}
        disabled={
          classData?.isPayment ||
          classData?.statusRegister?.isPayment ||
          props?.route?.params?.statusRegister?.isPayment
          // props?.route?.params?.statusRegister?.status !== 'approve'
        }
        onPress={() => {
          props?.route?.params?.access !== 'teacher'
            ? requestUrlPayment()
            : teacherRemindPayment(_idClass);
        }}
        text={
          !props?.route?.params?.isShowStudent
            ? classData?.statusRegister?.isPayment ||
              classData?.isPayment ||
              props?.route?.params?.statusRegister?.isPayment
              ? 'ĐÃ THANH TOÁN'
              : 'THANH TOÁN'
            : 'NHẮC THANH TOÁN'
        }
        // onPress={() => handleRegister(classData?._id)}
      />
    </BoxShadow>
  );

  async function requestUrlPayment() {
    try {
      const ipAddress = await IP_ADDRESS.get();
      const data = {
        requestIds: [
          classData?.statusRegister?.id ||
            props?.route?.params?.statusRegister?.requestId,
        ],
        typePayment: 'payment',
        amount: classData?.price,
        ipAddress,
      };
      // setBusy(true);
      const response = await createPayment(data);
      setUrl(response);
      if (response) {
        props?.navigation?.navigate('WebViewPayment', {url: response});
      }
      // setBusy(false);
    } catch (error) {
      // setBusy(false);
      console.log('requestUrlPayment ==>', error);
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

  async function getClass() {
    try {
      const classes = await getClassId(_idClass);
      setClassData(classes);
      setIsbusy2(false);
    } catch (error) {
      setIsbusy2(false);
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
      // props.navigation.goBack();
    }
  }
  async function getManagementRequest() {
    try {
      setIsbusy2(true);
      const response = await getManagementRequestOfUser(_idClass);
      setClassData(response);
      setIsbusy2(false);
    } catch (error) {
      console.log('getClass ==> ', error);
      setIsbusy2(false);
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
      props.navigation.goBack();
    }
  }
  async function getLesson() {
    try {
      const lesson = await getLessonById(_idClass);
      if (lesson?.payload) {
        setLessonData(lesson?.payload);
        setIsbusy1(false);
      }
    } catch (error) {
      setIsbusy1(false);
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
      // props.navigation.goBack();
    }
  }
  useEffect(() => {
    !props.route?.params?.isRequest ? getClass() : getManagementRequest();
    getLesson();
  }, [isFocused]);
  return (
    <Container
      title={classData?.title}
      arrowBack={true}
      contentBarStyles={{justifyContent: 'space-between'}}
      navigation={props.navigation}
      headerHeight={ConfigStyle.statusBarHeight}
      hideBackground={false}
      keyboardShouldPersistTaps={true}
      imageSource={ImageUtils.bgNotDot}
      scrollEnabled={true}
      footer={
        props.route?.params?.isPayment ||
        props?.route?.params?.status === 'ongoing' ||
        props?.route?.params?.isShowStudent
          ? footer
          : null
      }
    >
      {isBusy1 || isBusy2 ? (
        <Loading />
      ) : (
        <View style={styles.container}>
          <DetailInfo
            data={classData}
            type={'class'}
            navigation={props.navigation}
            details={true}
            chat={!props.route?.params?.isRequest}
            isRequest={classData?.isRequest}
            isFollow={props?.route?.params?.isFollow || classData?.isFollow}
          />
          <BoxShadow style={styles.wrapBoxTime}>
            <Text
              style={[
                Styles.textLight,
                Styles.textBlack3,
                styles.spaceVertical,
                {fontSize: 12, marginVertical: 2},
              ]}
            >
              Mã lớp:{' '}
              <Text style={[{fontSize: 14}, Styles.textNormal]}>
                {classData?.classCode}
              </Text>
            </Text>

            <Text
              style={[
                Styles.textLight,
                Styles.textBlack3,
                styles.spaceVertical,
                {fontSize: 12, marginVertical: 2},
              ]}
            >
              Lớp dạy:{' '}
              <Text style={[{fontSize: 14}, Styles.textNormal]}>
                {classData?.title}
              </Text>
            </Text>
            <ChoiceSpecificDay
              dayStudy={classData.weekDays}
              containerStyle={{marginHorizontal: 0}}
            />
            <LabelDuration
              isShow={true}
              startTime={
                new Date(
                  2020,
                  8,
                  2,
                  classData?.timeStartAt?.hour || 0,
                  classData?.timeStartAt?.minute || 0,
                )
              }
              finishTime={
                new Date(
                  2020,
                  8,
                  2,
                  classData?.timeEndAt?.hour || 0,
                  classData?.timeEndAt?.minute || 0,
                )
              }
              startDate={classData?.startAt}
              finishDate={classData?.endAt}
              totalLesson={classData?.totalLesson}
            />
            {!props.route?.params?.isRequest ? (
              <Text
                style={[
                  Styles.textLight,
                  Styles.textBlack3,
                  styles.spaceVertical,
                  {fontSize: 12},
                ]}
              >
                Tình trạng:{'   '}
                <Text
                  style={[
                    Styles.textNormal,
                    Styles.textOrange,
                    {fontSize: 14},
                    {
                      color:
                        Constants.STATUS_CLASS_COLOR[
                          classData?.status || 'pending'
                        ],
                    },
                  ]}
                >
                  {Constants.STATUS_CLASS[classData?.status || 'pending']}
                </Text>
              </Text>
            ) : null}
          </BoxShadow>
          <View style={{marginVertical: 18, color: '#333333'}}>
            <Text style={{fontSize: 20, marginBottom: 14}}>
              Danh sách các buổi dạy
            </Text>
            <View style={{marginHorizontal: -20, maxHeight: 200}}>
              <FlatList
                keyExtractor={(item) => item._id}
                nestedScrollEnabled={true}
                scrollEnabled={true}
                data={lessonData}
                renderItem={({item}) => (
                  <EventInDay
                    item={item}
                    id={_idClass}
                    access={props?.route?.params?.access}
                    isRequest={props?.route?.params?.isRequest}
                    timeLine={classData?.timeline}
                  />
                )}
              />
            </View>
            {props?.route?.params?.status === 'ongoing' &&
            !props?.route?.params?.isShowStudent ? null : props?.route?.params
                ?.access === 'teacher' ? (
              // !props.route?.params?.isRequest ? (
              <RecentActive
                id={_idClass}
                navigation={props?.navigation}
                listStudent={true}
                title={'Danh sách người học'}
                titleClass={classData?.title}
              />
            ) : // ) : null
            null}

            {user?.access === 'teacher' ? null : (props?.route?.params
                ?.isPayment ||
                !classData?.statusRegister?.isPayment) &&
              !props?.route?.params?.isShowStudent ? (
              props?.route?.params?.access !== 'teacher' ? (
                <View
                  style={{
                    marginTop: 20,
                    marginHorizontal: -20,
                    ...styles.wrapBoxPayment,
                  }}
                >
                  <Text style={styles.payment}>Thanh toán học phí</Text>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      marginTop: 10,
                    }}
                  >
                    <Text style={styles.textLeft}>Học phí</Text>
                    <Text style={styles.textRight}>
                      {classData?.price?.toLocaleString('it-IT', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </Text>
                  </View>
                  {/* <View */}
                  {/*  style={{ */}
                  {/*    justifyContent: 'space-between', */}
                  {/*    flexDirection: 'row', */}
                  {/*    marginTop: 10, */}
                  {/*  }} */}
                  {/* > */}
                  {/*  <Text style={styles.textLeft}>Phát sinh</Text> */}
                  {/*  <Text style={styles.textRight}> */}
                  {/*    {classData?.fee?.toLocaleString('it-IT', { */}
                  {/*      style: 'currency', */}
                  {/*      currency: 'VND', */}
                  {/*    })} */}
                  {/*  </Text> */}
                  {/* </View> */}
                  {/* <View */}
                  {/*  style={{ */}
                  {/*    justifyContent: 'space-between', */}
                  {/*    flexDirection: 'row', */}
                  {/*    marginTop: 10, */}
                  {/*  }} */}
                  {/* > */}
                  {/*  <Text style={styles.textLeft}>Tổng cộng</Text> */}
                  {/*  <Text style={styles.textRight}> */}
                  {/*    {(classData?.price - classData?.fee)?.toLocaleString( */}
                  {/*      'it-IT', */}
                  {/*      { */}
                  {/*        style: 'currency', */}
                  {/*        currency: 'VND', */}
                  {/*      }, */}
                  {/*    )} */}
                  {/*  </Text> */}
                  {/* </View> */}
                </View>
              ) : null
            ) : null}
            {/* )} */}
          </View>
        </View>
      )}
    </Container>
  );
};

export default DetailClass;

const styles = StyleSheet.create({
  textRight: {justifyContent: 'flex-end', color: '#EE6423', fontSize: 20},
  textLeft: {
    justifyContent: 'flex-start',
    color: '#00000029',
    fontSize: 14,
  },
  payment: {
    fontSize: 20,
    justifyContent: 'flex-start',
    color: '#333333',
  },
  wrapBoxPayment: {
    borderBottomWidth: 0,
    // paddingVertical: 30,
    paddingHorizontal: 16,
    borderRadius: 0,
  },
  listContent: {
    color: '#EE6423',
    justifyContent: 'center',
    flex: 2,
  },
  list: {
    backgroundColor: '#F3F3F3',
    height: 58,
    flexDirection: 'row',
    flex: 4,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingHorizontal: 22,
    marginHorizontal: -15,
    borderTopColor: '#C0C0C0',
    borderBottomColor: '#C0C0C0',
  },
  container: {
    marginHorizontal: 15,
    paddingTop: 0,
    flex: 1,
  },
  wrapTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  viewAll: {
    fontSize: 12,
    zIndex: 99,
    paddingHorizontal: 3,
    paddingVertical: 3,
  },
  wrapFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 0,
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    borderBottomWidth: 0,
    paddingVertical: 9,
    marginTop: 1,
  },
  textBtn: {
    fontSize: 14,
  },
  wrapBtn: {
    // paddingHorizontal: 35,
    // paddingVertical: 5,
    width: '50%',
    borderRadius: 20,
    // flex: 1,
    justifyContent: 'flex-end',
    marginHorizontal: 10,
    alignItems: 'center',
  },
  wrapBtnInvited: {
    borderWidth: 1,
    borderColor: Colors.orange2,
    paddingVertical: 4,
  },
  textInvited: {
    color: Colors.orange2,
  },
  wrapBoxTime: {
    paddingVertical: 15,
    paddingHorizontal: 17,
  },
  spaceVertical: {
    marginVertical: 2,
  },
});
