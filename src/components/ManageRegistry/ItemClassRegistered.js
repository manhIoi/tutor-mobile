import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {CheckBox, Text} from 'react-native-elements';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import BoxShadow from '../common/BoxShadow';
import Styles from '../../theme/MainStyles';
import ChoiceSpecificDay from '../CreateRequest/ChoiceSpecificDay';
import Colors from '../../theme/Colors';
import LabelDuration from '../Tutor/LabelDuration';
import Constants from '../../constants';
import {
  cancelRegistryClass,
  removeClassOfTeacher,
  teacherDeleteClassById,
  getManagementRequestOfUser,
  teacherRemind,
  teacherStartClass,
} from '../../api/class';
import ConfigStyle from '../../theme/ConfigStyle';
import ButtonCustom from '../common/ButtonFooterCustom';
import CustomActionSheet from '../common/CustomActionSheet';
import IconDelete from '../../assets/images/svg/delete.svg';
import CardModal from '../Calendar/Modal';

const ItemClassRegistered = (props) => {
  const [disabled, setDisabled] = useState(false);
  const [leftBusSy, setLeftBusy] = useState(false);
  const [rightBusy, setRightBusy] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [typeAction, setTypeAction] = useState('');
  const [isModalVisible, setisModalVisible] = React.useState(false);
  const [date, setDate] = useState(new Date());
  const toggleModal = () => {
    setisModalVisible(!isModalVisible);
  };
  async function removeClass() {
    try {
      setDisabled(true);
      setLeftBusy(true);
      const reject = await removeClassOfTeacher(props.data._id);
      setLeftBusy(false);
      setDisabled(false);
      props.onRefresh();
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'success',
        text1: 'Xóa thành công!',
      });
    } catch (error) {
      console.log(error);
      setLeftBusy(false);
      setDisabled(false);
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

  async function studentCancelRegistry() {
    try {
      if (props.idManagement) {
        setDisabled(true);
        setLeftBusy(true);
        await cancelRegistryClass(props.idManagement);
        setLeftBusy(false);
        setDisabled(false);
        props.onRefresh(false);
      }
    } catch (error) {
      setLeftBusy(false);
      setDisabled(false);
      if (error?.response?.data?.errors) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'error',
          text1: error.response.data.errors[0].msg,
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

  function handleClickCancel() {
    if (props?.access === 'teacher' && props.status === 'wait_start') {
      setTypeAction('delete');
    }
    setShowActionSheet(true);
    setTimeout(() => {
      setShowActionSheet(false);
    }, 200);
  }

  async function deleteClass() {
    try {
      setDisabled(true);
      const response = await teacherDeleteClassById(props.data?._id);
      props.onRefresh(false);
      setDisabled(false);
    } catch (error) {
      setDisabled(false);
      console.log('deleteClass ==>', error);
    }
  }

  async function handleActionSheetOnPress(index) {
    switch (index) {
      case 0:
        if (props.access === 'teacher') {
          if (props.status === 'wait_start') {
            deleteClass();
          } else {
            removeClass();
          }
        }
        if (props.access === 'student') {
          if (props.status === 'registered') {
            studentCancelRegistry();
          }
        }
        break;
      case 1: {
        break;
      }
      default:
        break;
    }
  }

  function goToManageRegistry() {
    props.navigation.navigate('ListRegistry', {
      _id: props.data?._id,
      order: props.data?.order,
      quantity: props.data?.quantity,
    });
  }

  function leftAction() {
    if (props.access === 'student') {
      handleClickCancel();
    }
    if (props.access === 'teacher') {
      if (props.status === 'pending') {
        handleClickCancel();
      } else if (props.status === 'wait_start') {
        // handleClickCancel();
        toggleModal();
      } else {
        props.navigation.navigate('Detail', {
          _idClass: props?.idManagement,
          _idLesson: props?.data?._id,
          isRequest: props?.data?.isRequest,
          isShowStudent: props?.isShowStudent,
          access: props?.access,
          status: props?.status,
        });
      }
    }
  }
  async function startClass() {
    try {
      setDisabled(true);
      setLeftBusy(true);
      const update = await teacherStartClass(props?.data?._id);
      setLeftBusy(false);
      setDisabled(false);
      props.onRefresh(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'success',
        text1: 'Cập nhật trạng thái lớp thành công',
      });
    } catch (error) {
      setLeftBusy(false);
      setDisabled(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Lỗi máy chủ',
      });
    }
  }
  function rightAction() {
    if (props.access === 'student') {
      // console.log(1)
      props.navigation.navigate('Detail', {
        _idClass: props?.data?._id,
        _idLesson: props?.data?._id,
        isRequest: props?.isRequest,
        title: props.data?.title,
        isPayment: true,
      });
    }
    if (props.access === 'teacher') {
      if (props.status === 'pending') {
        props.navigation.navigate('TeacherCreateClass', {_id: props.data?._id});
      } else if (props.status === 'upcoming') {
        goToManageRegistry();
      } else if (props?.status === 'wait_start') {
        startClass();
      } else if (props?.status === 'ongoing') {
        teacherRemindPayment(props?.data?._id);
      }
    }
  }
  async function teacherRemindPayment(id) {
    try {
      setLeftBusy(true);
      setRightBusy(true);
      const remind = await teacherRemind(id);
      console.log(remind);
      if (remind)
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Nhắc thanh toán thành công!',
        });
      setLeftBusy(false);
      setRightBusy(false);
    } catch (error) {
      console.log(error);
      setLeftBusy(false);
      setRightBusy(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Nhắc thanh toán thất bại!',
      });
    }
  }
  function openDetailClass() {
    if (props?.status === 'ongoing') {
      props.navigation.navigate('Detail', {
        _idClass: props?.data?._id,
        _idLesson: props?.data?._id,
        isRequest: props?.isRequest,
        title: props.data?.title,
        status: props?.status,
        isShowStudent: props?.isShowStudent,
        isPayment: props?.isPayment,
        requestStatus: props?.requestStatus,
        statusRegister: props?.data?.statusRegister,
        access: props?.access,
      });
    } else if (props.isRequest) {
      props.navigation.navigate('DetailClass', {
        title: props.data?.title,
        _id: props.data?._id,
        requestStatus: props?.requestStatus,
        statusRegister: props?.data?.statusRegister,
      });
    } else {
      if (props.access === 'student' && props.status === 'registered') {
        props.navigation.navigate('DetailClass', {
          title: props.data?.title,
          _id: props.data?._id,
          isRequest: props?.isRequest,
          requestStatus: props?.requestStatus,
        });
      } else {
        props.navigation.navigate('Detail', {
          _idClass: props?.data?._id,
          _idLesson: props?.data?._id,
          isRequest: props?.isRequest,
          title: props.data?.title,
          requestStatus: props?.requestStatus,
        });
      }
    }
  }
  return (
    <BoxShadow style={{...styles.container, ...props.containerStyle}}>
      <TouchableWithoutFeedback onPress={openDetailClass}>
        <View>
          {props.checked ? (
            props.status === 'ongoing' &&
            props?.access === 'student' &&
            !props?.isPayment ? (
              <TouchableOpacity
                style={{...styles.iconDelete, top: -15}}
                onPress={() => console.log(props.data._id)}
              >
                <CheckBox
                  center
                  checkedIcon="check-circle"
                  uncheckedIcon="circle-o"
                  checkedColor="green"
                  checked={true}
                  size={20}
                  checked={
                    props.selected?.indexOf(
                      props?.data?.statusRegister?.requestId,
                    ) !== -1
                  }
                  onPress={() =>
                    props.action(
                      props?.data?.statusRegister?.requestId,
                      props?.data?.price,
                    )
                  }
                  containerStyle={{
                    backgroundColor: '#fff',
                    borderWidth: 0,
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                    // position:"absolute", right:0, top:0
                  }}
                  // onPress={() =>props.action()}
                />
              </TouchableOpacity>
            ) : null
          ) : null}
          {props?.edit && props.status === 'upcoming' ? (
            <TouchableOpacity onPress={toggleModal}
style={styles.iconDelete}>
              <Icon size={15}
color={Colors.orange2}
name={'edit'} />
            </TouchableOpacity>
          ) : null}
          {(props.status === 'upcoming' && props.access !== 'teacher') ||
          (props.access === 'teacher' && props.status === 'wait_start') ? (
            <TouchableOpacity
              onPress={handleClickCancel}
              style={styles.iconDelete}
            >
              <IconDelete width={13.22}
height={16.18} />
            </TouchableOpacity>
          ) : null}
          <View style={[Styles.flexRow, {flex: 5, marginBottom: 5}]}>
            <View style={[{flex: 3}]}>
              <Text
                numberOfLines={1}
                style={[Styles.textLight, Styles.textBlack3, {fontSize: 12}]}
              >
                Tên lớp:{' '}
                <Text
                  style={{fontSize: 14, ...Styles.textNormal}}
                  numberOfLines={1}
                >
                  {props.data?.title}
                </Text>
              </Text>
            </View>
            <View style={[{flex: 2}]}>
              <Text
                numberOfLines={1}
                style={[Styles.textLight, Styles.textBlack3, {fontSize: 12}]}
              >
                Mã lớp:{' '}
                <Text style={[{fontSize: 14}, Styles.textNormal]}>
                  {props.data?.classCode}
                </Text>
              </Text>
            </View>
          </View>
          {props.hide ? (
            <View style={[Styles.flexRow, {flex: 5, marginBottom: 5}]}>
              <View style={[{flex: 3}]}>
                <Text
                  numberOfLines={1}
                  style={[Styles.textLight, Styles.textBlack3, {fontSize: 12}]}
                >
                  Tên giáo viên:{' '}
                  <Text
                    style={{fontSize: 14, ...Styles.textNormal}}
                    numberOfLines={1}
                  >
                    {props.data?.teacher?.fullName}
                  </Text>
                </Text>
              </View>
            </View>
          ) : null}
          {props.status === 'upcoming' ||
          (props.access === 'teacher' && props.status === 'ongoing') ? (
            <Text
              style={[
                Styles.textLight,
                Styles.textBlack3,
                styles.spaceVertical,
                {fontSize: 12},
              ]}
            >
              Trạng thái:{' '}
              <Text
                style={{
                  ...Styles.textNormal,
                  fontSize: 14,
                  color:
                    Constants.STATUS_CLASS_COLOR[
                      props.data?.status || 'pending'
                    ],
                }}
              >
                {Constants.STATUS_CLASS[props.data?.status || 'pending']}
              </Text>
              <Text>
                {' '}
                ({props.data.order}/{props.data.quantity})
              </Text>
            </Text>
          ) : null}
          <ChoiceSpecificDay
            containerStyle={{marginHorizontal: 0}}
            dayStudy={props.data.weekDays}
            handleChange={null}
            disabled={props.disabled}
          />
          <LabelDuration
            startTime={
              new Date(
                2020,
                8,
                2,
                props.data?.timeStartAt?.hour || 0,
                props.data?.timeStartAt?.minute || 0,
              )
            }
            finishTime={
              new Date(
                2020,
                8,
                2,
                props.data?.timeEndAt?.hour || 0,
                props.data?.timeEndAt?.minute || 0,
              )
            }
            startDate={props.data?.startAt}
            finishDate={props.data?.endAt}
            totalLesson={props.data?.totalLesson}
          />
          <Text
            style={[
              Styles.textLight,
              Styles.textBlack3,
              styles.spaceVertical,
              {fontSize: 12},
            ]}
          >
            Học phí:{'    '}
            <Text
              style={[Styles.textNormal, Styles.textOrange, {fontSize: 14}]}
            >
              {props.data?.price?.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              })}
            </Text>
          </Text>
          {props.access !== 'teacher' ? (
            !props.hide ? (
              <Text
                style={[
                  Styles.textLight,
                  Styles.textBlack3,
                  styles.spaceVertical,
                  {fontSize: 12},
                ]}
              >
                Trạng thái:{'  '}
                <Text
                  style={{
                    ...Styles.textNormal,
                    fontSize: 14,
                    color:
                      Constants.STATUS_CLASS_COLOR[
                        props.data?.status || 'pending'
                      ],
                  }}
                >
                  {Constants.STATUS_CLASS[props.data?.status || 'pending']}
                </Text>
              </Text>
            ) : null
          ) : (
            <Text
              style={[
                Styles.textLight,
                Styles.textBlack3,
                styles.spaceVertical,
                {fontSize: 12},
              ]}
            >
              Phí nhận lớp:{' '}
              <Text
                style={[Styles.textNormal, Styles.textOrange, {fontSize: 14}]}
              >
                {props.data?.fee?.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Text>
            </Text>
          )}

          {!props?.hide ? (
            <View
              style={{
                ...styles.groupBtn,
                justifyContent:
                  props.access === 'teacher' && props.status === 'upcoming'
                    ? 'flex-end'
                    : 'space-between',
              }}
            >
              {!(props.access === 'teacher' && props.status === 'upcoming') ? (
                // props?.data?.status !== 'approve' ? (
                <ButtonCustom
                  style={styles.btnAction}
                  isBusy={leftBusSy}
                  disabled={disabled || props?.requestStatus === 'approve'}
                  textBtn={
                    props.access === 'teacher' && props.status === 'ongoing'
                      ? {
                          fontSize: 12,
                          paddingHorizontal: 15,
                          paddingVertical: 5,
                        }
                      : {}
                  }
                  text={
                    props.access === 'student'
                      ? 'HỦY' // student view
                      : props.status === 'pending'
                      ? 'XÓA'
                      : props.status === 'upcoming'
                      ? 'CHỈNH SỬA'
                      : props.status === 'ongoing'
                      ? 'CHI TIẾT'
                      : props.status === 'wait_start'
                      ? 'CHỈNH SỬA'
                      : null
                  }
                  onPress={leftAction}
                  outline={true}
                />
              ) : // )
              null}
              {/* <CardModal */}
              {/*  action={toggleModal} */}
              {/*  deleted={false} */}
              {/*  changeSchedule={true} */}
              {/*  request={false} */}
              {/*  isModalVisible={isModalVisible} */}
              {/*  title={'Đổi lịch khai giảng'} */}
              {/*  dateStart={props?.data?.startAt} */}
              {/*  timeStart={props?.data?.timeStartAt} */}
              {/*  timeEnd={props?.data?.timeEndAt} */}
              {/*  _id={props?.data?._id} */}
              {/*  onRefresh={props?.onRefresh} */}
              {/* /> */}
              <CardModal
                changeSchedule={true}
                isModalVisible={isModalVisible}
                action={toggleModal}
                title={'Đổi lịch khai giảng'}
                access={props?.access}
                id={props?.data?._id}
                startAt={props?.data?.startAt}
                timeStartAt={props?.data?.timeStartAt}
                timeEndAt={props?.data?.timeEndAt}
                isRequest={props?.data?.isRequest}
                isChange={true}
                onRefresh={props?.onRefresh}
              />

              {/* {props?.requestStatus === 'approve' && !props?.isPayment ? ( */}
              <ButtonCustom
                style={{
                  ...styles.btnAction,
                  width:
                    props.access === 'teacher' && props.status === 'upcoming'
                      ? 'auto'
                      : '47%',
                }}
                isBusy={rightBusy}
                disabled={
                  disabled ||
                  ((props?.requestStatus !== 'approve' || props?.isPayment) &&
                    props?.access !== 'teacher')
                }
                textBtn={
                  props.access === 'teacher' && props.status === 'ongoing'
                    ? {
                        fontSize: 12,
                        paddingHorizontal: 2,
                        paddingVertical: 6,
                      }
                    : {}
                }
                text={
                  props.access === 'student'
                    ? !props?.isPayment
                      ? 'THANH TOÁN'
                      : 'ĐÃ THANH TOÁN'
                    : props.status === 'pending'
                    ? 'CHỈNH SỬA'
                    : props.status === 'upcoming'
                    ? 'Danh sách đăng ký'
                    : props.status === 'ongoing'
                    ? 'NHẮC THANH TOÁN'
                    : props.status === 'wait_start'
                    ? 'BẮT ĐẨU'
                    : null
                }
                onPress={rightAction}
              />
              {/* ) : null} */}
            </View>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
      <CustomActionSheet
        title={
          props?.isEdit || props.status === 'upcoming'
            ? 'Xác nhận xóa lớp'
            : props?.access === 'teacher' && props?.status === 'wait_start'
            ? typeAction === 'delete'
              ? 'Hủy lớp đang chờ mở ?'
              : ''
            : 'Xác nhận hủy đăng ký'
        }
        arrayActions={['Xác nhận', 'Thoát']}
        message={props.data.title ? `Lớp : ${props.data.title}` : ''}
        actionSheetOnPress={handleActionSheetOnPress}
        shouldShow={showActionSheet}
        cancelButtonIndex={1}
        destructiveButtonIndex={0}
      />
    </BoxShadow>
  );
};

export default ItemClassRegistered;
const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    paddingHorizontal: 17,
    paddingVertical: 12,
  },
  wrapDate: {
    flex: 1,
    backgroundColor: Colors.inboxSend,
    borderRadius: 15,
  },
  textDate: {
    textAlign: 'center',
    color: Colors.orange,
    paddingVertical: 5,
  },
  spaceVertical: {
    marginVertical: 2,
  },
  groupBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  btnAction: {
    width: '47%',
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
  iconDelete: {
    position: 'absolute',
    top: -5,
    right: -10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    zIndex: 99,
  },
});
