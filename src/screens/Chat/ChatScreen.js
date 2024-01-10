import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import { Text } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Container from '../../components/common/ContainerRenderList';
import Statusbar from '../../components/common/StatusBar';
import ConfigStyle from '../../theme/ConfigStyle';
import IconCustom from '../../components/common/IconCustom';
import ChatItem from '../../components/Chat/ChatItem';
import Colors from '../../theme/Colors';
import IconContact from '../../assets/images/svg/contact (1).svg';
import { getListBoxChat, deleteGroupChat } from '../../api/chat';
import Styles from '../../theme/MainStyles';
import IconEmpty from '../../assets/images/svg/empty-list.svg';
import AddChat from "../../components/common/AddChat";
import { hideLoadingModal, showLoadingModal } from '../../lib/slices/modalSlice';
import { getListRoom } from '../../helper/main';

const ChatScreen = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const listGroupChat = useSelector((state) => state.chat.rooms)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(showLoadingModal())
    getListChat()
  }, [])

  function selectInbox(id) {
    props.navigation.push('InboxChat');
  }
  function getListChat() {
    getListRoom(dispatch, user).finally(() => {
      dispatch(hideLoadingModal())
      setRefreshing(false)
    });
  }
  async function onRefresh() {
    setRefreshing(true)
    getListChat();
  }

  async function handleLoadMore() {
  }

  return (
    <Container
      keyboardAvoidingView={true}
      keyboardShouldPersistTaps={true}
      onRefresh={getListChat}
      header={
        <Statusbar
          title={"Trò chuyện"}
          headerHeight={ConfigStyle.statusBarHeight}
        />
      }
      headerHeight={ConfigStyle.statusBarHeight}
      footer={<AddChat style={{ bottom: 100, borderWidth: 2, width: 50, height: 50, borderRadius: 25, borderColor: Colors.borderThin, overflow: "hidden" }} onPress={() => {
        props.navigation.push('InboxChat', {
          isChatAssistant: true,
        })
      }} />}
      hideBackground={true}
    >
      <FlatList
        style={{ marginTop: 13 }}
        data={listGroupChat}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.orange]}
          />
        }
        renderItem={({ item }) => {
          return <ChatItem
            selectInbox={selectInbox}
            deleteInbox={(id) => {
              deleteInbox(id);
            }}
            data={item}
            navigation={props.navigation}
          />;
        }}
        onEndReachedThreshold={0.4}
        onEndReached={handleLoadMore}
        ListEmptyComponent={<View style={Styles.wrapEmptyImage}>
          <IconEmpty width={'50%'}
            height={'50%'} />
          <Text style={Styles.textBlack3}>Không có hộp thoại nào</Text>
        </View>}
      />
    </Container>
  );
};
export default ChatScreen;

const styles = StyleSheet.create({});
