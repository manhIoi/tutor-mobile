import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Container from '../../components/common/Container2';
import Statusbar from '../../components/common/StatusBar';
import Avatar from '../../components/common/Avatar';
import Styles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';
import BoxMessage from '../../components/Chat/BoxMessage';
import ConfigStyle from '../../theme/ConfigStyle';
import CustomInputToolBar from '../../components/Chat/CustomInputToolBar';
import {
  createChatSingle,
  getMessageByRoom, joinRoomApi,
} from '../../api/chat';
import { uploadImage, handleUploadFile } from '../../api/uploadImage';
import { SOCKET_ID, DEVICE_TOKEN } from '../../utils/auth.util';
import Constants from '../../../constants/Values';
import { updateCurrentChatGroup } from '../../lib/slices/socketSlice';
import IconEllipsis from '../../assets/images/svg/ellipsis-h.svg';
import CustomActionSheet from '../../components/common/CustomActionSheet';
import ModalReport from '../../components/Chat/ModalReport';
import SocketIO from "../../utils/SocketIO";
import { hideLoadingModal, showLoadingModal } from '../../lib/slices/modalSlice';

const INITIAL_MESSAGES = {
  data: [],
  totalPages: 1,
  totalItems: 0,
  item: 0,
};

const LIMIT = 3 * Constants.LIMIT;
const InboxChat = (props) => {
  const user = useSelector((state) => state.auth.user);
  const chatBot = useSelector(state => state.auth.chatBot)
  const { userReceive: _userParams, isChatAssistant = false, roomChat = null, callBackDismiss } = props.route?.params || {};
  const roomChatRef = useRef(roomChat);
  const userReceive = isChatAssistant ? {
    avatar: 'https://media.istockphoto.com/id/1010001882/vector/%C3%B0%C3%B0%C2%B5%C3%B1%C3%B0%C3%B1%C3%B1.jpg?s=612x612&w=0&k=20&c=1jeAr9KSx3sG7SKxUPR_j8WPSZq_NIKL0P-MA4F1xRw=',
    fullName: chatBot._id,
    _id: chatBot._id
  } : _userParams

  const dispatch = useDispatch();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [showScroll, setShouldScroll] = useState(new Date().getTime());
  const [isBusy, setBusy] = useState(true);
  const [sending, setSending] = useState(false);
  const [groupChat, setGroupChat] = useState({});
  const [flagMsg, setFlagMsg] = useState('');
  const [notMessageMore, serNotMessageMore] = useState(false);
  const [showAction1, setShowAction1] = useState(false);
  const [showAction2, setShowAction2] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const newNotification = useSelector((state) => state.socket.newNotification);

  const messagesDataSorted = useMemo(() => {
    return messages.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [messages.data])

  useEffect(() => {
    dispatch(showLoadingModal())
    executeTaskChat();
    return () => {
      callBackDismiss?.();
    }
  }, []);

  const executeTaskChat = () => {
    Promise.all([getListMessage(), joinRoomEvent()]).catch(e => {
      console.info(`🔥LOGGER::  executeTaskChat error`, e);
    }).finally(() => {
      dispatch(hideLoadingModal())
    })
  }

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

  async function getListMessage() {
    try {
      const messages = await getMessageByRoom({
        idReceive: userReceive._id,
        idSend: user._id,
        isChatBot: isChatAssistant
      })
      const _messagesFormatted = messages?.map?.(m => {
        const isReceive = user?._id === m.userReceive || (isChatAssistant && m?.isBotMessage)
        return {
          ...m,
          receive: isReceive,
          from: isReceive ? userReceive : user
        }
      })
      setMessages({
        ...messages,
        data: _messagesFormatted,
      })
    } catch (e) {
      console.info(`🔥🔥🔥LOGGER::  e`, e);
    }
  }

  const joinRoomEvent = async () => {
    if (!roomChat) {
      const response = await joinRoomApi([user?._id, userReceive?._id]);

      roomChatRef.current = response;

      console.info(`LOGGER:: response`, response);
    }
    SocketIO.on(`messageResponse_${user._id}`, data => {
      console.info(`🔥🔥🔥LOGGER messageResponse_`);
      if (data?.status === true) {
        setMessages(messages => {
          const newData = [...messages.data, {
            ...data,
            createdAt: new Date().getTime(),
            from: user,
          }]
          return {
            ...messages,
            data: newData
          }
        })
      }
    })
    SocketIO.on(`messageSendTo_${user._id}`, data => {
      const newData = [...messages.data, {
        ...data,
        from: userReceive,
      }]
      setMessages(messages => {
        const newData = [...messages.data, {
          receive: true,
          createdAt: new Date().getTime(),
          content: data?.content,
          from: userReceive,
        }]
        return {
          ...messages,
          data: newData
        }
      })
    })
  }

  async function handleLoadMore() {
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
    console.info(`🔥🔥🔥LOGGER:: id `, userReceive?._id, user?._id);
    try {
      if (!roomChatRef.current?._id) {
        console.log(`🔥LOG_IT:: roomChatRef`, roomChatRef.current)
      } else {
        SocketIO.emit("message", { content, idReceive: userReceive?._id, idSend: user?._id, isChatBot: isChatAssistant, isBotMessage: false, roomId: roomChatRef.current?._id })
      }
    } catch (error) {
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
  }

  async function handleUnBlockUser() { }

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
        <CustomInputToolBar onlyMessage={isChatAssistant} sendMessage={sendMessage}
          groupChat={groupChat} />
      }
      showScroll={showScroll}
    >
      <BoxMessage
        messages={messagesDataSorted}
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
