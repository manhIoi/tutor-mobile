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
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import Container from '../../components/common/ContainerRenderList';
import Statusbar from '../../components/common/StatusBar';
import ConfigStyle from '../../theme/ConfigStyle';
import {getListClass, teacherGetListClass} from '../../api/class';
import Styles from '../../theme/MainStyles';
import Constants from '../../../constants/Values';
import ClassRoomHorizontal from '../../components/Home/ClassRoomHorizontal';
import IconEmpty from '../../assets/images/svg/empty-list.svg';
import Colors from '../../theme/Colors';
import ItemClassRegistered from '../../components/ManageRegistry/ItemClassRegistered';
import ItemRegistry from '../../components/ManageTutorRegister/ItemRegistry';

const INIT_VALUE = {
  data: [],
  currentPage: 1,
  totalItems: 0,
  limit: 10,
};
const ManageRegistry = (props) => {
  const [tab, setTab] = useState(0);
  const user = useSelector((state) => state.auth.user);

  const [classesRegistry, setClassesRegistry] = useState(INIT_VALUE);
  const [classesLike, setClassesLike] = useState(INIT_VALUE);
  const [classWait, setClassWait] = useState(INIT_VALUE);
  const [isBusy, setBusy] = useState(true);
  const [isBusy2, setBusy2] = useState(true);
  const [isBusy3, setBusy3] = useState(true);
  const [refreshing, setRefresh] = useState(false);
  useEffect(() => {
    if (props.route?.params?.tab) {
      setTab(props.route?.params?.tab);
      if (props.route.params.tab === 0) {
        getClassesRegistry();
      } else if (props.route.params.tab === 1) {
      } else {
        getClassesLike();
      }
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (tab === 0) {
        getClassesRegistry(1, Constants.LIMIT, '', false, true);
      }
      // if (tab === 1) {
      //   getClassesWait(1, Constants.LIMIT, '', false, true);
      // }
      if (tab === 1) {
        getClassesLike(1, Constants.LIMIT, '', false, true);
      }
    }, [tab]),
  );

  useEffect(() => {
    if (tab === 0 && !classesRegistry.data?.length) {
      getClassesRegistry();
    }
    // if (tab === 1 && !classWait.data?.length) {
    //   getClassesWait();
    // }
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
      const response = await teacherGetListClass(
        user?._id,
        'pending',
        page,
        limit,
      );
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

  async function getClassesWait(
    page = 1,
    limit = Constants.LIMIT,
    text = '',
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) {
        setBusy2(true);
      }
      const response = await teacherGetListClass(
        user?._id,
        'wait_start',
        page,
        limit,
      );
      if (loadMore) {
        if (response?.payload) {
          setClassWait({
            data: [...classWait.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setClassWait({
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

  async function getClassesLike(
    page = 1,
    limit = Constants.LIMIT,
    text = '',
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) {
        setBusy3(true);
      }
      const response = await teacherGetListClass(
        user?._id,
        'upcoming',
        page,
        limit,
      );
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
        setBusy3(false);
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
    }
    // else if (tab === 1) {
    //   await getClassesWait(1, Constants.LIMIT, '', false, true);
    // }
    else {
      await getClassesLike(1, Constants.LIMIT, '', false, true);
    }
  }
  function handleSetTab(tab) {
    setTab(tab);
  }
  const renderFooter =
    (tab === 0 && classesRegistry.data?.length >= classesRegistry.totalItems) ||
    // (tab === 1 && classWait.data?.length >= classWait.totalItems) ||
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
      // (tab === 1 &&
      //   classWait.currentPage * Constants.LIMIT < classWait.totalItems) ||
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
      } else if (tab === 1) {
        getClassesLike(classesLike.currentPage + 1, Constants.LIMIT, '', true);
        // getClassesWait(classWait.currentPage + 1, Constants.LIMIT, '', true);
      }
      // else {
      //   getClassesLike(classesLike.currentPage + 1, Constants.LIMIT, '', true);
      // }
    }
  }

  return (
    <Container
      header={
        <Statusbar
          title={'Quản lý đăng ký'}
          contentBarStyles={{justifyContent: 'center'}}
          tab={tab}
          tabLabels={['Chờ duyệt', 'Sắp diễn ra']}
          changeTab={handleSetTab}
          arrowBack={true}
          navigation={props.navigation}
          contentBarStyles={{justifyContent: 'space-between'}}
          headerHeight={ConfigStyle.statusBarHeight}
          // tabStyle={{paddingHorizontal: 20}}
        />
      }
      headerHeight={ConfigStyle.statusBarHeight}
      hideBackground={false}
      contentTop={
        <View style={styles.wrapTitle}>
          <Text style={[Styles.textBold, styles.title]}>
            {/* {tab === 0 */}
            {/*  ? 'Danh sách lớp chờ Admin duyệt' */}
            {/*  : 'Danh sách lớp chờ đăng ký'} */}
          </Text>
        </View>
      }
    >
      {(tab === 0 && !isBusy) ||
      // (tab === 1 && !isBusy2) ||
      (tab === 1 && !isBusy3) ? (
        (tab === 0 && classesRegistry.data?.length) ||
        // (tab === 1 && classWait.data?.length) ||
        (tab === 1 && classesLike.data?.length) ? (
          <FlatList
            style={styles.listItem}
            data={
              tab === 0
                ? classesRegistry.data
                : // : tab === 1
                  // ? classWait.data
                  classesLike.data
            }
            renderItem={({item, index}) => (
              <ItemClassRegistered
                data={item || {}}
                idManagement={item._id}
                containerStyle={{marginHorizontal: 13}}
                disabled={true}
                navigation={props.navigation}
                onRefresh={onRefresh}
                isRequest={item?.isRequest}
                isEdit={tab === 0}
                status={tab === 0 ? 'pending' : 'upcoming'}
                access={'teacher'}
                isShowStudent={true}
                edit={true}
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
