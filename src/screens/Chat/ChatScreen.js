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

const INIT_DATA = {
  page: 1,
  totalPage: 0,
  totalItems: 0,
  data: [],
};
const LIMIT = Constants.LIMIT * 2;
const ChatScreen = (props) => {
  const [listGroupChat, setListGroupChat] = useState(INIT_DATA);
  const [textSearch, setTextSearch] = useState('');
  const [isBusy, setBusy] = useState(true);
  const [refreshing, setRefresh] = useState(false);
  const newNotification = useSelector((state) => state.socket.newNotification);
  const user = useSelector((state) => state.auth.user);
  useFocusEffect(
    React.useCallback(() => {
      getListChat(1, LIMIT, textSearch, false, true);
    }, []),
  );
  useEffect(() => {
    if (newNotification?.group?._id) {
      getListChat(1, LIMIT, textSearch, false, true);
    }
  }, [newNotification]);
  useDebouncedEffect(
    () => {
      getListChat(1, LIMIT, textSearch, false, true);
    },
    500,
    [textSearch],
  );
  function selectInbox(id) {
    props.navigation.push('InboxChat', id);
  }
  async function deleteInbox(id) {
    try {
      await deleteGroupChat(id);
      await getListChat(1, LIMIT, textSearch, false, true);
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
  async function getListChat(
    page = 1,
    limit = LIMIT,
    keyword = textSearch,
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) {
        setBusy(true);
      }
      const response = await getListBoxChat(page, limit, keyword);

      if (loadMore) {
        setListGroupChat({
          page: response.page,
          totalPage: response.total_page,
          totalItems: response.total_item,
          data: [...listGroupChat.data, ...response.payload],
        });
      } else {
        setListGroupChat(INIT_DATA);
        setListGroupChat({
          page: response.page,
          totalPage: response.total_page,
          totalItems: response.total_item,
          data: response.payload || [],
        });
      }

      setBusy(false);
      setRefresh(false);
    } catch (error) {
      setBusy(false);
      console.log('getListChat ==>', error);
    }
  }
  async function onRefresh() {
    setRefresh(true);
    await getListChat(1, LIMIT, textSearch, false, true);
  }

  async function handleLoadMore() {
    if (listGroupChat.page < listGroupChat.totalPage) {
      getListChat(listGroupChat.page + 1, LIMIT, textSearch, true);
    }
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
  const renderFooter =
    listGroupChat.data?.length >= listGroupChat.totalItems ? (
      <Text style={Styles.countResult}>{listGroupChat.totalItems} kết quả</Text>
    ) : (
      <ActivityIndicator color={Colors.orange} />
    );

  return (
    <Container
      keyboardAvoidingView={true}
      keyboardShouldPersistTaps={true}
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
      hideBackground={true}
    >
      {!isBusy ? (
        listGroupChat?.data?.length ? (
          <FlatList
            style={{marginTop: 13}}
            data={listGroupChat.data}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.orange]}
              />
            }
            renderItem={({item}) => (
              <ChatItem
                selectInbox={selectInbox}
                deleteInbox={(id) => {
                  deleteInbox(id);
                }}
                data={item}
                navigation={props.navigation}
              />
            )}
            ListFooterComponent={renderFooter}
            onEndReachedThreshold={0.4}
            onEndReached={handleLoadMore}
          />
        ) : (
          <View style={Styles.wrapEmptyImage}>
            <IconEmpty width={'50%'}
height={'50%'} />
            <Text style={Styles.textBlack3}>Không có hộp thoại nào</Text>
          </View>
        )
      ) : (
        <View style={{marginTop: 20}}>
          <ActivityIndicator color={Colors.orange} />
        </View>
      )}
    </Container>
  );
};
export default ChatScreen;

const styles = StyleSheet.create({});
