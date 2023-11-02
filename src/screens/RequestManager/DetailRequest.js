import React, {useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Text} from 'react-native-elements';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
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
  getTeacherByRequestId,
  userRejectRequest,
  userAcceptRequest,
} from '../../api/class';
import {getReviewByClass} from '../../api/users';
import ButtonCustom from '../../components/common/ButtonFooterCustom';
import CustomActionSheet from '../../components/common/CustomActionSheet';
import RecentActive from '../../components/ClassManager/RecentActive';
import AvatarInfo from '../../components/common/AvatarInfo';
import config from '../../../config/config';
import IconChatActive from '../../assets/images/tab/chat1.svg';
import IconEmpty from '../../assets/images/svg/empty-list.svg';

const INIT_REVIEWS = {
  data: [],
  totalItems: 0,
  currentPage: 1,
};
const DetailClass = (props) => {
  const user = useSelector((state) => state.auth.user);
  const [isBusy, setBusy] = useState(true);
  const [loadReview, setLoadReview] = useState(true);
  const [classData, setClassData] = useState({});
  const [requesting, setRequesting] = useState(false);
  const [leftRequest, setLeftRequest] = useState(false);
  const [rightRequest, setRightRequest] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [reviews, setReviews] = useState(INIT_REVIEWS);
  const [teachers, setTeachers] = useState([]);
  const [teacherRequest, setTeacherRequest] = useState([]);
  const [isBusyTeacher, setBusyTeacher] = useState(true);
  const [isBusyButon, setBusyButton] = useState(false);
  const IsFocused = useIsFocused();
  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    const promise = [
      getManagementRequest(props?.route?.params?._id),
      getTeacher(props?.route?.params?._id),
      getTeacherRequest(props?.route?.params?._id),
    ];
    await Promise.all(promise);
  }
  useFocusEffect(
    React.useCallback(() => {
      onRefresh();
    }, [IsFocused]),
  );
  function onRefresh() {
    fetchData();
  }
  async function acceptRequest(id) {
    try {
      setBusyButton(true);
      const accept = await userAcceptRequest(id);
      Toast.show({
        ...ConfigStyle.toastDefault,
        text1: 'Chấp nhận đề nghị thành công!',
        type: 'success',
      });
      setBusyButton(false);
      onRefresh();
    } catch (error) {
      console.log(error);
      setBusyButton(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        text1: 'Lỗi hệ thống!',
        type: 'error',
      });
    }
  }
  async function rejectRequest(id) {
    try {
      setBusyButton(true);
      const reject = await userRejectRequest(id);
      Toast.show({
        ...ConfigStyle.toastDefault,
        text1: 'Từ chối đề nghị thành công!',
        type: 'success',
      });
      setBusyButton(false);
      onRefresh();
    } catch (error) {
      console.log(error);
      setBusyButton(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        text1: 'Lỗi hệ thống!',
        type: 'error',
      });
    }
  }
  async function getTeacher(id, page = 1, limit = 2) {
    try {
      setBusyTeacher(true);
      const data = await getTeacherByRequestId(id, page, limit);
      setTeachers(data?.payload);
      setBusyTeacher(false);
    } catch (error) {
      setBusyTeacher(false);
      console.log(error);
    }
  }
  async function getTeacherRequest(id, page = 1, limit = 2, status = false) {
    try {
      setBusyTeacher(true);
      const data = await getTeacherByRequestId(id, page, limit, status);
      setTeacherRequest(data?.payload);
      setBusyTeacher(false);
    } catch (error) {
      setBusyTeacher(false);
      console.log(error);
    }
  }
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
      // props.navigation.goBack();
    }
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
    } catch (error) {
      setRequesting(false);
      setLeftRequest(false);
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
            !classData?.statusRegister?.id ||
            isBusy ||
            classData.status === 'ongoing'
          }
          text={'HỦY ĐĂNG KÝ'}
          onPress={handleClickCancel}
        />
      )}

      <ButtonCustom
        style={styles.wrapBtn}
        isBusy={rightRequest}
        disabled={
          requesting ||
          classData?.statusRegister?.id ||
          isBusy ||
          classData.status === 'ongoing'
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
  const ItemTeacher = (item) => {
    return (
      <BoxShadow style={styles.container}>
        <View style={[Styles.flexRow, {flex: 5, marginBottom: 5}]}>
          <View style={[{flex: 1}]}>
            <FastImage
              source={{
                uri: config?.IMAGE_SM_URL + item?.item?.teacher?.avatar?.small,
              }}
              style={styles.image}
            />
          </View>
          <View
            style={[{flex: 2, marginHorizontal: 20, justifyContent: 'center'}]}
          >
            <Text style={{fontSize: 20, color: Colors.black4}}>
              {item?.item?.teacher?.fullName}
            </Text>
            <Text>{''}</Text>
            <Text style={{fontSize: 12, color: Colors.greyBold}}>
              {item?.item?.status === 'pending'
                ? 'Đang chờ duyệt'
                : item?.item?.status === 'reject' ||
                  item?.item?.status === 'cancel'
                ? 'Đã từ chối'
                : item?.item?.status === 'approve'
                ? 'Đã duyệt'
                : ''}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.itemChat}
              onPress={() => {
                props.navigation.push('InboxChat', {
                  to: item?.item?.teacher?._id,
                  userReceive: {
                    avatar: item?.item?.teacher?.avatar,
                    online: false,
                    fullName: item?.item?.teacher?.fullName,
                  },
                });
              }}
            >
              <IconChatActive width={16}
height={16} />
            </TouchableOpacity>
          </View>
        </View>
        {item?.isInvite ? null : (
          <View style={styles.groupBtn}>
            <ButtonCustom
              style={styles.btnAction}
              // isBusy={leftBusSy}
              disabled={
                isBusyButon ||
                item?.item?.status === 'reject' ||
                item?.item?.status === 'approve' ||
                item?.item?.status === 'cancel'
              }
              text={'KHÔNG DUYỆT'}
              onPress={async () => rejectRequest(item?.item?._id)}
              textBtn={{fontSize: 12, paddingHorizontal: 10}}
            />
            <ButtonCustom
              style={styles.btnAction}
              // isBusy={rightBusy}
              disabled={
                isBusyButon ||
                item?.item?.status === 'reject' ||
                item?.item?.status === 'approve' ||
                item?.item?.status === 'cancel'
              }
              //   disabled ||
              //   props.data?.status === 'approve' ||
              //   checked ||
              //   props.data?.status === 'reject'
              // }
              text={'DUYỆT'}
              onPress={async () => acceptRequest(item?.item?._id)}
              textBtn={{fontSize: 12, paddingHorizontal: 10}}
            />
          </View>
        )}
        <CustomActionSheet
          title={'Từ chối đăng ký'}
          arrayActions={['Xác nhận', 'Thoát']}
          message={
            props.data?.user?.fullName
              ? `Học viên : ${props.data?.user?.fullName}`
              : ''
          }
          actionSheetOnPress={handleActionSheetOnPress}
          shouldShow={showActionSheet}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
        />
      </BoxShadow>
    );
  };

  return (
    <Container
      title={classData?.title || props.route?.params?.title}
      arrowBack={true}
      contentBarStyles={{justifyContent: 'space-between'}}
      navigation={props.navigation}
      headerHeight={ConfigStyle.statusBarHeight}
      hideBackground={false}
      keyboardShouldPersistTaps={true}
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
            chat={props.route?.params?.isRequest}
            classRequest={props.route?.params?.classRequest}
            details={true}
            isFollow={props?.route?.params?.isFollow}
            chat={true}
            hideTeacher={true}
            isRequest={classData?.isRequest}
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
          </BoxShadow>
          {/* <RecentActive */}
          {/*  title={'Danh sách giáo viên'} */}
          {/*  isRequest={true} */}
          {/*  navigation={props.navigation} */}
          {/*  data={classData?.teacher} */}
          {/* /> */}
          {classData?.teacher ? (
            <View style={{marginTop: 20}}>
              <Text style={{fontSize: ConfigStyle.font20}}>
                Giáo viên nhận lớp
              </Text>
              <BoxShadow style={{...styles.container, flexDirection: 'row'}}>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View>
                    <Image
                      source={{
                        uri:
                          // config?.IMAGE_SM_URL +
                          classData?.teacher?.avatar?.small,
                      }}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        borderWidth: 1,
                        borderColor: Colors.borderThin,
                      }}
                    />
                    <View
                      style={{
                        ...styles.marker,
                        ...props.styleMarker,
                        backgroundColor: classData?.teacher?.isOnline
                          ? Colors.green
                          : Colors.grey,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: 'column',
                      marginHorizontal: 20,
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{fontSize: ConfigStyle.font16}}>
                      {classData?.teacher?.fullName}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={{
                    ...styles.itemChat,
                    position: 'absolute',
                    top: 0,
                    right: 10,
                  }}
                  onPress={() => {
                    props.navigation.push('InboxChat', {
                      to: classData?.teacher?.id,
                      userReceive: {
                        avatar: classData?.teacher?.avatar,
                        online: false,
                        fullName: classData?.teacher?.fullName,
                      },
                    });
                  }}
                >
                  <IconChatActive width={16}
height={16} />
                </TouchableOpacity>
              </BoxShadow>
            </View>
          ) : null}
          {!classData?.teacher ? (
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginTop: 10,
              }}
            >
              {teachers?.length > 0 ? (
                <Text style={{fontSize: ConfigStyle.font20}}>
                  {' '}
                  Danh sách mời dạy
                </Text>
              ) : null}
              {teachers?.length >= 2 ? (
                <TouchableOpacity
                  onPress={() => {
                    props?.navigation.navigate('ListTeacher', {
                      _id: props?.route?.params?._id,
                      title: classData?.title,
                      isInvite: true,
                      requestTitle: 'Danh sách mời dạy',
                    });
                  }}
                  style={{justifyContent: 'center', marginRight: 10}}
                >
                  <Text style={{fontSize: ConfigStyle.font12}}>Xem tất cả</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
          {!isBusyTeacher ? (
            !classData?.teacher && teachers?.length > 0 ? (
              <FlatList
                data={teachers}
                renderItem={({item, index}) => (
                  <ItemTeacher isInvite={true}
item={item} />
                )}
              />
            ) : // <View style={Styles.wrapEmptyImage}>
            //   <IconEmpty width={'50%'} height={'50%'} />
            //   <Text style={Styles.textBlack3}>Không có dữ liệu</Text>
            // </View>
            null
          ) : (
            <View style={{marginTop: 20}}>
              <ActivityIndicator color={Colors.orange} />
            </View>
          )}

          {!classData?.teacher ? (
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginTop: 10,
              }}
            >
              {teacherRequest?.length > 0 ? (
                <Text style={{fontSize: ConfigStyle.font20}}>
                  {' '}
                  Danh sách đề nghị
                </Text>
              ) : null}
              {teacherRequest?.length >= 2 ? (
                <TouchableOpacity
                  onPress={() => {
                    props?.navigation.navigate('ListTeacher', {
                      _id: props?.route?.params?._id,
                      title: classData?.title,
                      isInvite: false,
                      requestTitle: 'Danh sách đề nghị',
                    });
                  }}
                  style={{justifyContent: 'center', marginRight: 10}}
                >
                  <Text style={{fontSize: ConfigStyle.font12}}>Xem tất cả</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
          {!isBusyTeacher ? (
            !classData?.teacher && teacherRequest?.length > 0 ? (
              <FlatList
                data={teacherRequest}
                renderItem={({item, index}) => (
                  <ItemTeacher isInvite={false}
item={item} />
                )}
              />
            ) : // <View style={Styles.wrapEmptyImage}>
            //   <IconEmpty width={'50%'} height={'50%'} />
            //   <Text style={Styles.textBlack3}>Không có dữ liệu</Text>
            // </View>
            null
          ) : (
            <View style={{marginTop: 20}}>
              <ActivityIndicator color={Colors.orange} />
            </View>
          )}
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
  // container: {
  //   marginHorizontal: 15,
  //   paddingTop: 0,
  //   flex: 1,
  // },
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
  wrapColItems: {
    width: 0.5 * window,
  },
  marker: {
    width: 14,
    height: 14,
    borderWidth: 2.5,
    borderColor: Colors.whiteColor,
    backgroundColor: Colors.orange,
    borderRadius: 50,
    position: 'absolute',
    bottom: 5,
    right: -3,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 72 / 2,
    borderWidth: 1,
    borderColor: Colors.borderThin,
  },
  groupBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  btnAction: {
    width: '45%',
    borderRadius: 20,
  },
  btnCancel: {
    borderWidth: 1,
    borderColor: Colors.orange2,
  },
  textAction: {
    textAlign: 'center',
    color: Colors.whiteColor,
    fontSize: 13,
    paddingVertical: 3,
  },
  textCancel: {
    color: Colors.orange2,
  },
  iconDelete: {width: 14, height: 18},
  itemChat: {
    marginTop: 10,
    paddingHorizontal: 3,
    paddingVertical: 3,
  },
  container: {
    marginBottom: 15,
    paddingHorizontal: 17,
    paddingVertical: 12,
  },
});
