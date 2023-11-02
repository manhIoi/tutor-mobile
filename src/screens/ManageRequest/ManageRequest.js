import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {Text} from 'react-native-elements';
import Container from '../../components/common/ContainerRenderList';
import Statusbar from '../../components/common/StatusBar';
import ConfigStyle from '../../theme/ConfigStyle';
import ModalFilter from '../../components/Calendar/ModalFilter';

import {getTeacherManagementRequest, teacherInvite} from '../../api/class';
import Styles from '../../theme/MainStyles';
import Constants from '../../../constants/Values';
import ClassRoomHorizontal from '../../components/Home/ClassRoomHorizontal';
import IconEmpty from '../../assets/images/svg/empty-list.svg';
import Colors from '../../theme/Colors';
import ItemClassRegistered from '../../components/ManageRegistry/ItemClassRegistered';
import InputSearch from '../../components/common/InputSearch';
import IconFill from '../../assets/images/svg/icon-fill.svg';
import InvitationItem from '../../components/ManageRequest/InvitationItem';
import RecommendItem from '../../components/ManageRequest/RecommendationItem';

const INIT_VALUE = {
  data: [],
  currentPage: 1,
  totalItems: 0,
  limit: 10,
};
const dataFilter = [
  {
    id: 0,
    status: 'Đã hủy',
    checked: false,
    value: 'cancel',
  },
  {
    id: 1,
    status: 'Không thành công',
    checked: false,
    value: 'reject',
  },
  {
    id: 2,
    status: 'Thành công',
    checked: false,
    value: 'approve',
  },
  {
    id: 3,
    status: 'Đang mở',
    checked: true,
    value: 'pending',
  },
];

