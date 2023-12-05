import React, {useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Text} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import ConfigStyle from '../../theme/ConfigStyle';
import Container from '../../components/common/ContainerAnimated';
import Styles from '../../theme/MainStyles';
import BoxShadow from '../../components/common/BoxShadow';
import Colors from '../../theme/Colors';
import ImageUtils from '../../utils/images.util';

import {
  cancelRegistryClass,
  registerClass,
  teacherRegistryRequest,
  getTeacherByRequestId,
  userRejectRequest,
  userAcceptRequest, getDetailRequestCreated, updateDetailRequest,
} from '../../api/class';
import ButtonCustom from '../../components/common/ButtonFooterCustom';
import CustomActionSheet from '../../components/common/CustomActionSheet';
import config from '../../../config/config';
import IconChatActive from '../../assets/images/tab/chat1.svg';
import TutorRequestItem from "../../components/RequestManagement/TutorRequestItem";
import {useSelector} from "react-redux";

const INIT_REVIEWS = {
  data: [],
  totalItems: 0,
  currentPage: 1,
};
const DetailClass = (props) => {

  const user = useSelector(state => state.auth.user);
  const [classData, setClassData] = useState(props.route?.params?.tutorRequest);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [isBusyButon, setBusyButton] = useState(false);
  const coursesString = classData?.subjects?.map?.(s => s?.name).join(', ')
  const isMyRequest = classData?.user?._id === user?._id;
  const isMyClass = classData.teacher?._id === user?._id;
  const isClassNotApprove = user?.role === 'teacher' && !classData?.isTeacherApproved

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

  const handleClickJoinClass = () => {
    setShowActionSheet(true);
  }

  const handleJoinClass = async () => {
    try {
      if (user.role === 'teacher') {
        const response = await updateDetailRequest(classData._id, {
          teacher: {
            _id: user._id,
          },
          status: 1,
          isTeacherApproved: true,
        })
        if (response) {
          Toast.show({
            ...ConfigStyle.toastDefault,
            text1: 'Nhận lớp thành công!',
            type: 'success',
          });
          props.navigation.goBack()
        }
      } else {
        const response = await updateDetailRequest(classData._id, {
          students: [...classData, { _id: user._id }]
        })
        if (response) {
          Toast.show({
            ...ConfigStyle.toastDefault,
            text1: 'Tham gia lớp thành công!',
            type: 'success',
          });
          props.navigation.goBack()
        }
      }

    } catch (e) {
      Toast.show({
        ...ConfigStyle.toastDefault,
        text1: 'Nhận lớp không thành công!',
        type: 'error',
      });
    }
  }

  async function handleActionSheetOnPress(index) {
    setShowActionSheet(false);
    switch (index) {
      case 0: {
        if (isMyRequest) {
        } else {
          await handleJoinClass()
        }
        break;
      }
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

  const renderButton = () => {
    if (isMyRequest) return <ButtonCustom
        style={{ width: '100%' }}
        text={'HỦY ĐĂNG KÝ'}
        onPress={handleClickCancel}
    />
    if (isMyClass && isClassNotApprove) {
      return <ButtonCustom
          style={{ width: '100%' }}
          text={'NHẬN LỚP NGAY'}
          onPress={handleClickJoinClass}
      />
    }
    return null;
  }

  return (
    <Container
      title={"Chi tiết"}
      arrowBack={true}
      contentBarStyles={{justifyContent: 'space-between'}}
      navigation={props.navigation}
      headerHeight={ConfigStyle.statusBarHeight}
      hideBackground={false}
      keyboardShouldPersistTaps={true}
      imageSource={ImageUtils.bgNotDot}
    >
      <View style={styles.container}>
        <Text style={{fontSize: ConfigStyle.font20}}>
          Giới thiệu
        </Text>
        <View>
          <Text>Tiêu đề: {classData?.title || ''}</Text>
          <Text>Mô tả: {classData?.description || ''}</Text>
          <Text>Môn học: {coursesString || ''}</Text>
        </View>
        <Text style={{fontSize: ConfigStyle.font20}}>
          Thông tin lớp
        </Text>
        <TutorRequestItem data={classData} />
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
                          uri: classData?.teacher?.avatar,
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
                {classData?.teacher?.id !== user._id ? null : <TouchableOpacity
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
                          fullName: classData?.teacher?.fullName,
                        },
                      });
                    }}
                >
                  <IconChatActive width={16}
                                  height={16} />
                </TouchableOpacity>}
              </BoxShadow>
            </View>
        ) : null}

        {renderButton()}
        <CustomActionSheet
            title={isMyRequest ? 'Xác nhận hủy đăng ký' : 'Xác nhận nhận lớp'}
            arrayActions={['Xác nhận', 'Thoát']}
            message={classData.title ? `Lớp : ${classData.title}` : ''}
            actionSheetOnPress={handleActionSheetOnPress}
            shouldShow={showActionSheet}
            cancelButtonIndex={1}
            destructiveButtonIndex={0}
        />
      </View>
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
