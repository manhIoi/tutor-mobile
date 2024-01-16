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
const InboxChatGroup = (props) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { roomChat = null, listUserReceive  } = props.route?.params || {};
  const roomChatRef = useRef(roomChat);

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [showScroll, setShouldScroll] = useState(new Date().getTime());
  const [isBusy, setBusy] = useState(true);
  const [sending, setSending] = useState(false);
  const [notMessageMore, serNotMessageMore] = useState(false);

  const messagesDataSorted = useMemo(() => {
    return messages.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [messages.data])

  useEffect(() => {
  }, []);

  const executeTaskChat = () => {
    Promise.all([getListMessage(), joinRoomEvent()]).catch(e => {
      console.info(`🔥LOGGER::  executeTaskChat error`, e);
    }).finally(() => {
      dispatch(hideLoadingModal())
    })
  }

  async function getListMessage() {
    try {
      // TODO: implement
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

  async function handleSend(content = '', images = [], files = []) {
    console.info(`🔥🔥🔥LOGGER:: id `, userReceive?._id, user?._id);
    try {
      // TODO: implement
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

  return (
    <Container
      header={
        <Statusbar
          arrowBack={true}
          navigation={props.navigation}
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
        <CustomInputToolBar onlyMessage={true} sendMessage={sendMessage} />
      }
      showScroll={showScroll}
    >
      <BoxMessage
        messages={messagesDataSorted}
        showScroll={showScroll}
        sending={sending}
        isBusy={isBusy}
        handleLoadMore={() => {}}
        totalItems={messages?.data?.length}
        page={messages.currentPage}
        limit={LIMIT}
        item={messages.item}
        notMessageMore={notMessageMore}
        handleDeleteMessage={() => {}}
      />
    </Container>
  );
};

export default InboxChatGroup;
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
