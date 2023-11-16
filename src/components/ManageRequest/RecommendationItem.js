import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
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
import IconDelete from '../../assets/images/svg/delete.svg';
import ButtonCustom from '../common/ButtonFooterCustom';
import CustomActionSheet from '../common/CustomActionSheet';
import {
  deleteManagmentRequest,
  cancelManagementRequest,
  deleteRecommend,
} from '../../api/class';
import ConfigStyle from '../../theme/ConfigStyle';
import Constants from '../../constants';

const RecommnedItem = (props) => {
  const [data, setData] = useState(props?.item?.class || null);
  const [rightBusy, setRightBusy] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [destructiveButtonIndex, setDestructiveButtonIndex] = useState(0);
  const [showActionSheet, setShowActionSheet] = useState(false);
  function handleClickCancel() {
    setShowActionSheet(true);
    setTimeout(() => {
      setShowActionSheet(false);
    }, 200);
  }
  async function deleteClass() {
    try {
      setRightBusy(true);
      const deleteRequest = await deleteRecommend(props?.recommenId);
      if (deleteRequest) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Xóa lớp thành công!',
        });
        setRightBusy(false);
        setDisabled(false);
        props.onRefresh();
      }
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

  async function cancelRequest() {
    try {
      setRightBusy(true);
      const deleteInvite = await cancelManagementRequest(props?.recommend);
      if (deleteInvite) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Hủy bỏ lớp thành công!',
        });
        setRightBusy(false);
        setDisabled(false);
        props?.onRefresh();
      }
    } catch (error) {
      setRightBusy(false);
      setDisabled(false);
      console.log(error);
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
  async function handleActionSheetOnPress(index) {
    switch (index) {
      case 0:
        if (destructiveButtonIndex === 0) {
          await cancelRequest();
        } else await deleteClass();
        break;
      case 1: {
        break;
      }
      default:
        break;
    }
  }
  return (
    <BoxShadow style={{...styles.container, ...props.containerStyle}}>
      <TouchableWithoutFeedback
        onPress={() =>
          props.navigation.navigate('DetailRequest', {
            title: data?.title,
            _id: data?._id,
            isRequest: data?.isRequest,
          })
        }
      >
        <View>
          <View style={[Styles.flexRow, {flex: 6, marginBottom: 5}]}>
            <View style={[{flex: 3}]}>
              <Text
                numberOfLines={1}
                style={[Styles.textLight, Styles.textBlack3, {fontSize: 12}]}
              >
                Tên lớp:{' '}
                <Text style={[{fontSize: 14}, Styles.textNormal]}>
                  {' '}
                  {data?.title}
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
                  {' '}
                  {data?.classCode || '1111'}
                </Text>
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                // console.log(1);
                setDestructiveButtonIndex(1);
                handleClickCancel();
              }}
            >
              <IconDelete width={13.22}
height={16.18} />
            </TouchableOpacity>
          </View>
          <View style={[Styles.flexRow, {flex: 2, marginBottom: 5}]}>
            <View style={[{flex: 3}]}>
              <Text
                numberOfLines={1}
                style={[Styles.textLight, Styles.textBlack3, {fontSize: 12}]}
              >
                Tình trạng:
                <Text
                  style={[
                    {
                      fontSize: 14,
                      color:
                        Constants.STATUS_CLASS_COLOR[data?.status],
                    },
                    Styles.textNormal,
                  ]}
                >
                  {' '}
                  {Constants.STATUS_CLASS[data?.status]}
                </Text>
              </Text>
            </View>
          </View>
          <ChoiceSpecificDay
            containerStyle={{marginHorizontal: 0}}
            dayStudy={data?.weekDays}
            handleChange={null}
          />
          <LabelDuration
            startDate={data?.startAt}
            finishDate={data?.endAt}
            startTime={
              new Date(
                2020,
                5,
                22,
                `${data?.timeStartAt.hour}`,
                `${data?.timeStartAt.minute}`,
              )
            }
            finishTime={
              new Date(
                2020,
                5,
                22,
                `${data?.timeEndAt.hour}`,
                `${data?.timeEndAt.minute}`,
              )
            }
            totalLesson={data?.totalLesson}
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
              {data?.price.toLocaleString('it-IT', {
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
            Phí nhận lớp:
            <Text
              style={[Styles.textNormal, Styles.textOrange, {fontSize: 14}]}
            >
              {data?.fee.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              })}
            </Text>
          </Text>
          <View style={styles.groupBtn}>
            {props?.status === 'pending' ? (
              <ButtonCustom
                style={styles.btnAction}
                isBusy={rightBusy}
                disabled={disabled}
                // style={styles.textAction}
                text={
                  props?.status === 'pending' ? 'HỦY' : 'Thanh toán nhậnoán lớp'
                }
                onPress={() => {
                  setDestructiveButtonIndex(0);
                  props?.status === 'pending'
                    ? handleClickCancel()
                    : props?.navigation?.navigate('BillPayment');
                }}
                outline={props?.status === 'pending'}
              />
            ) : null}
          </View>
          <CustomActionSheet
            title={
              destructiveButtonIndex === 0
                ? 'Xác nhận hủy lớp'
                : 'Xác nhận xóa yêu cầu'
            }
            arrayActions={['Xác nhận', 'Thoát']}
            message={data?.title ? `Lớp : ${data?.title}` : ''}
            actionSheetOnPress={handleActionSheetOnPress}
            shouldShow={showActionSheet}
            cancelButtonIndex={1}
            destructiveButtonIndex={0}
          />
        </View>
      </TouchableWithoutFeedback>
    </BoxShadow>
  );
};

export default RecommnedItem;
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
    width: '100%',
  },
  btnAction: {
    width: '50%',
    borderRadius: 20,
  },
  btnCancel: {
    borderWidth: 1,
    borderColor: Colors.orange2,
  },
  textAction: {
    textAlign: 'center',
    color: Colors.whiteColor,
    fontSize: 12,
    paddingVertical: 3,
  },
  textCancel: {
    color: Colors.orange2,
  },
});
