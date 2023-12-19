import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import {Text} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Container from '../../components/common/ContainerRenderList';
import Statusbar from '../../components/common/StatusBar';
import ConfigStyle from '../../theme/ConfigStyle';
import IconCustom from '../../components/common/IconCustom';
import ChatItem from '../../components/Chat/ChatItem';
import Colors from '../../theme/Colors';
import IconContact from '../../assets/images/svg/contact (1).svg';
import {getListBoxChat, deleteGroupChat} from '../../api/chat';
import Styles from '../../theme/MainStyles';
import IconEmpty from '../../assets/images/svg/empty-list.svg';
import Constants from '../../../constants/Values';
import useDebouncedEffect from '../../hooks/useDebounce';
import AddButton from "../../components/common/AddButton";
import AddChat from "../../components/common/AddChat";
const LIMIT = Constants.LIMIT * 2;
const ChatScreen = (props) => {
  const [listGroupChat, setListGroupChat] = useState([]);
  const [textSearch, setTextSearch] = useState('');
  const [isBusy, setBusy] = useState(true);
  const [refreshing, setRefresh] = useState(false);
  const newNotification = useSelector((state) => state.socket.newNotification);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    getListChat()
  }, [])

  function selectInbox(id) {
    props.navigation.push('InboxChat');
  }
  async function getListChat() {
    try {
      const response = await getListBoxChat(user?._id);
      setListGroupChat(response);
    } catch (error) {
      console.info(`LOGGER:: error`,error);
    }
  }
  async function onRefresh() {
    getListChat();
  }

  async function handleLoadMore() {
  }

  function onSearch(event) {
    const {text} = event.nativeEvent;
    setTextSearch(text);
  }

  const iconRight = (
    <IconCustom
      width={27}
      height={30}
      svg={<IconContact width={27}
height={30} />}
      styleNumber={{top: -4, right: 2}}
      onPress={() => props.navigation.push('Contacts')}
    />
  );

  return (
      <Container
          keyboardAvoidingView={true}
          keyboardShouldPersistTaps={true}
          onRefresh={getListChat}
          header={
            <Statusbar
                search={true}
                iconRight={iconRight}
                textSearch={textSearch}
                actionSearch={onSearch}
                headerHeight={ConfigStyle.statusBarHeight}
            />
          }
          headerHeight={ConfigStyle.statusBarHeight}
          footer={<AddChat style={{ bottom: 100, borderWidth:2, width: 50, height: 50, borderRadius: 25, borderColor: Colors.borderThin, overflow: "hidden" }} onPress={() => {
            props.navigation.push('InboxChat', {
              isChatAssistant: true,

            })
          }} />}
          hideBackground={true}
      >
        <FlatList
            style={{marginTop: 13 }}
            data={listGroupChat}
            refreshControl={
              <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.orange]}
              />
            }
            renderItem={({item}) => {
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
