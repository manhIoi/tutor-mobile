import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import {Text} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-toast-message';
import BoxShadow from '../common/BoxShadow';
import ImageUtil from '../../utils/images.util';
import Styles from '../../theme/MainStyles';
import ChoiceSpecificDay from '../CreateRequest/ChoiceSpecificDay';
import Colors from '../../theme/Colors';
import IconChatActive from '../../assets/images/tab/chat1.svg';
import BackgroundGradientHorizontal from '../common/BackgroundGradientHorizontal';
import LabelDuration from '../Tutor/LabelDuration';
import config from '../../../config/config';
import ButtonCustom from '../common/ButtonFooterCustom';
import CustomActionSheet from '../common/CustomActionSheet';
import {teacherApproveStudent, teacherRejectStudent} from '../../api/class';
import ConfigStyle from '../../theme/ConfigStyle';

const ItemStudentRegistry = (props) => {
  const data = {
    name: 'Toán cao cấp',
    code: '001',
    nameTeacher: 'Avi Dam',
    description: 'Im very enjoy your class',
  };
  const [disabled, setDisabled] = useState(false);
  const [leftBusSy, setLeftBusy] = useState(false);
  const [rightBusy, setRightBusy] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [checked, setChecked] = useState('');

  async function handleDismiss() {
    try {
      setDisabled(true);
      setLeftBusy(true);
      const response = await teacherRejectStudent(props.data._id);
      setLeftBusy(false);
      setDisabled(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'success',
        text1: 'Từ chối đăng ký thành công',
      });
      props.onRefresh(false);
    } catch (error) {
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
  async function handleApprove() {
    try {
      setDisabled(true);
      setRightBusy(true);
      await teacherApproveStudent(props.data._id);
      setRightBusy(false);
      setDisabled(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'success',
        text1: 'Duyệt đăng ký thành công',
      });
      props.onRefresh(false);
    } catch (error) {
      setRightBusy(false);
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
  function onPressDismiss() {
    setShowActionSheet(true);
    setTimeout(() => {
      setShowActionSheet(false);
    }, 200);
  }

  async function handleActionSheetOnPress(index) {
    switch (index) {
      case 0:
        await handleDismiss();
        break;
      case 1: {
        break;
      }
      default:
        break;
    }
  }

  return (
    <BoxShadow style={styles.container}>
      <View style={[Styles.flexRow, {flex: 5, marginBottom: 5}]}>
        <View style={[{flex: 1}]}>
          <FastImage
            source={{
              uri:
                props.data?.user?.avatar?.medium?.indexOf('http') !== -1
                  ? props.data?.user?.avatar?.medium
                  : `${config.IMAGE_MD_URL}${props.data?.user?.avatar?.medium}`,
            }}
            style={styles.image}
          />
        </View>
        <View
          style={[{flex: 3, marginHorizontal: 20, justifyContent: 'center'}]}
        >
          <Text style={{fontSize: 20, color: Colors.black4}}>
            {props.data?.user?.fullName}
          </Text>
          <Text>{''}</Text>
          <Text style={{fontSize: 12, color: Colors.greyBold}}>
            {props.data?.status === 'pending'
              ? 'Đang chờ duyệt'
              : props.data?.status === 'reject'
              ? 'Đã từ chối'
              : props.data?.status === 'approve'
              ? 'Đã duyệt'
              : ''}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            style={styles.itemChat}
            onPress={() => {
              props.navigation.push('InboxChat', {
                to: props.data?.user?.id,
                userReceive: {
                  avatar: props.data?.user?.avatar,
                  online: props.data?.user?.isOnline,
                  fullName: props.data?.user?.fullName,
                },
              });
            }}
          >
            <IconChatActive width={16}
height={16} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.groupBtn}>
        <ButtonCustom
          style={styles.btnAction}
          isBusy={leftBusSy}
          disabled={
            disabled ||
            props.data?.status === 'reject' ||
            checked ||
            props.data?.status === 'approve'
          }
          text={'KHÔNG DUYỆT'}
          onPress={onPressDismiss}
          outline={true}
          textBtn={{fontSize: 12, paddingHorizontal: 10}}
        />
        <ButtonCustom
          style={styles.btnAction}
          isBusy={rightBusy}
          disabled={
            disabled ||
            props.data?.status === 'approve' ||
            checked ||
            props.data?.status === 'reject'
          }
          text={'DUYỆT'}
          onPress={handleApprove}
          textBtn={{fontSize: 12, paddingHorizontal: 10}}
        />
      </View>
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

export default ItemStudentRegistry;
const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    paddingHorizontal: 17,
    paddingVertical: 12,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 72 / 2,
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
});
