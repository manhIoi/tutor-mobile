import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Text} from 'react-native-elements';
import Swipeable from 'react-native-swipeable';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import {func} from 'prop-types';
import {useSelector} from 'react-redux';
import Container from '../../components/common/ContainerRenderList';
import MainStyles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';
import Header from '../../components/Notification/Header';
import BackgroundGradient from '../../components/common/BackgroudGradient';
import StatusBar from '../../components/common/StatusBar';
import {
  getNotification,
  getNotificationById,
  deleteNotificationById,
  readNotificationApi,
} from '../../api/chat';
import BoxShadow from '../../components/common/BoxShadow';
import {formatDDMMYYY} from '../../utils/string.util';
import Constants from '../../../constants/Values';
import Statusbar from '../../components/common/StatusBar';
import * as RootNavigation from '../../../RootNavigation';
import {teacherAcceptAndReject} from '../../api/class';

const width = Dimensions.get('window').width;

const INIT_VALUE = {
  data: [],
  currentPage: 1,
  totalItems: 0,
  limit: 10,
};

const AvailableAction = [
  'REGISTER_CLASS',
  'TEACHER_REQUEST',
  'ADMIN_APPROVE_CLASS',
  'TEACHER_REJECT_REQUEST',
  'TEACHER_APPROVE_REGISTER_CLASS',
  'BALANCE_CHANGE',
  'TEACHER_REMIND_PAYMENT',
  'TEACHER_APPROVE_REQUEST',
  'USER_REQUEST',
  'USER_APPROVE_REQUEST',
  'USER_REJECT_REQUEST',
  'USER_REQUEST_CHANGE_TIME',
  'ACCEPT_CHANGE_LESSON',
  'REJECT_CHANGE_LESSON',
  'TEACHER_REJECT_REGISTER_CLASS',
];