const ManageRequest = (props) => {
  const [tab, setTab] = useState(0);
  const [classesInvite, setClassesInvite] = useState(INIT_VALUE);
  const [classesRecommend, setClassesRecommend] = useState(INIT_VALUE);
  const [isBusy, setBusy] = useState(true);
  const [isBusy2, setBusy2] = useState(true);
  const [refreshing, setRefresh] = useState(false);
  const [showFilter, setFilter] = useState(false);
  const [autoFocus, setAutoFocus] = useState(false);
  const [status, setStatus] = useState('pending');
  const [text, setText] = useState('');
  const [data, setData] = useState(dataFilter);
  async function hideModalFilter() {
    setFilter(false);
  }
  function handleFilter() {
    setAutoFocus(false);
    onFocusSearch(false);
    hideModalFilter();
  }
  function onFocusSearch(showKeyboard = true) {
    if (showKeyboard) {
      setAutoFocus(true);
    }
    setFilter(true);
  }
  useEffect(() => {
    if (props.route?.params?.tab) {
      setTab(props.route?.params?.tab);
      if (props.route.params.tab === 0) {
        getClassesInvite();
      } else {
        getClassesRecommend();
      }
    }
  }, []);
  useEffect(() => {
    if (tab === 0 && !classesInvite.data?.length) {
      getClassesInvite();
    }
    if (tab === 1 && !classesRecommend.data?.length) {
      getClassesRecommend();
    }
  }, [tab]);
  function onSearch(event) {
    const {text} = event.nativeEvent;
    setText(text);
    handleChangeStatus(status, text);
  }
  async function getClassesInvite(
    page = 1,
    limit = Constants.LIMIT,
    text = text,
    status = 'pending',
    invite = true,
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) {
        setBusy(true);
      }
      const response = await getTeacherManagementRequest(
        page,
        limit,
        text,
        status,
        invite,
      );
      if (loadMore) {
        if (response?.payload) {
          setClassesInvite({
            data: [...classesInvite.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setClassesInvite({
            data: response?.payload || [],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
        setBusy(false);
      }
      setRefresh(false);
    } catch (error) {
      console.log(error);
    }
  }
  async function getClassesRecommend(
    page = 1,
    limit = Constants.LIMIT,
    text = text,
    status,
    invite = false,
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) {
        setBusy2(true);
      }
      const response = await getTeacherManagementRequest(
        page,
        limit,
        text,
        status,
        invite,
      );
      if (loadMore) {
        if (response?.payload) {
          setClassesRecommend({
            data: [...classesRecommend.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setClassesRecommend({
            data: response?.payload || [],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
        setBusy2(false);
      }
      setRefresh(false);
    } catch (error) {
      console.log('get getClasses ==>', error);
    }
  }
  async function onRefresh() {
    setRefresh(true);
    if (tab === 0) {
      await getClassesInvite(
        1,
        Constants.LIMIT,
        text,
        status,
        true,
        false,
        true,
      );
    } else {
      await getClassesRecommend(
        1,
        Constants.LIMIT,
        text,
        status,
        false,
        false,
        true,
      );
    }
  }
  function handleSetTab(tab) {
    setTab(tab);
    // handleChangeStatus()
  }
  async function handleChangeStatus(status, textString) {
    setText(textString);
    setStatus(status);
    setBusy(true);
    if (tab === 0) {
      await getClassesInvite(
        1,
        Constants.LIMIT,
        textString,
        status,
        true,
        false,
        true,
      );
      setBusy(false);
    } else {
      await getClassesRecommend(
        1,
        Constants.LIMIT,
        textString,
        status,
        false,
        false,
        true,
      );
      setBusy(false);
    }
  }
  const iconRight = (
    <TouchableOpacity style={styles.wrapIconRight}
onPress={onFocusSearch}>
      <View style={styles.iconFilter}>
        <IconFill width={12.6}
height={18} />
      </View>
    </TouchableOpacity>
  );
  const renderFooter =
    (tab === 0 && classesInvite.data?.length >= classesInvite.totalItems) ||
    (tab === 1 &&
      classesRecommend.data?.length >= classesRecommend.totalItems) ? (
      <Text style={Styles.countResult}>
        {tab === 0 ? classesInvite.totalItems : classesRecommend.totalItems} kết
        quả
      </Text>
    ) : (
      <ActivityIndicator color={Colors.orange} />
    );

  function handleLoadMore() {
    if (
      (tab === 0 &&
        classesInvite.currentPage * Constants.LIMIT <
          classesInvite.totalItems) ||
      (tab === 1 &&
        classesRecommend.currentPage * Constants.LIMIT <
          classesRecommend.totalItems)
    ) {
      if (tab === 0) {
        getClassesInvite(
          classesRecommend.currentPage + 1,
          Constants.LIMIT,
          '',
          status,
          true,
          true,
        );
      } else {
        getClassesRecommend(
          classesRecommend.currentPage + 1,
          Constants.LIMIT,
          '',
          status,
          false,
          true,
        );
      }
    }
  }
  return (
    <Container
      header={
        <Statusbar
          title={'Quản lý yêu cầu '}
          contentBarStyles={{justifyContent: 'center'}}
          tab={tab}
          tabLabels={['Mời dạy', 'Đề nghị']}
          changeTab={handleSetTab}
          arrowBack={true}
          navigation={props.navigation}
          contentBarStyles={{justifyContent: 'space-between'}}
          headerHeight={ConfigStyle.statusBarHeight}
        />
      }
      headerHeight={ConfigStyle.statusBarHeight}
      hideBackground={false}
      contentTop={
        <View style={styles.wrapTitle}>
          {!showFilter ? (
            <View style={styles.searchBar}>
              <View style={styles.controlGroup}>
                <InputSearch
                  iconRight={iconRight}
                  textSearch={text}
                  onSearch={onSearch}
                  // textSearch={props.textSearch}
                  // onFocusSearch={onFocusSearch}
                  // isTouch={true}
                />
              </View>
            </View>
          ) : (
            <View style={{marginBottom: 50}} />
          )}
        </View>
      }
    >
      {(tab === 0 && !isBusy) || (tab === 1 && !isBusy2) ? (
        (tab === 0 && classesInvite.data?.length) ||
        (tab === 1 && classesRecommend.data?.length) ? (
          <FlatList
            style={styles.listItem}
            data={tab === 0 ? classesInvite.data : classesRecommend.data}
            renderItem={({item, index}) =>
              tab === 0 ? (
                <InvitationItem
                  containerStyle={{marginHorizontal: 13}}
                  item={item}
                  disabled={true}
                  navigation={props.navigation}
                  inviteId={item?._id}
                  onRefresh={onRefresh}
                />
              ) : (
                <RecommendItem
                  containerStyle={{marginHorizontal: 13}}
                  item={item}
                  disabled={true}
                  recommend={item?._id}
                  navigation={props.navigation}
                  onRefresh={onRefresh}
                  recommenId={item?._id}
                  status={item?.status}
                />
              )
            }
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
      {showFilter ? (
        <ModalFilter
          show={showFilter}
          data={data}
          tab={tab}
          hideModalFilter={hideModalFilter}
          onSearch={props.onSearch}
          iconRight={iconRight}
          textSearch={text}
          handleFilter={handleFilter}
          action={handleChangeStatus}
          text={text}
          status={status}
        />
      ) : null}
    </Container>
  );
};

export default ManageRequest;
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
  },
  title: {
    fontSize: 16,
    marginBottom: 5,
  },
  wrapTitle: {
    marginTop: 35,
    marginLeft: 15,
  },
  listItem: {
    backgroundColor: Colors.whiteColor,
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  controlGroup: {
    width: '88%',
  },
  iconFilter: {
    width: 12,
    height: 18,
    marginRight: 15,
  },
});
