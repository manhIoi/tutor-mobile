import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-toast-message';
import Container from '../../components/common/ContainerRenderList';
import Statusbar from '../../components/common/StatusBar';
import ConfigStyle from '../../theme/ConfigStyle';
import Colors from '../../theme/Colors';
import ItemStudentRegistry from '../../components/ManageTutorRegister/ItemStudentRegistry';
import {
  getTeacherByRequestId,
  teacherManageRegistry,
  userAcceptRequest,
  userRejectRequest,
} from '../../api/class';
import Constants from '../../../constants/Values';
import ItemClassRegistered from '../../components/ManageRegistry/ItemClassRegistered';
import ClassRoomHorizontal from '../../components/Home/ClassRoomHorizontal';
import Styles from '../../theme/MainStyles';
import IconEmpty from '../../assets/images/svg/empty-list.svg';
import {getReviewByClass} from '../../api/users';
import ReviewList from '../../components/Tutor/ReviewList';
import BoxShadow from '../../components/common/BoxShadow';
import Avatar from '../../components/common/Avatar';
import config from '../../../config/config';
import RateStar from '../../components/common/RateStar';
import IconChatActive from '../../assets/images/tab/chat1.svg';
import ButtonCustom from '../../components/common/ButtonFooterCustom';
import CustomActionSheet from '../../components/common/CustomActionSheet';