const NotificationScreen = (props) => {
  const {navigation} = props;
  // const { goBack } = navigation;
  const [status, setStatus] = useState(false);
  const [isModalVisible, setisModalVisible] = React.useState(false);
  const [isBusy, setBusy] = useState(false);
  const [_notifications, setNotifications] = useState([]);
  const [detailData, setDetailData] = useState({});
  const [refreshing, setRefresh] = useState(false);
  const newNotifications = useSelector(
    (state) => state.notification.newNotifications,
  );
  const user = useSelector((state) => state.auth.user);
  const [busyLeft, setBusyLeft] = useState(false);
  const [busyRight, setBusyRight] = useState(false);
  const notifications = useMemo(() => {
    return _notifications.map(item => {
      return {
        ...item,
        data: item?.data && JSON.parse(item?.data)
      }
    })
  }, [_notifications])

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    try {
      const response = await getNotification(user?._id)
      setNotifications(response);
    } catch (e) {
      console.info(`LOG_IT:: e`, e);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Lỗi hệ thống!',
      })
    }
  }
  const rightButtons = (id) => [
    <TouchableOpacity
      style={styles.rightButton}
      onPress={() => {
        alert('Dêlete');
      }}
    >
      <Text style={styles.textButton}>XÓA</Text>
    </TouchableOpacity>,
  ];
  const [newData, setNewData] = React.useState({});
  const toggleModal = () => {
    if (isModalVisible) {
      onRefresh(true);
    }
    setisModalVisible(!isModalVisible);
  };

  function hideModal() {
    if (isModalVisible) {
      onRefresh(true);
    }
    setisModalVisible(false);
  }

  function switchActionNotification() {
    hideModal();
    switch (detailData?.type) {
      case 'REGISTER_CLASS':
        props.navigation.navigate('Calendar', {
          screen: 'ListRegistry',
          params: {
            _id: detailData?.data?.class?._id,
            title: detailData?.data?.class?.title,
            isNotify: true,
          },
        });
        break;
      case 'TEACHER_REMIND_PAYMENT':
        detailData?.data?.isRequest
          ? props.navigation.navigate('Calendar', {
              screen: 'DetailRequest',
              params: {
                _idClass: detailData?.data?.id,
                _id: detailData?.data?.id,
                title: detailData?.data?.title,
                isRequest: detailData?.data?.isRequest,
                isNotify: true,
              },
            })
          : props.navigation.navigate('Calendar', {
              screen: 'Detail',
              params: {
                _idClass: detailData?.data?.id,
                isRequest: false,
                title: detailData?.data?.title,
                isShowStudent: false,
                status: 'ongoing',
                isNotify: true,
              },
            });
        break;
      case 'TEACHER_REQUEST':
      case 'USER_REQUEST':
      case 'USER_APPROVE_REQUEST':
      case 'USER_REJECT_REQUEST':
        props.navigation.navigate('Calendar', {
          screen: 'DetailRequest',
          params: {
            _id: detailData?.data?.class?._id,
            title: detailData?.data?.class?.title,
            isRequest: true,
          },
        });
        break;
      case 'ACCEPT_CHANGE_LESSON':
      case 'REJECT_CHANGE_LESSON':
        props.navigation.navigate('Calendar', {
          screen: 'DetailRequest',
          params: {
            _id: detailData?.data?.id,
            title: detailData?.data?.title,
            isRequest: true,
          },
        });
        break;
      case 'TEACHER_APPROVE_REQUEST':
        props.navigation.navigate('Calendar', {
          screen: 'DetailRequest',
          params: {
            _id: detailData?.data?.class?._id,
            title: detailData?.data?.class?.title,
            isRequest: true,
          },
        });
        break;
      case 'ADMIN_REJECT_CLASS':
      case 'ADMIN_APPROVE_CLASS':
        if (user.access === 'teacher') {
          props.navigation.navigate('Calendar', {
            screen: 'Detail',
            params: {
              _idClass: detailData?.data?.class?._id,
              isRequest: false,
              title: detailData?.data?.class?.title,
            },
          });
        } else if (user.access === 'student') {
          props.navigation.navigate('Calendar', {
            screen: 'DetailRequest',
            params: {
              _idClass: detailData?.data?.class?._id,
              title: detailData?.data?.class?.title,
              _id: detailData?.data?.class?._id,
              isRequest: true,
            },
          });
        }
        break;
      case 'TEACHER_REJECT_REQUEST':
        props.navigation.navigate('Calendar', {
          screen: 'DetailRequest',
          params: {
            title: detailData?.data?.class?.title,
            _id: detailData?.data?.class?._id,
            isRequest: true,
          },
        });
        break;
      case 'TEACHER_APPROVE_REGISTER_CLASS':
      case 'TEACHER_REJECT_REGISTER_CLASS':
        props.navigation.navigate('DetailClass', {
          _id: detailData?.data?.class?._id,
          title: detailData?.data?.class?.title,
        });
        break;
      case 'BALANCE_CHANGE':
        props.navigation.reset({
          index: 0,
          routes: [{name: 'Profile'}],
        });
        break;

      case 'PAYMENT_TUITION_SUCCESS':
        props.navigation.navigate('DetailClass', {
          title: detailData.data?.trackingInfo?.title,
          _id: detailData.data?.trackingInfo?._id,
        });
        break;
      case 'USER_REQUEST_CHANGE_TIME':
        break;
      default:
        break;
    }
  }

  async function onRefresh(loading = false) {
    if (!loading) {
      setRefresh(true);
    }
    getNotifications(1, 18, false, true);
  }

  const readNotification = async (item) => {
    try {
      if (item?.isRead) {
        return;
      }
      const newList = notifications.map?.(_item => {
       if (_item?._id === item?._id) return {
         ..._item,
         isRead: true,
       }
       return _item;
      })
      setNotifications(newList);
      readNotificationApi(item?._id);
    } catch (e) {

    }
  }

  const renderItem = ({item}) => {

    return (
      <Swipeable rightButtons={rightButtons(item?._id)}
rightButtonWidth={115}>
        <BoxShadow style={styles.card}>
          <TouchableOpacity
            onPress={() => readNotification(item)}
          >
            <Text
              numberOfLines={1}
              style={!item.isRead ? styles.viewTitle : styles.viewTitleSeen}
            >
              {item?.title || ''}
            </Text>
            <Text
              numberOfLines={4}
              style={!item.isRead ? styles.viewContent : styles.viewContentSeen}
            >
              {item?.message}
            </Text>
            <Text
              style={
                !item.isRead ? styles.viewDatetime : styles.viewDatetimeSeen
              }
            >
              {item?.createdAt}
            </Text>
          </TouchableOpacity>
        </BoxShadow>
      </Swipeable>
    );
  };

  const renderFooter = (
    <View style={{marginBottom: 20}}>
      {/*{notifications.data?.length >= notifications.totalItems ? (*/}
      {/*  <Text style={styles.countResult}>*/}
      {/*    {notifications.totalItems} kết quả*/}
      {/*  </Text>*/}
      {/*) : (*/}
      {/*  <ActivityIndicator color={Colors.orange} />*/}
      {/*)}*/}
    </View>
  );

  function handleLoadMore() {
    if (notifications.currentPage * 10 < notifications.totalItems) {
      getNotifications(notifications.currentPage + 1, 10, true, false);
    }
  }
  async function teacherAccept(type = 'accept', data, id) {
    try {
      setBusyLeft(true);
      setBusyRight(true);
      const accept = await teacherAcceptAndReject(type, data);
      setBusyLeft(false);
      setBusyRight(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'success',
        text1: 'Thay đổi lịch học thành công',
      });
      await deleteNotificationById(id);
      onRefresh();
      toggleModal();
    } catch (error) {
      setBusyLeft(false);
      setBusyRight(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Thay đổi lịch học thất bại',
      });
    }
  }
  async function teacherReject(type = 'reject', data, id) {
    try {
      setBusyLeft(true);
      setBusyRight(true);
      const reject = await teacherAcceptAndReject(type, data);
      setBusyLeft(false);
      setBusyRight(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'success',
        text1: 'Từ chối thay đổi lịch học thành công',
      });
      await deleteNotificationById(id);
      toggleModal();
      onRefresh();
    } catch (error) {
      setBusyLeft(false);
      setBusyRight(false);
      console.log(error);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Từ chối thay đổi lịch học thất bại',
      });
    }
  }
  return (
    <Container
      contentBarStyles={{justifyContent: 'space-between'}}
      navigation={props.navigation}
      headerHeight={ConfigStyle.statusBarHeight}
      hideBackground={true}
      header={
        <Statusbar
          headerHeight={ConfigStyle.statusBarHeight}
          hideBackground={false}
          arrowBack={true}
          title="Thông báo"
          navigation={props.navigation}
        />
      }
    >
      {isBusy ? (
        <ActivityIndicator
          style={styles.viewAccording}
          color={Colors.orange2}
          size={'small'}
        />
      ) : (
        <FlatList
          data={notifications}
          style={styles.flatlist}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.orange]}
            />
          }
          onEndReachedThreshold={0.4}
        />
      )}
      {isModalVisible ? (
        <Modal
          isVisible={isModalVisible}
          backdropOpacity={ConfigStyle.backdropOpacity}
          onBackdropPress={toggleModal}
        >
          <View style={styles.cardModal}>
            <Text numberOfLines={1}
style={styles.viewTitle}>
              {detailData.title}
            </Text>
            <Text style={styles.viewContent}>{detailData?.body}</Text>
            {AvailableAction.indexOf(detailData?.type) !== -1 ? (
              detailData?.type !== 'USER_REQUEST_CHANGE_TIME' ? (
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={styles.textDetail}
                    onPress={switchActionNotification}
                  >
                    Xem chi tiết
                  </Text>
                </View>
              ) : (
                <View style={{flexDirection: 'row', marginTop: 20}}>
                  <TouchableOpacity
                    disabled={busyLeft || busyRight}
                    onPress={() => {
                      const data = {
                        date: detailData?.data?.change_time?.date,
                        time: detailData?.data?.change_time?.time,
                        classId: detailData?.data?.class?._id,
                        lesson: detailData?.data?.change_time?.lesson,
                      };
                      teacherAccept('accept', data, detailData?._id);
                    }}
                  >
                    <Text style={styles.textDetail}> ĐỒNG Ý </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={busyLeft || busyRight}
                    onPress={() => {
                      const data = {
                        date: detailData?.data?.change_time?.date,
                        time: detailData?.data?.change_time?.time,
                        classId: detailData?.data?.class?._id,
                        lesson: detailData?.data?.change_time?.lesson,
                      };
                      teacherReject('reject', data, detailData?._id);
                    }}
                  >
                    <Text style={styles.textDetail}> TỪ CHỐI </Text>
                  </TouchableOpacity>
                </View>
              )
            ) : null}

            <TouchableOpacity
              style={styles.btnDetail}
              onPress={() => {
                toggleModal();
                // setStatus(!status);
                onRefresh();
              }}
            >
              <BackgroundGradient style={{borderRadius: 30}}>
                <Text style={styles.btnDetailText}>OK</Text>
              </BackgroundGradient>
            </TouchableOpacity>
          </View>
        </Modal>
      ) : null}
    </Container>
  );
};
const styles = StyleSheet.create({
  flatlist: {
    paddingTop: 15,
  },
  countResult: {
    textAlign: 'center',
    color: Colors.black3,
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  btnDetailText: {
    color: Colors.whiteColor,
    paddingHorizontal: 8,
    paddingVertical: 8,
    textAlign: 'center',
  },
  btnDetail: {
    justifyContent: 'center',
    alignSelf: 'flex-end',
    width: 100,
    marginTop: 50,
  },
  viewContent: {
    fontSize: ConfigStyle.title4,
    alignSelf: 'flex-start',
    color: Colors.black4,
  },
  viewContentSeen: {
    fontSize: ConfigStyle.title4,
    alignSelf: 'flex-start',
    color: '#9F9F9F',
  },
  textButton: {
    color: 'white',
    textAlign: 'center',
  },
  viewDatetime: {
    fontSize: ConfigStyle.title4,
    alignSelf: 'flex-start',
    marginTop: 5,
    color: '#25A053',
    fontWeight: 'bold',
  },
  viewDatetimeSeen: {
    fontSize: ConfigStyle.title4,
    alignSelf: 'flex-start',
    marginTop: 5,
    color: '#9F9F9F',
    fontWeight: 'bold',
  },
  rightButton: {
    backgroundColor: '#EE2323',
    width: 90,
    marginHorizontal: 10,
    justifyContent: 'center',
    borderRadius: 10,
    flex: 0.9,
    height: '80%',
  },
  viewContainer: {
    // marginTop: 10,
    flex: 1,
    // color: Colors.whiteColor,
  },
  viewAccording: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    paddingVertical: 19,
  },
  card: {
    borderRadius: 10,
    flexDirection: 'column',
    paddingVertical: 15,
    // backgroundColor: Colors.whiteColor,
    shadowOffset: {width: 3, height: 3},
    textShadowColor: Colors.black4,
    shadowOpacity: 0.5,
    textShadowRadius: 0.5,
    marginHorizontal: 16,
    marginTop: 1,
    paddingHorizontal: 17,
    marginBottom: 15,
  },
  cardModal: {
    borderRadius: 10,
    flexDirection: 'column',
    paddingVertical: 15,
    elevation: 10,
    backgroundColor: Colors.whiteColor,
    shadowOffset: {width: 3, height: 3},
    textShadowColor: Colors.black4,
    shadowOpacity: 0.5,
    textShadowRadius: 0.5,
    marginTop: 1,
    paddingHorizontal: 17,
    marginBottom: 15,
  },
  viewTitle: {
    fontWeight: 'bold',
    fontSize: ConfigStyle.customTitle2,
    alignSelf: 'flex-start',
    marginBottom: 5,
    color: Colors.black4,
  },
  viewTitleSeen: {
    fontWeight: 'bold',
    fontSize: ConfigStyle.customTitle2,
    alignSelf: 'flex-start',
    marginBottom: 5,
    color: '#9F9F9F',
  },
  textDetail: {
    color: Colors.blue2,
    fontSize: ConfigStyle.RF.text7,
    textDecorationLine: 'underline',
    fontStyle: 'italic',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
});
export default NotificationScreen;
