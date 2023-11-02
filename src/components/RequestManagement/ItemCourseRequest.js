import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {Text} from 'react-native-elements';
import Toast from 'react-native-toast-message';
import BoxShadow from '../common/BoxShadow';
import Styles from '../../theme/MainStyles';
import ChoiceSpecificDay from '../CreateRequest/ChoiceSpecificDay';
import Colors from '../../theme/Colors';
import BackgroundGradientHorizontal from '../common/BackgroundGradientHorizontal';
import LabelDuration from '../Tutor/LabelDuration';
import ButtonCustom from '../common/ButtonFooterCustom';
import Constants from '../../constants';
import {userInviteTeacher, userDeleteRequest} from '../../api/class';
import CustomActionSheet from '../common/CustomActionSheet';
import ConfigStyle from '../../theme/ConfigStyle';

const ItemCourseRequest = (props) => {
  const teacherId = props.teacher?._id || props.teacher?.teacherId;
  const [typeAction, setTypeAction] = useState('');
  const [showPick, setShowPick] = useState(false);
  const [isBusy, setBusy] = useState(false);
  function handleInvite() {
    if (teacherId) {
      setTypeAction('invite');
      setShowPick(true);
      setTimeout(() => {
        setShowPick(false);
      }, 150);
    }
  }

  function handleDelete() {
    setTypeAction('delete');
    setShowPick(true);
    setTimeout(() => {
      setShowPick(false);
    }, 150);
  }
  async function inviteTeacher() {
    if (teacherId) {
      try {
        setBusy(true);
        const data = {
          teacherId: teacherId,
          classId: props.data?._id,
        };
        const response = await userInviteTeacher(data);
        setBusy(false);
        props.onRefresh(false);
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Mời dạy lớp học thành công',
        });
      } catch (error) {
        setBusy(false);
        console.log('handleInvite => ', error);
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
    } else {
      props.navigation.navigate('ShowAllList', {
        type: 'class',
        title: 'Danh sách giáo viên',
      });
    }
  }

  async function deleteRequest() {
    try {
      setBusy(true);
      const response = await userDeleteRequest(props.data?._id);
      props.onRefresh(false);
      setBusy(false);
    } catch (error) {
      setBusy(false);
      console.log('deleteRequest ==>', error);
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

  function handleActionSheetOnPress(index) {
    if (typeAction === 'invite' && index === 0) {
      inviteTeacher();
    }
    if (typeAction === 'delete' && index === 0) {
      deleteRequest();
    }
  }

  function leftAction() {
    props.navigation.navigate('UserCreateRequest', {
      access: 'student',
      _id: props.data?._id,
    });
  }

  return (
    // <TouchableWithoutFeedback onPress={()=>{
    //   // props.navigation.navigate('DetailRequest')
    //   console.log(1)
    // }}>
    <BoxShadow style={{...styles.container, ...props.containerStyle}}>
      <TouchableWithoutFeedback
        onPress={() =>
          props.navigation.navigate('DetailRequest', {
            title: props.data?.title,
            _id: props.data?._id,
            isRequest: props.data?.isRequest,
          })
        }
      >
        <View>
          <View style={[Styles.flexRow, {flex: 5, marginBottom: 5}]}>
            <View style={[{flex: 3}]}>
              <Text
                numberOfLines={1}
                style={[Styles.textLight, Styles.textBlack3, {fontSize: 12}]}
              >
                Tên lớp:{' '}
                <Text style={[{fontSize: 14}, Styles.textNormal]}>
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
            <TouchableOpacity
              disabled={isBusy}
              onPress={() => {
                handleDelete();
              }}
            >
              <Image
                source={require('../../assets/images/icon-Delete.png')}
                style={styles.iconDelete}
              />
            </TouchableOpacity>
          </View>
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
            Học phí:{' '}
            <Text
              style={[Styles.textNormal, Styles.textOrange, {fontSize: 14}]}
            >
              {' '}
              {props.data?.price?.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              })}
            </Text>
          </Text>
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
              {' '}
              {props.data?.fee?.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              })}
            </Text>
          </Text>
          <Text
            style={{
              ...Styles.textLight,
              ...Styles.textBlack3,
              ...styles.spaceVertical,
              fontSize: 12,
            }}
          >
            Trạng thái:{' '}
            <Text
              style={{
                ...Styles.textNormal,
                fontSize: 14,
                color:
                  Constants.STATUS_CLASS_COLOR[props.data?.status || 'pending'],
              }}
            >
              {Constants.STATUS_CLASS[props.data?.status || 'pending']}
            </Text>
          </Text>
          <View
            style={{
              ...styles.groupBtn,
              justifyContent:
                teacherId &&
                !props.teacher?.teacherId &&
                props.access !== 'student'
                  ? 'flex-end'
                  : 'space-between',
            }}
          >
            {!props?.data?.teacher ? (
              <ButtonCustom
                style={styles.btnAction}
                // isBusy={leftBusSy}
                disabled={isBusy || props?.status !== 'pending'}
                text={'CHỈNH SỬA'}
                onPress={leftAction}
                // disabled={props?.data?.teacher ? true : false}
                outline={true}
              />
            ) : null}
            {!props?.data?.teacher ? (
              <ButtonCustom
                style={styles.btnAction}
                isBusy={isBusy}
                disabled={
                  new Date(props?.data?.startAt).getTime() <
                  new Date().getTime()
                }
                text={teacherId ? 'MỜI DẠY' : 'YÊU CẦU'}
                onPress={() => {
                  // console.log('id teacher', props?.teacher?._id);
                  // const index = props?.data?.teacherListInvite
                  //   ?.map((val) => {
                  //     console.log(val.id);
                  //     return val.id;
                  //   })
                  //   .indexOf(teacherId);
                  // console.log(index);
                  if (teacherId) {
                    handleInvite();
                  } else {
                    // console.log(props.data)
                    props.navigation.navigate('ShowAllList', {
                      type: 'teacher',
                      title: 'Danh sách gia sư nhận lớp',
                      hideBackground: false,
                      titleStyle: {fontSize: 16},
                      classId: props.data?._id,
                      className: props.data?.title,
                      fill: 'requestById',
                    });
                  }
                }}
              />
            ) : null}
            {props?.data?.teacher ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    textAlign: 'center',
                    color: Colors.grey,
                    fontStyle: 'italic',
                  }}
                >
                  Đã có giáo viên nhận lớp
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableWithoutFeedback>
      <CustomActionSheet
        title={typeAction === 'invite' ? 'Mời dạy lớp' : 'Xóa yêu cầu'}
        message={
          typeAction === 'invite'
            ? `Mời giáo viên ${props?.teacher?.fullName} dạy lớp ${props.data?.title}`
            : `Lớp ${props.data?.title}`
        }
        arrayActions={['Xác nhận', 'Hủy']}
        actionSheetOnPress={handleActionSheetOnPress}
        shouldShow={showPick}
        cancelButtonIndex={1}
        destructiveButtonIndex={0}
      />
    </BoxShadow>
  );
};

export default ItemCourseRequest;
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
    justifyContent: 'flex-end',
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
});
