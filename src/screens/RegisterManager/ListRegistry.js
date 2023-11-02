import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Image,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Container from '../../components/common/ContainerRenderList';
import Statusbar from '../../components/common/StatusBar';
import ConfigStyle from '../../theme/ConfigStyle';
import Colors from '../../theme/Colors';
import ItemStudentRegistry from '../../components/ManageTutorRegister/ItemStudentRegistry';
import {studentGetClassById, teacherManageRegistry} from '../../api/class';
import Constants from '../../../constants/Values';
import ItemClassRegistered from '../../components/ManageRegistry/ItemClassRegistered';
import ClassRoomHorizontal from '../../components/Home/ClassRoomHorizontal';
import Styles from '../../theme/MainStyles';
import IconEmpty from '../../assets/images/svg/empty-list.svg';

const INIT_VALUE = {
  data: [],
  currentPage: 1,
  totalItems: 0,
  limit: 10,
};
export default function ListRegistry(props) {
  const [isBusy, setBusy] = useState(true);
  const [refreshing, setRefresh] = useState(false);
  const [listUser, setListUser] = useState([]);
  const [classData, setClassData] = useState({});

  useEffect(() => {
    if (props.route?.params?._id) {
      getManageRegistry(props.route.params._id);
      getClass(props.route.params._id);
    }
  }, []);

  async function getClass(id) {
    try {
      const response = await studentGetClassById(id);
      setClassData(response);
    } catch (error) {
      console.log('getClass ==> ', error);
    }
  }

  async function getManageRegistry(
    id,
    page = 1,
    limit = Constants.LIMIT,
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) {
        setBusy(true);
      }
      const response = await teacherManageRegistry(id, page, limit);
      if (loadMore) {
        if (response?.payload) {
          setListUser({
            data: [...listUser.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setListUser({
            data: response?.payload || [],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
        setBusy(false);
      }
      setRefresh(false);
    } catch (error) {
      console.log('getManageRegistry ==> ', error);
    }
  }
  async function onRefresh(showLoading = true) {
    if (showLoading) {
      setRefresh(true);
    }

    await getManageRegistry(
      props.route?.params?._id,
      1,
      Constants.LIMIT,
      false,
      true,
    );
    await getClass(props.route.params._id);
  }
  const renderFooter =
    listUser.data?.length >= listUser.totalItems ? (
      <Text style={Styles.countResult}>{listUser.totalItems} kết quả</Text>
    ) : (
      <ActivityIndicator color={Colors.orange} />
    );

  function handleLoadMore() {
    if (listUser.currentPage * Constants.LIMIT < listUser.totalItems) {
      getManageRegistry(listUser.currentPage + 1, Constants.LIMIT, '', true);
    }
  }

  return (
    <Container
      header={
        <Statusbar
          headerHeight={ConfigStyle.statusBarHeight}
          navigation={props.navigation}
          title={'Danh sách đăng ký'}
          arrowBack={true}
        />
      }
      hideBackground={true}
      headerHeight={ConfigStyle.statusBarHeight}
      contentTop={
        <View style={{marginHorizontal: 15}}>
          {props.route?.params?.isNotify &&
          (props.route?.params?.title || classData?.title) ? (
            <Text style={styles.titleClass}>
              Lớp : {props.route?.params?.title || classData?.title || ''}
            </Text>
          ) : null}
          <Text style={styles.textList}>
            Danh sách học viên đăng ký (
            {classData.order || props.route?.params?.order || 0}/
            {classData.quantity || props.route?.params?.quantity || 0})
          </Text>
        </View>
      }
    >
      <View style={{paddingHorizontal: 16}}>
        {!isBusy ? (
          listUser?.data?.length ? (
            <FlatList
              style={styles.listItem}
              data={listUser.data}
              renderItem={({item, index}) => (
                <ItemStudentRegistry
                  onRefresh={onRefresh}
                  data={item}
                  navigation={props.navigation}
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
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  textList: {
    fontSize: 16,
    color: Colors.black4,
    marginVertical: 10,
  },
  titleClass: {
    fontSize: 18,
    marginTop: 10,
  },
});
