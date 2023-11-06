import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useSelector, useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import Container from '../../components/common/Container2';
import Statusbar from '../../components/common/StatusBar';
import Avatar from '../../components/common/Avatar';
import Styles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';
import BoxMessage from '../../components/Chat/BoxMessage';
import ConfigStyle from '../../theme/ConfigStyle';
import CustomInputToolBar from '../../components/Chat/CustomInputToolBar';
import Loading from '../../components/common/Loading';
import config from '../../../config/config';
import {
  blockUser,
  createChatSingle,
  createMessage,
  deleteGroupChat,
  getListMessageByGroup,
  unBlockUser,
} from '../../api/chat';
import {uploadImage, handleUploadFile} from '../../api/uploadImage';
import {SOCKET_ID, DEVICE_TOKEN} from '../../utils/auth.util';
import Constants from '../../../constants/Values';
import {updateCurrentChatGroup} from '../../lib/slices/socketSlice';
import IconEllipsis from '../../assets/images/svg/ellipsis-h.svg';
import CustomActionSheet from '../../components/common/CustomActionSheet';
import ModalReport from '../../components/Chat/ModalReport';

const INITIAL_MESSAGES = {
  data: [],
  totalPages: 1,
  totalItems: 0,
  item: 0,
};
const LIMIT = 3 * Constants.LIMIT;
const InboxChat = (props) => {
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [showScroll, setShouldScroll] = useState(new Date().getTime());
  const [isBusy, setBusy] = useState(true);
  const [sending, setSending] = useState(false);
  const [groupChat, setGroupChat] = useState({});
  const [userReceive, setUserReceive] = useState({});
  const [flagMsg, setFlagMsg] = useState('');
  const [notMessageMore, serNotMessageMore] = useState(false);
  const [showAction1, setShowAction1] = useState(false);
  const [showAction2, setShowAction2] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const newNotification = useSelector((state) => state.socket.newNotification);
  useEffect(() => {
    // if (props.route?.params?.to) {
    //   createChat(props.route.params.to);
    // } else {
    //   props.navigation.goBack();
    // }
    // if (props.route?.params?.groupChat) {
    //   dispatch(updateCurrentChatGroup(props.route?.params?.groupChat));
    // }
    // if (props.route.params?.userReceive) {
    //   setUserReceive(props.route.params.userReceive);
    // }
  }, []);
  // useFocusEffect(
    // React.useCallback(() => {
    //   return async () => await dispatch(updateCurrentChatGroup(''));
    // }, []),
  // );

  function checkIsReceive(message) {
    // if (message?.from?._id !== user?._id) {
    //   return true;
    // }
    // return false;
  }
  useEffect(() => {
    // if (
    //   (!messages?.data?.[messages.length - 1]?._id ||
    //     messages.data?.[messages.length - 1]?._id !== newNotification?._id) &&
    //   groupChat?._id === newNotification?.group &&
    //   newNotification?._id
    // ) {
    //   setMessages({
    //     data: [
    //       {
    //         _id: newNotification?._id,
    //         content: newNotification?.content,
    //         createdAt: newNotification?.createdAt,
    //         from: newNotification?.from,
    //         images: newNotification?.images,
    //         files: newNotification?.files,
    //         receive: checkIsReceive(newNotification),
    //         newMessage: true,
    //       },
    //       ...messages.data,
    //     ],
    //     totalItems: messages.totalItems + 1,
    //     totalPages: messages.totalPages,
    //     item: messages.item + 1,
    //   });
    //   setShouldScroll(new Date().getTime());
    // }
  }, [newNotification]);

  async function createChat(id, loadMessage = true) {
    try {
      if (loadMessage) {
        setBusy(true);
      }
      const response = await createChatSingle(id);
      setGroupChat(response);
      if (loadMessage) {
        await getListMessage(response._id);
        await dispatch(updateCurrentChatGroup(response._id));
        setBusy(false);

        if (response?.members?.length) {
          response?.members?.map((item, index) => {
            if (user?._id !== item._id) {
              setUserReceive(item);
            }
          });
        }
      }
    } catch (error) {
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Lỗi tạo nhóm chat vui lòng thử lại sau',
      });
      props.navigation.goBack();
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

  async function getListMessage(
    id,
    page = 1,
    limit = 25,
    keyword = '',
    loadMore = false,
  ) {
    try {
      if (!loadMore) {
        setBusy(true);
      }
      if (id) {
        const response = await getListMessageByGroup(
          id,
          page,
          limit,
          keyword,
          flagMsg,
        );
        setBusy(false);
        if (response?.payload?.length) {
          const arrayMessage = response?.payload.reverse();
          setFlagMsg(arrayMessage?.[0]?._id);
          const arrMsg = arrayMessage?.map((item) => {
            item.receive = checkIsReceive(item);
            return item;
          });
          if (loadMore) {
            setMessages({
              data: [...messages.data, ...arrMsg],
              totalPages: response.total_page,
              totalItems: response.total_item,
              currentPage: response.page,
              item: response.item,
            });
          } else {
            setMessages({
              data: arrMsg,
              totalPages: response.total_page,
              totalItems: response.total_item,
              currentPage: response.page,
              item: response.item,
            });
            setShouldScroll(new Date().getTime());
          }
        } else {
          serNotMessageMore(true);
        }
      }

      setBusy(false);
    } catch (error) {
      console.log('getListMessage ==> ', error);
    }
  }

  async function handleLoadMore() {
    if (!notMessageMore) {
      await getListMessage(
        groupChat._id,
        messages.currentPage + 1,
        LIMIT,
        '',
        true,
      );
    }
  }

  async function uploadArrayImage(arr) {
    try {
      if (!Array.isArray(arr)) {
        arr = [arr];
      }
      const promise = arr.map((item) => {
        return handleUploadImage(item);
      });
      const data = await Promise.all(promise);
      return data;
    } catch (error) {
      console.log('uploadArrayImage ==>', error);
    }
  }

  async function uploadArrayFiles(arr) {
    try {
      if (!Array.isArray(arr)) {
        arr = [arr];
      }
      const promise = arr.map((item) => {
        return handleUploadFile(item);
      });
      const data = await Promise.all(promise);
      return data;
    } catch (error) {
      console.log('uploadArrayImage ==>', error);
    }
  }

  async function handleUploadImage(image) {
    try {
      const formData = new FormData();
      formData.append('file', {
        name: `${new Date()}.jpg`,
        type: image.mime,
        uri: image.path,
      });
      const upload = await uploadImage(formData);
      return upload?.data?.images[0] || {};
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSend(content = '', images = [], files = []) {
    try {
      const socketId = await SOCKET_ID.get();
      const deviceToken = await DEVICE_TOKEN.get();
      const data = {
        content: '',
        files: [],
        images: [],
        socketId: socketId,
        deviceToken,
      };
      setSending(true);
      if (images?.length) {
        data.images = await uploadArrayImage(images);
      }
      if (files?.length) {
        data.files = await uploadArrayFiles(files);
      }
      if (content) {
        data.content = content;
      }
      const response = await createMessage(data, groupChat?._id);
      setSending(false);
      if (response?._id) {
        setMessages({
          data: [
            {
              _id: response?._id,
              content: response?.content,
              createdAt: response?.createdAt,
              from: response?.from,
              images: response?.images,
              files: response?.files,
              receive: false,
              newMessage: true,
            },
            ...messages.data,
          ],
          totalItems: messages.totalItems + 1,
          totalPages: messages.totalPages,
          item: messages.item + 1,
        });
      }
    } catch (error) {
      setSending(false);
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

  async function sendMessage(message) {
    if (message.images) {
      if (!Array.isArray(message.images)) {
        message.images = [message.images];
      }
    }
    if (message?.files) {
      //
    }
    if (message.text || message.images || message.files) {
      await handleSend(message.text, message.images, message.files);
    }
  }

  function goToDetailTeacher() {
    if (user.access === 'student') {
      props.navigation.navigate('DetailTutor', {
        _id: userReceive?.teacherId || userReceive?._id,
      });
    }
  }

  async function deleteInbox() {
    try {
      await deleteGroupChat(groupChat?._id);
      props.navigation.goBack();
    } catch (error) {
      if (error?.response?.data?.errors) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'error',
          text1: error?.response?.data?.errors[0].message,
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

  function handlePressRightHeader() {
    Keyboard.dismiss();
    if (groupChat?.blockInfo?.user === user?._id) {
      setShowAction1(true);
      setTimeout(() => {
        setShowAction1(false);
      }, 200);
    } else {
      setShowAction2(true);
      setTimeout(() => {
        setShowAction2(false);
      }, 200);
    }
  }

  async function handleBlockUser() {
    try {
      await blockUser({id: userReceive?._id});
      await createChat(userReceive?._id, false);
    } catch (error) {
      await createChat(userReceive?._id, false);
    }
  }

  async function handleUnBlockUser() {
    try {
      await unBlockUser({id: userReceive?._id});
      await createChat(userReceive?._id, false);
    } catch (error) {
      await createChat(userReceive?._id, false);
    }
  }

  function handleDeleteMessage(id) {
    const listMessage = [...messages.data];
    const index = listMessage.findIndex((item) => item._id === id);
    listMessage.splice(index, 1);
    if (listMessage?.length) {
      setFlagMsg(listMessage?.[listMessage.length - 1]?._id);
    }
    setMessages({
      ...messages,
      data: listMessage,
    });
  }

  function handleActionSheetOnPress(index) {
    switch (index) {
      case 0:
        setShowReport(true);
        break;
      case 1: {
        if (groupChat?.blockInfo?.user === user?._id) {
          handleUnBlockUser();
        } else {
          handleBlockUser();
        }

        break;
      }
      case 2:
        deleteInbox();
        break;
      default:
        break;
    }
  }

  const contentHeader = (
    <View style={styles.wrapContentHeader}>
      {userReceive.avatar && userReceive?.fullName ? (
        <TouchableWithoutFeedback onPress={goToDetailTeacher}>
          <View style={Styles.flexRowCenterVertical}>
            <Avatar
              source={{
                uri: userReceive.avatar
              }}
              size={35}
            />
            <View style={styles.infoContentHeader}>
              <Text
                style={[Styles.title2RS, Styles.textWhite]}
                numberOfLines={1}
              >
                {userReceive?.fullName}
              </Text>
              <Text
                style={{
                  ...Styles.title5RS,
                  ...styles.textStatus,
                  color: userReceive?.online
                    ? Colors.green
                    : Colors.inputBorder,
                }}
              >
                {userReceive?.online ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      ) : null}
    </View>
  );
  const iconRight = (
    <TouchableOpacity style={styles.iconRight}
onPress={handlePressRightHeader}>
      <IconEllipsis width={20}
height={5}
fill={'#fff'} />
    </TouchableOpacity>
  );
  return (
    <Container
      header={
        <Statusbar
          arrowBack={true}
          navigation={props.navigation}
          content={contentHeader}
          headerHeight={ConfigStyle.statusBarIb}
          iconRight={iconRight}
        />
      }
      headerHeight={ConfigStyle.statusBarIb}
      hideBackground={true}
      containerStyle={{
        justifyContent: 'flex-end',
        position: 'relative',
      }}
      keyboardAvoidingView={true}
      keyboardShouldPersistTaps={true}
      footer={
        <CustomInputToolBar sendMessage={sendMessage}
groupChat={groupChat} />
      }
      showScroll={showScroll}
    >
      {isBusy ? <Loading /> : null}

      <BoxMessage
        messages={messages.data}
        showScroll={showScroll}
        sending={sending}
        isBusy={isBusy}
        userReceive={userReceive}
        handleLoadMore={handleLoadMore}
        totalItems={messages?.data?.length}
        page={messages.currentPage}
        limit={LIMIT}
        item={messages.item}
        notMessageMore={notMessageMore}
        handleDeleteMessage={handleDeleteMessage}
      />
      <CustomActionSheet
        arrayActions={[
          'Báo cáo',
          'Bỏ chặn người này',
          'Xóa cuộc trò chuyện',
          'Đóng',
        ]}
        actionSheetOnPress={handleActionSheetOnPress}
        shouldShow={showAction1}
        cancelButtonIndex={3}
        destructiveButtonIndex={1}
      />

      <CustomActionSheet
        arrayActions={[
          'Báo cáo',
          'Chặn người này',
          'Xóa cuộc trò chuyện',
          'Đóng',
        ]}
        actionSheetOnPress={handleActionSheetOnPress}
        shouldShow={showAction2}
        cancelButtonIndex={3}
        destructiveButtonIndex={1}
      />

      {showReport ? (
        <ModalReport
          isModalVisible={showReport}
          hideModal={() => setShowReport(false)}
          userReceive={userReceive}
        />
      ) : null}
    </Container>
  );
};

export default InboxChat;
const styles = StyleSheet.create({
  wrapContentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContentHeader: {
    marginLeft: 12,
    maxWidth: '80%',
  },
  iconRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingVertical: 8,
  },
});