const INIT_VALUE = {
  data: [],
  currentPage: 1,
  totalItems: 0,
  limit: 10,
};
export default function ListTeacher(props) {
  const [isBusy, setBusy] = useState(true);
  const [refreshing, setRefresh] = useState(false);
  const [listTeacher, setListTeacher] = useState([]);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [isBusyButon, setBusyButton] = useState(false);

  useEffect(() => {
    if (props.route?.params?._id) {
      if (props.route?.params?.isInvite)
        getListTeacher(props.route.params._id, 1, Constants.LIMIT, true);
      else getListTeacher(props.route.params._id, 1, Constants.LIMIT, false);
    }
  }, []);
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
  async function getListTeacher(
    id,
    page = 1,
    limit = Constants.LIMIT,
    status,
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) {
        setBusy(true);
      }
      const response = await getTeacherByRequestId(id, page, limit, status);
      if (loadMore) {
        if (response?.payload) {
          setListTeacher({
            data: [...listTeacher.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setListTeacher({
            data: response?.payload || [],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
        setBusy(false);
      }
      setRefresh(false);
    } catch (error) {
      setBusy(false);
      console.log('getManageRegistry ==> ', error);
    }
  }
  async function onRefresh(showLoading = true) {
    if (showLoading) {
      setRefresh(true);
    }
    if (props.route?.params?.isInvite)
      await getListTeacher(
        props.route?.params?._id,
        1,
        Constants.LIMIT,
        true,
        false,
        true,
      );
    else
      await getListTeacher(
        props.route?.params?._id,
        1,
        Constants.LIMIT,
        false,
        false,
        true,
      );
  }
  function onPressDismiss() {
    setShowActionSheet(true);
    setTimeout(() => {
      setShowActionSheet(false);
    }, 200);
  }
  const renderFooter =
    listTeacher.data?.length >= listTeacher.totalItems ? (
      <Text style={Styles.countResult}>{listTeacher.totalItems} kết quả</Text>
    ) : (
      <ActivityIndicator color={Colors.orange} />
    );

  function handleLoadMore() {
    if (listTeacher.currentPage * Constants.LIMIT < listTeacher.totalItems) {
      if (props.route?.params?.isInvite) {
        getListTeacher(
          props.route?.params?._id,
          listTeacher.currentPage + 1,
          Constants.LIMIT,
          true,
          true,
          false,
        );
      } else {
        getListTeacher(
          props.route?.params?._id,
          listTeacher.currentPage + 1,
          Constants.LIMIT,
          false,
          true,
          false,
        );
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
                : item?.item?.status === 'reject'
                ? 'Đã từ chối'
                : item?.item?.status === 'approve'
                ? 'Đã duyệt'
                : ''}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.itemChat}
              // onPress={() => {
              //   console.log({
              //     to: props.data?.user?.id,
              //     userReceive: {
              //       avatar: props.data?.user?.avatar,
              //       online: props.data?.user?.isOnline,
              //       fullName: props.data?.user?.fullName,
              //     },
              //   });
              //   props.navigation.push('InboxChat', {
              //     to: props.data?.user?.id,
              //     userReceive: {
              //       avatar: props.data?.user?.avatar,
              //       online: props.data?.user?.isOnline,
              //       fullName: props.data?.user?.fullName,
              //     },
              //   });
              // }}
            >
              <IconChatActive width={16}
height={16} />
            </TouchableOpacity>
          </View>
        </View>
        {!props?.route?.params?.isInvite ? (
          <View style={styles.groupBtn}>
            <ButtonCustom
              style={styles.btnAction}
              // isBusy={leftBusSy}
              disabled={isBusyButon}
              text={'KHÔNG DUYỆT'}
              // onPress={onPressDismiss}
              onPress={async () => rejectRequest(item?.item?._id)}
              outline={true}
              textBtn={{fontSize: 12, paddingHorizontal: 10}}
            />
            <ButtonCustom
              style={styles.btnAction}
              // isBusy={rightBusy}
              disabled={isBusyButon}
              //   disabled ||
              //   props.data?.status === 'approve' ||
              //   checked ||
              //   props.data?.status === 'reject'
              // }
              text={'DUYỆT'}
              // onPress={handleApprove}
              onPress={async () => acceptRequest(item?.item?._id)}
              textBtn={{fontSize: 12, paddingHorizontal: 10}}
            />
          </View>
        ) : null}
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
  function handleClickCancel() {
    setShowActionSheet(true);
    // setTimeout(() => {
    //   setShowActionSheet(false);
    // }, 200);
  }
  async function handleActionSheetOnPress(index) {
    switch (index) {
      case 0:
        // await handleDismiss();
        break;
      case 1: {
        break;
      }
      default:
        break;
    }
  }
  return (
    <Container
      header={
        <Statusbar
          headerHeight={ConfigStyle.statusBarHeight}
          navigation={props.navigation}
          title={props?.route?.params?.title}
          arrowBack={true}
        />
      }
      hideBackground={true}
      headerHeight={ConfigStyle.statusBarHeight}
      contentTop={
        <View style={{marginHorizontal: 15}}>
          <Text style={styles.textList}>
            {props?.route?.params?.requestTitle}
          </Text>
        </View>
      }
    >
      <View style={{paddingHorizontal: 16}}>
        {!isBusy ? (
          listTeacher?.data?.length ? (
            <FlatList
              style={styles.listItem}
              data={listTeacher?.data}
              renderItem={({item, index}) => (
                // <ReviewItem
                //   onRefresh={onRefresh}
                //   data={item}
                //   navigation={props.navigation}
                // />
                <ItemTeacher
                  onRefresh={onRefresh}
                  item={item}
                  navigation={props.navigation}
                />
              )}
              keyExtractor={(item) => item._id}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.orange]}
                />
              }
              ListFooterComponent={renderFooter}
              onEndReachedThreshold={0.4}
              onEndReached={handleLoadMore}
            />
          ) : (
            <View style={Styles.wrapEmptyImage}>
              <IconEmpty width={'50%'}
height={'50%'} />
              <Text style={Styles.textBlack3}>Không có dữ liệu</Text>
            </View>
          )
        ) : (
          <View style={{marginTop: 20}}>
            <ActivityIndicator color={Colors.orange} />
          </View>
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  textList: {
    fontSize: 16,
    color: Colors.black4,
    marginVertical: 10,
  },
  wrapItemReview: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  wrapContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 15,
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
