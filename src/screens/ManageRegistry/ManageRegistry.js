import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {Text} from 'react-native-elements';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import Container from '../../components/common/ContainerRenderList';
import Statusbar from '../../components/common/StatusBar';
import ConfigStyle from '../../theme/ConfigStyle';
import {
  getListClass,
  studentGetRegisteredClass,
  getFavoriteClass,
} from '../../api/class';
import Styles from '../../theme/MainStyles';
import Constants from '../../../constants/Values';
import ClassRoomHorizontal from '../../components/Home/ClassRoomHorizontal';
import IconEmpty from '../../assets/images/svg/empty-list.svg';
import Colors from '../../theme/Colors';
import ItemClassRegistered from '../../components/ManageRegistry/ItemClassRegistered';

const INIT_VALUE = {
  data: [],
  currentPage: 1,
  totalItems: 0,
  limit: 10,
};
const ManageRegistry = (props) => {
  const [tab, setTab] = useState(0);
  const [classesRegistry, setClassesRegistry] = useState(INIT_VALUE);
  const [classesLike, setClassesLike] = useState(INIT_VALUE);
  const [isBusy, setBusy] = useState(true);
  const [isBusy2, setBusy2] = useState(true);
  const [refreshing, setRefresh] = useState(false);
  const IsFocused = useIsFocused();
  useEffect(() => {
    if (props.route?.params?.tab) {
      setTab(props.route?.params?.tab);
      if (props.route.params.tab === 0) {
        getClassesRegistry();
      } else {
        getClassesLike();
      }
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      onRefresh(false);
    }, [IsFocused, tab]),
  );

  useEffect(() => {
    if (tab === 0 && !classesRegistry.data?.length) {
      getClassesRegistry();
    }
    if (tab === 1 && !classesLike.data?.length) {
      getClassesLike();
    }
  }, [tab]);
  async function getClassesRegistry(
    page = 1,
    limit = Constants.LIMIT,
    text = '',
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) {
        setBusy(true);
      }
      const response = await studentGetRegisteredClass(page, limit, text);
      console.log(' response', response);
      if (loadMore) {
        if (response?.payload) {
          setClassesRegistry({
            data: [...classesRegistry.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setClassesRegistry({
            data: response?.payload || [],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
        setBusy(false);
      }
      setRefresh(false);
    } catch (error) {
      console.log('get getClasses ==>', error);
    }
  }
  async function getClassesLike(
    page = 1,
    limit = Constants.LIMIT,
    status = true,
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) {
        setBusy2(true);
      }
      const response = await getFavoriteClass(page, limit, status);
      if (loadMore) {
        if (response?.payload) {
          setClassesLike({
            data: [...classesLike.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setClassesLike({
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
  async function onRefresh(showLoading = true) {
    if (showLoading) {
      setRefresh(true);
    }
    if (tab === 0) {
      await getClassesRegistry(1, Constants.LIMIT, '', false, true);
    } else {
      await getClassesLike(1, Constants.LIMIT, '', false, true);
    }
  }
  function handleSetTab(tab) {
    setTab(tab);
  }
  const renderFooter =
    (tab === 0 && classesRegistry.data?.length >= classesRegistry.totalItems) ||
    (tab === 1 && classesLike.data?.length >= classesLike.totalItems) ? (
      <Text style={Styles.countResult}>
        {tab === 0 ? classesRegistry.totalItems : classesLike.totalItems} kết
        quả
      </Text>
    ) : (
      <ActivityIndicator color={Colors.orange} />
    );

  function handleLoadMore() {
    if (
      (tab === 0 &&
        classesRegistry.currentPage * Constants.LIMIT <
          classesRegistry.totalItems) ||
      (tab === 1 &&
        classesLike.currentPage * Constants.LIMIT < classesLike.totalItems)
    ) {
      if (tab === 0) {
        getClassesRegistry(
          classesRegistry.currentPage + 1,
          Constants.LIMIT,
          '',
          true,
        );
      } else {
        getClassesLike(classesLike.currentPage + 1, Constants.LIMIT, '', true);
      }
    }
  }

  return (
    <Container
      header={
        <Statusbar
          title={'Quản lý đăng ký'}
          contentBarStyles={{justifyContent: 'center'}}
          tab={tab}
          tabLabels={['Lớp đã đăng ký', 'Yêu thích']}
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
          <Text style={[Styles.textBold, styles.title]}>
            {/* {tab === 0 ? 'Danh sách lớp đã đăng ký' : 'Danh sách lớp yêu thích'} */}
          </Text>
        </View>
      }
    >
      {(tab === 0 && !isBusy) || (tab === 1 && !isBusy2) ? (
        (tab === 0 && classesRegistry.data?.length) ||
        (tab === 1 && classesLike.data?.length) ? (
          <FlatList
            style={styles.listItem}
            showsVerticalScrollIndicator={false}
            data={tab === 0 ? classesRegistry.data : classesLike.data}
            renderItem={({item, index}) =>
              tab === 0 ? (
                item?.status !== 'reject' ? (
                  <ItemClassRegistered
                    data={item?.class || {}}
                    idManagement={item._id}
                    containerStyle={{marginHorizontal: 13}}
                    disabled={true}
                    navigation={props.navigation}
                    onRefresh={onRefresh}
                    access={'student'}
                    status={'registered'}
                    isRequest={item?.class?.isRequest}
                    isShowStudent={true}
                    isPayment={item?.isPayment}
                    requestStatus={item?.status}
                  />
                ) : null
              ) : (
                <ClassRoomHorizontal
                  data={item?.class}
                  isFollow={item?.isFollow}
                  containerStyle={{
                    flex: 1,
                    marginBottom: 8,
                    marginHorizontal: 10,
                  }}
                  navigation={props.navigation}
                  onRefresh={onRefresh}
                  isRequest={item?.class?.isRequest}
                  refresh={true}
                  isFollow={item?.isFollow}
                  isRegistry={item?.statusRegister}
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
    </Container>
  );
};

export default ManageRegistry;
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
});
