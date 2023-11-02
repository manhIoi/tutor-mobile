import React, {useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import ConfigStyle from '../../theme/ConfigStyle';
import Container from '../../components/common/ContainerAnimated';
import DetailInfo from '../../components/Tutor/DetailInfo';
import Styles from '../../theme/MainStyles';
import ReviewList from '../../components/Tutor/ReviewList';
import CreateReview from '../../components/Tutor/CreateReview';
import BoxShadow from '../../components/common/BoxShadow';
import Colors from '../../theme/Colors';
import ChoiceSpecificDay from '../../components/CreateRequest/ChoiceSpecificDay';
import LabelDuration from '../../components/Tutor/LabelDuration';
import Loading from '../../components/common/Loading';
import ImageUtils from '../../utils/images.util';
import {
  cancelRegistryClass,
  getClassById,
  registerClass,
  studentGetClassById,
  getManagementRequestOfUser,
  teacherGetRequestById,
  teacherRegistryRequest,
} from '../../api/class';
import {getReviewByClass} from '../../api/users';
import ButtonCustom from '../../components/common/ButtonFooterCustom';
import CustomActionSheet from '../../components/common/CustomActionSheet';

const INIT_REVIEWS = {
  data: [],
  totalItems: 0,
  currentPage: 1,
};
const DetailClass = (props) => {
  const user = useSelector((state) => state.auth.user);
  const isFocused = useIsFocused();
  const [isBusy, setBusy] = useState(true);
  const [loadReview, setLoadReview] = useState(true);
  const [classData, setClassData] = useState({});
  const [requesting, setRequesting] = useState(false);
  const [leftRequest, setLeftRequest] = useState(false);
  const [rightRequest, setRightRequest] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [reviews, setReviews] = useState(INIT_REVIEWS);
  const IsFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      onRefresh(false);
    }, [IsFocused]),
  );
  function onRefresh() {
    // fetchData();
    if (props.route?.params?._id) {
      if (user.access === 'teacher') {
        if (!props.route?.params?.isRequest) {
          getClass(props.route.params._id);
        } else {
          getRequest(props.route.params._id);
        }
      } else {
        if (!props.route?.params?.isRequest) {
          getClass(props?.route?.params?._id);
          getListReview(props?.route?.params?._id);
        } else {
          getManagementRequest(props?.route?.params?._id);
        }
      }
    }
  }
  useEffect(() => {
    if (props.route?.params?._id) {
      if (user.access === 'teacher') {
        if (!props.route?.params?.isRequest) {
          getClass(props.route.params._id);
        } else {
          getRequest(props.route.params._id);
        }
      } else {
        if (!props.route?.params?.isRequest) {
          getClass(props?.route?.params?._id);
          getListReview(props?.route?.params?._id);
        } else {
          getManagementRequest(props?.route?.params?._id);
        }
      }
    }
  }, [isFocused]);

  function handleClickCancel() {
    setShowActionSheet(true);
    setTimeout(() => {
      setShowActionSheet(false);
    }, 200);
  }
  async function getManagementRequest() {
    try {
      setBusy(true);
      const response = await getManagementRequestOfUser(
        props?.route?.params?._id,
      );
      setClassData(response);
      setBusy(false);
    } catch (error) {
      console.log('getClass ==> ', error);
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
      props.navigation.goBack();
    }
  }

  async function getListReview(id, page = 1, limit = 5, refresh = false) {
    try {
      if (!refresh) {
        setLoadReview(true);
      }
      const response = await getReviewByClass(id, page, limit);
      console.log('getReviewByClass');
      setLoadReview(false);
      setReviews({
        data: response?.payload || [],
        currentPage: response?.page,
        totalItems: response?.total_item || 0,
      });
    } catch (error) {
      console.log('getListReview ==>', error);
    }
  }

  function reloadReview() {
    getListReview(classData?._id, 1, 5, '', true);
  }

  async function handleActionSheetOnPress(index) {
    switch (index) {
      case 0:
        await studentCancelRegistry(classData?.statusRegister?.id);
        break;
      case 1: {
        break;
      }
      default:
        break;
    }
  }

  async function getClass(id, refresh = false) {
    try {
      if (!refresh) {
        setBusy(true);
      }
      const response = await studentGetClassById(id);
      setClassData(response);
      setBusy(false);
    } catch (error) {
      console.log('getClass ==> ', error);
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

  async function getRequest(id, refresh = false) {
    try {
      if (!refresh) {
        setBusy(true);
      }
      const response = await teacherGetRequestById(id);
      setClassData(response);
      setBusy(false);
    } catch (error) {
      console.log('getRequest ==> ', error);
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

  async function handleRegister(id) {
    try {
      setRequesting(true);
      setRightRequest(true);
      const response = await registerClass(id);
      setRequesting(false);
      setRightRequest(false);
      if (response) {
        setClassData({
          ...classData,
          statusRegister: {id: response._id, status: 'pending'},
        });
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Yêu cầu đăng ký đã được ghi nhận',
          text2: 'Vui lòng chờ giáo viên xác nhận',
        });
        // props.navigation.goBack();
        getClass(props.route.params._id, true);
      }
    } catch (error) {
      console.log('handleRegister ==>', error);
      setRequesting(false);
      setRightRequest(false);
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

  async function teacherRegistryRequestClass() {
    try {
      setRequesting(true);
      setRightRequest(true);
      await teacherRegistryRequest({requestId: classData?._id});
      setRequesting(false);
      setRightRequest(false);
      getRequest(props.route.params._id, true);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'success',
        text1: 'Đề nghị lớp thành công',
      });
      onRefresh();
    } catch (error) {
      console.log('teacherRegistryRequest ==>', error);
      setRequesting(false);
      setRightRequest(false);
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

  async function studentCancelRegistry(id) {
    try {
      setRequesting(true);
      setLeftRequest(true);
      await cancelRegistryClass(id);
      setRequesting(false);
      setLeftRequest(false);
      setClassData({
        ...classData,
        statusRegister: null,
      });
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'success',
        text1: 'Hủy đăng ký lớp học thành công',
      });
      // props.navigation.goBack();
      getClass(props.route.params._id, true);
    } catch (error) {
      setRequesting(false);
      setLeftRequest(false);
      if (error?.response?.data?.errors) {
        // đăn;
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
  const footer = (
    <BoxShadow style={styles.wrapFooter}>
      {props.route?.params?.classRequest ? (
        <Text style={{...styles.textFooter, ...Styles.textLight}}>
          Nhận lớp ngay!
        </Text>
      ) : (
        <ButtonCustom
          style={styles.wrapBtn}
          isBusy={leftRequest}
          disabled={
            requesting ||
            // !classData?.statusRegister?.id ||
            isBusy ||
            // classData.status === 'ongoing' ||
            // !props?.route?.params?.registered ||
            !classData?.statusRegister ||
            // props?.route?.params?.statusRegister === 'approve' ||
            classData?.statusRegister?.status === 'approve' ||
            new Date(classData?.startAt).getTime() < new Date().getTime()

            // classData?.statusRegister?.status === 'approve'
            // props?.route?.params?.requestStatus === 'approve'
          }
          text={'HỦY ĐĂNG KÝ'}
          onPress={handleClickCancel}
        />
      )}

      <ButtonCustom
        style={styles.wrapBtn}
        isBusy={rightRequest}
        disabled={
          classData?.isRequest
            ? requesting ||
              // classData?.statusRegister?.id ||
              isBusy ||
              classData.status === 'ongoing' ||
              props?.route?.params?.registered ||
              new Date(classData.startAt).getTime() < new Date().getTime() ||
              // classData?.statusRegister?.status === 'approve' ||
              props?.route?.params?.statusRegister === 'approve' ||
              classData?.statusRegister?.status === 'approve' ||
              classData?.statusRegister?.status === 'pending' ||
              classData.teacher
            : requesting ||
              classData?.statusRegister?.status === 'approve' ||
              classData?.statusRegister?.status === 'pending' ||
              props?.route?.params?.registered ||
              isBusy ||
              classData.status === 'ongoing' ||
              props?.route?.params?.statusRegister === 'approve'
          // classData?.statusRegister?.status === 'approve'
        }
        text={props.route?.params?.classRequest ? 'Đề nghị dạy' : 'ĐĂNG KÝ'}
        onPress={() => {
          if (props.route?.params?.classRequest) {
            teacherRegistryRequestClass();
          } else {
            handleRegister(classData?._id);
          }
        }}
      />
    </BoxShadow>
  );

  return (
    <Container
      title={classData?.title || props.route?.params?.title}
      arrowBack={true}
      contentBarStyles={{justifyContent: 'space-between'}}
      navigation={props.navigation}
      headerHeight={ConfigStyle.statusBarHeight}
      hideBackground={false}
      keyboardShouldPersistTaps={true}
      footer={
        !props.route?.params?.isRequest || props.route?.params?.classRequest
          ? footer
          : null
      }
      imageSource={ImageUtils.bgNotDot}
    >
      {isBusy ? (
        <Loading />
      ) : (
        <View style={styles.container}>
          <DetailInfo
            data={classData}
            type={'class'}
            navigation={props.navigation}
            chat={props?.route?.params?.isRequest}
            isRequest={props?.route?.params?.isRequest}
            classRequest={props.route?.params?.classRequest}
            details={true}
            isFollow={classData?.isFollow}
            isHomepage={props?.route?.params?.isHomepage}
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
            <ChoiceSpecificDay
              dayStudy={classData.weekDays}
              containerStyle={{marginHorizontal: 0}}
            />
            <LabelDuration
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
            {props?.isHomepage ? (
              <Text
                style={[
                  Styles.textLight,
                  Styles.textBlack3,
                  styles.spaceVertical,
                  {fontSize: 12},
                ]}
              >
                Học phí:{'   '}
                <Text
                  style={[Styles.textNormal, Styles.textOrange, {fontSize: 14}]}
                >
                  {classData?.price?.toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </Text>
              </Text>
            ) : null}
          </BoxShadow>
          {!props.route?.params?.isRequest ? (
            !props.route?.params?.classRequest ? (
              <View>
                <ReviewList
                  totalReview={reviews.totalItems}
                  reviews={reviews.data}
                  _id={props?.route?.params?._id}
                  title={props.route?.params?.title}
                  // navigation={props.navigation}
                  navigation={props.navigation}
                />
                <CreateReview
                  data={classData}
                  type={'class'}
                  reloadReview={reloadReview}
                />
              </View>
            ) : null
          ) : props?.route?.params?.isPayment ||
            props?.route?.params?.status === 'finish' ? (
            <View style={{marginTop: 20, marginHorizontal: -20}}>
              <BoxShadow style={styles.wrapBoxPayment}>
                <Text style={styles.payment}>Thanh toán</Text>
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
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginTop: 10,
                  }}
                >
                  <Text style={styles.textLeft}>Phát sinh</Text>
                  <Text style={styles.textRight}>
                    {classData?.fee?.toLocaleString('it-IT', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginTop: 10,
                  }}
                >
                  <Text style={styles.textLeft}>Tổng cộng</Text>
                  <Text style={styles.textRight}>
                    {(classData?.price - classData?.fee)?.toLocaleString(
                      'it-IT',
                      {
                        style: 'currency',
                        currency: 'VND',
                      },
                    )}
                  </Text>
                </View>
              </BoxShadow>
            </View>
          ) : null}

          <CustomActionSheet
            title={'Xác nhận hủy đăng ký'}
            arrayActions={['Xác nhận', 'Thoát']}
            message={classData.title ? `Lớp : ${classData.title}` : ''}
            actionSheetOnPress={handleActionSheetOnPress}
            shouldShow={showActionSheet}
            cancelButtonIndex={1}
            destructiveButtonIndex={0}
          />
        </View>
      )}
    </Container>
  );
};

export default DetailClass;

const styles = StyleSheet.create({
  textRight: {justifyContent: 'flex-end', color: '#EE6423', fontSize: 14},
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
    paddingVertical: 30,
    paddingHorizontal: 16,
    borderRadius: 0,
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
    justifyContent: 'space-between',
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
    width: '45%',
    borderRadius: 20,
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
  textFooter: {
    marginLeft: 25,
  },
});
