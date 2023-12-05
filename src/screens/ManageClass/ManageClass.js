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
import Container from '../../components/common/ContainerRenderList';
import Statusbar from '../../components/common/StatusBar';
import ConfigStyle from '../../theme/ConfigStyle';
import {
  getListClass,
  studentGetRegisteredClass,
  teacherGetListClass,
  teacherGetManageClass,
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
const ManageClass = (props) => {
  const [tab, setTab] = useState(0);
  const [classesOngoing, setClassesOngoing] = useState(INIT_VALUE);
  const [classesFinished, setClassesFinished] = useState(INIT_VALUE);
  const [isBusy, setBusy] = useState(false);
  const [isBusy2, setBusy2] = useState(false);
  const [refreshing, setRefresh] = useState(false);
  const user = useSelector((state) => state.auth.user);
  // useEffect(() => {
  //   if (props.route?.params?.tab) {
  //     setTab(props.route?.params?.tab);
  //     if (props.route.params.tab === 0) {
  //       getClassesOngoing();
  //     } else {
  //       getClassesFinished();
  //     }
  //   }
  // }, []);
  useEffect(() => {
    if (tab === 0 && !classesOngoing.data?.length) {
      getClassesOngoing();
    }
    if (tab === 1 && !classesFinished.data?.length) {
      getClassesFinished();
    }
  }, [tab]);
  async function getClassesOngoing(
    page = 1,
    limit = Constants.LIMIT,
    status = 'ongoing',
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) {
        setBusy(true);
      }
      const response = await teacherGetManageClass(page, limit, 'ongoing');
      if (loadMore) {
        if (response?.payload) {
          setClassesOngoing({
            data: [...classesOngoing.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setClassesOngoing({
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
  async function getClassesFinished(
    page = 1,
    limit = Constants.LIMIT,
    status = 'finish',
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) {
        setBusy2(true);
      }
      const response = await teacherGetManageClass(page, limit, 'finish');
      if (loadMore) {
        if (response?.payload) {
          setClassesFinished({
            data: [...classesFinished.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setClassesFinished({
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
      await getClassesOngoing(1, Constants.LIMIT, 'ongoing', false, true);
    } else {
      await getClassesFinished(1, Constants.LIMIT, 'finish', false, true);
    }
  }
  function handleSetTab(tab) {
    setTab(tab);
  }
  const renderFooter =
    (tab === 0 && classesOngoing.data?.length >= classesOngoing.totalItems) ||
    (tab === 1 &&
      classesFinished.data?.length >= classesFinished.totalItems) ? (
      <Text style={Styles.countResult}>
        {tab === 0 ? classesOngoing.totalItems : classesFinished.totalItems} kết
        quả
      </Text>
    ) : (
      <ActivityIndicator color={Colors.orange} />
    );

  function handleLoadMore() {
    if (
      (tab === 0 &&
        classesOngoing.currentPage * Constants.LIMIT <
          classesOngoing.totalItems) ||
      (tab === 1 &&
        classesFinished.currentPage * Constants.LIMIT <
          classesFinished.totalItems)
    ) {
      if (tab === 0) {
        getClassesOngoing(
          classesOngoing.currentPage + 1,
          Constants.LIMIT,
          '',
          true,
        );
      } else {
        getClassesFinished(
          classesFinished.currentPage + 1,
          Constants.LIMIT,
          '',
          true,
        );
      }
    }
  }

  return (
    <Container
      header={
        <Statusbar
          title={'Quản lý lớp học'}
          contentBarStyles={{justifyContent: 'center'}}
          tab={tab}
          tabLabels={['Lớp đang dạy', 'Lớp đã dạy']}
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
            {/* {tab === 0 ? 'Danh sách lớp đang dạy' : 'Danh sách lớp đã dạy'} */}
          </Text>
        </View>
      }
    >
      {(tab === 0 && !isBusy) || (tab === 1 && !isBusy2) ? (
        (tab === 0 && classesOngoing.data?.length) ||
        (tab === 1 && classesFinished.data?.length) ? (
          <FlatList
            style={styles.listItem}
            data={tab === 0 ? classesOngoing.data : classesFinished.data}
            renderItem={({item, index}) =>
              tab === 0 ? (
                <ItemClassRegistered
                  data={item || {}}
                  idManagement={item._id}
                  containerStyle={{marginHorizontal: 13}}
                  disabled={true}
                  navigation={props.navigation}
                  onRefresh={onRefresh}
                  status={'ongoing'}
                  access={'teacher'}
                  isShowStudent={true}
                  isRequest={item?.isRequest}
                />
              ) : (
                <ClassRoomHorizontal
                  data={item}
                  containerStyle={{
                    flex: 1,
                    marginBottom: 8,
                    marginHorizontal: 10,
                  }}
                  navigation={props.navigation}
                  onRefresh={onRefresh}
                  ownerView={true}
                  access={'teacher'}
                  isRequest={item?.isRequest}
                  isPayment={true}
                  isShowStudent={true}
                  type={'class'}
                  status={'finish'}
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

export default ManageClass;
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
