import React, {useEffect, useState} from 'react';
import {Text} from 'react-native-elements';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {func} from 'prop-types';
import Statusbar from '../../components/common/StatusBar';
import ConfigStyle from '../../theme/ConfigStyle';
import Container from '../../components/common/ContainerRenderList';
import {
  getListClass,
  teacherGetAllRequest,
  getListClassRecommend,
  getListClassByDistance,
  getListClassByRate,
  teacherGetClassInfo,
  teacherGetClassDistance,
  getClassSuggestService,
  getRequestSuggestService,
  searchListClass,
  searchRequestList,
} from '../../api/class';
import Constants from '../../../constants/Values';
import ClassRoomHorizontal from '../../components/Home/ClassRoomHorizontal';
import ImageUtils from '../../utils/images.util';
import IconEmpty from '../../assets/images/svg/empty-list.svg';
import Styles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';
import {
  getListTeacher,
  teacherSuggestInfo,
  teacherSuggestDistance,
  teacherSuggestRating,
  getTeacherByRequestId,
  getTeacherSuggest,
  searchListTeacher,
} from '../../api/users';
import ProfileHorizontal from '../../components/Home/ProfileHorizontal';
import IconFill from '../../assets/images/svg/icon-fill.svg';
import IconFillActive from '../../assets/images/svg/icon-fill-active.svg';
import ModalFilter from '../../components/Home/ModalFilter';
import StatusBarHome from '../../components/common/StatusBarHome';

const INIT_VALUE = {
  data: [],
  currentPage: 1,
  totalItems: 0,
  limit: 10,
};
const INIT_FORM = {
  city: '',
  isOnline: '',
  maxDistance: '',
  subject: '',
  text: '',
  topic: '',
  typeClass: '',
  typeTeacher: '',
};
const ShowAllList = (props) => {
  const [type, setType] = useState('');
  const [isBusy, setBusy] = useState(true);
  const [refreshing, setRefresh] = useState(false);
  const [dataList, setDataList] = useState(INIT_VALUE);
  const [showFilter, setFilter] = useState(false);
  const [textSearch, setTextSearch] = useState('');
  const [form, setForm] = useState(INIT_FORM);
  useEffect(() => {
    console.info("LOGGER:: ", props);
    setType(props.route.params.type);
    if (props?.route?.params?.type === 'class') {
      getClasses();
    } else {
      getTeacher()
    }
    // if (props?.route?.params?.type === 'teacher') {
    //   if (props?.route?.params?.fill !== 'requestById') getTeacher();
    //   else teacheGetRequestById(props?.route?.params?.classId);
    // }
    // if (props?.route?.params?.type === 'student-request') {
    //   getClassesRequest();
    // }
    // if (props?.route?.params?.type === 'request') {
    //   teacheGetRequestById(props?.route?.params?.classId);
    // }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (props?.route?.params?.type === 'class') {
        getClasses(1, Constants.LIMIT, '', false, true);
      }
      if (props?.route?.params?.type === 'teacher') {
        // getTeacher(1, Constants.LIMIT, '', false, true);
        if (props?.route?.params?.fill !== 'requestById')
          getTeacher(1, Constants.LIMIT, '', false, true);
        else
          teacheGetRequestById(
            props?.route?.params?.classId,
            1,
            Constants.LIMIT,
            '',
            false,
            true,
          );
      }
      if (props?.route?.params?.type === 'student-request') {
        getClassesRequest(1, Constants.LIMIT, '', false, true);
      }
      if (props?.route?.params?.type === 'request') {
        teacheGetRequestById(
          props?.route?.params?.classId,
          1,
          Constants.LIMIT,
          false,
          true,
        );
      }
    }, []),
  );
  async function teacheGetRequestById(
    id,
    page = 1,
    limit = 10,
    text = '',
    loadMore = false,
    refreshing = false,
  ) {
    try {
      const response = await getTeacherByRequestId(id, page, limit, text);
      if (loadMore) {
        if (response?.payload) {
          setDataList({
            data: [...dataList.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setDataList({
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
  async function getClassesRequest(
    page = 1,
    limit = Constants.LIMIT,
    text = '',
    loadMore = false,
    refreshing = false,
  ) {
    try {
      if (!loadMore && !refreshing) {
        setBusy(true);
      }
      let response = null;
      const fill = props.route?.params?.fill;
      // const response = await teacherGetAllRequest(page, limit);
      if (fill === 'student-request-recommend') {
        response = await getRequestSuggestService(page, limit, 'info', true);
      } else if (fill === 'student-request-distance') {
        response = await getRequestSuggestService(
          page,
          limit,
          'distance',
          true,
        );
      } else {
        response = await teacherGetAllRequest(page, limit);
      }
      if (loadMore) {
        if (response?.payload) {
          setDataList({
            data: [...dataList.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setDataList({
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

  async function getClasses(
    page = 1,
    limit = Constants.LIMIT,
    text = '',
    loadMore = false,
    refreshing = false,
  ) {
    try {
      if (!loadMore && !refreshing) {
        setBusy(true);
      }
      const fill = props.route?.params?.fill;
      let response = null;
      if (fill === 'recommend') {
        // response = await getListClassRecommend(page, limit);
        response = await getClassSuggestService(page, limit, 'info', true);
      } else if (fill === 'distance') {
        // response = await getListClassByDistance(page, limit);
        response = await getClassSuggestService(page, limit, 'distance', true);
      } else if (fill === 'rate') {
        // response = await getListClassByRate(page, limit);
        response = await getClassSuggestService(page, limit, 'rating', true);
      } else {
        response = await getListClass(page, limit);
      }
      if (loadMore) {
        if (response?.payload) {
          setDataList({
            data: [...dataList.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setDataList({
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

  async function getTeacher(
    page = 1,
    limit = Constants.LIMIT,
    text = '',
    loadMore = false,
    refreshing = false,
  ) {
    try {
      if (!loadMore && !refreshing) {
        setBusy(true);
      }
      const fill = props.route?.params?.fill;
      let response = null;
      if (fill === 'recommend') {
        // response = await getListClassRecommend(page, limit);
        // response = await getTeacherSuggest(page, limit, 'info', true);
      } else if (fill === 'distance') {
        // response = await getListClassByDistance(page, limit);
        // response = await getTeacherSuggest(page, limit, 'distance', true);
      } else if (fill === 'rate') {
        // response = await getListClassByRate(page, limit);
        // response = await getTeacherSuggest(page, limit, 'rating', false);
      } else {
        // response = await getListTeacher(page, limit);
      }
      if (loadMore) {
        if (response) {
          // setDataList({
          //   data: [...dataList.data, ...(response?.payload || [])],
          //   currentPage: response?.page,
          //   totalItems: response.total_item,
          // });
        }
      } else {
        if (response) {
          setDataList({
            data: response || [],
            // currentPage: response?.page,
            // totalItems: response.total_item,
          });
        }
        setBusy(false);
      }
      setRefresh(false);
    } catch (error) {
      console.log('get getClasses ==>', error);
    }
  }

  function handleLoadMore() {
    if (dataList.currentPage * Constants.LIMIT < dataList.totalItems) {
      if (type === 'class') {
        getClasses(dataList.currentPage + 1, Constants.LIMIT, '', true);
      } else {
        // getTeacher(dataList.currentPage + 1, Constants.LIMIT, '', true);
        if (props?.route?.params?.fill !== 'requestById')
          getTeacher(dataList.currentPage + 1, Constants.LIMIT, '', true);
        else
          teacheGetRequestById(
            props?.route?.params?.classId,
            dataList.currentPage + 1,
            Constants.LIMIT,
            '',
            true,
          );
      }
    }
  }
  function onRefresh() {
    setRefresh(true);
    if (type === 'class') {
      getClasses(1, Constants.LIMIT, '', false, true);
    } else if (type === 'teacher') {
      // getTeacher(1, Constants.LIMIT, '', false, true);
      if (props?.route?.params?.fill !== 'requestById')
        getTeacher(1, Constants.LIMIT, '', false, true);
      else
        teacheGetRequestById(
          props?.route?.params?.classId,
          1,
          Constants.LIMIT,
          '',
          false,
          true,
        );
    } else if (type === 'request') {
      getTeacherByRequestId(
        props?.route?.params?.classId,
        1,
        Constants.LIMIT,
        false,
        true,
      );
    } else {
      getClassesRequest(1, Constants.LIMIT, '', false, true);
    }
  }
  const renderFooter =
    dataList.data?.length >= dataList.totalItems ? (
      <Text style={styles.countResult}>{dataList.totalItems} kết quả</Text>
    ) : (
      <ActivityIndicator color={Colors.orange} />
    );

  function hideModalFilter() {
    // setFilter(false);
  }

  function showModalFilter() {
    // setFilter(true);
  }
  const iconSearchRight = (
    <TouchableOpacity
      onPress={!showFilter ? showModalFilter : hideModalFilter}
      style={styles.wrapIconRight}
    >
      <View style={styles.iconFilter}>
        {!showFilter ? (
          <IconFill width={12.6}
height={18} />
        ) : (
          <IconFillActive width={12.6}
height={18} />
        )}
      </View>
    </TouchableOpacity>
  );

  function onChangeTextSearch(event) {
    const {text} = event.nativeEvent;
    setTextSearch(text);
  }

  function handleChangeForm(name, value) {
    setForm({
      ...form,
      [name]: value,
    });
  }

  function handleSearch() {
    hideModalFilter();
  }
  function actionSearch(event) {
    const {text} = event.nativeEvent;
    handleChangeForm('text', text);

    setTextSearch(text);
  }
  async function getSearchTeacher(
    data,
    page = 1,
    limit = Constants.LIMIT,
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) setBusy(true);
      const response = await searchListTeacher(data, page, limit);

      if (loadMore) {
        if (response?.payload) {
          setDataList({
            data: [...setDataList.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setDataList({
            data: response?.payload || [],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
        setBusy(false);
      }
      setRefresh(false);
    } catch (error) {
      console.log('get Teacher ==>', error);
    }
  }
  async function getSearchClass(
    data,
    page = 1,
    limit = Constants.LIMIT,
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) setBusy(true);
      const response = await searchListClass(data, page, limit);

      if (loadMore) {
        if (response?.payload) {
          setDataList({
            data: [...setDataList.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setDataList({
            data: response?.payload || [],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
        setBusy(false);
      }
      setRefresh(false);
    } catch (error) {
      console.log('get Teacher ==>', error);
    }
  }
  async function getSearchRequest(
    page = 1,
    limit = Constants.LIMIT,
    text = '',
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) setBusy(true);
      const response = await searchRequestList(page, limit, text);

      if (loadMore) {
        if (response?.payload) {
          setDataList({
            data: [...setDataList.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setDataList({
            data: response?.payload || [],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
        setBusy(false);
      }
      setRefresh(false);
    } catch (error) {
      console.log('get Teacher ==>', error);
    }
  }
  useEffect(() => {
    // console.log(form)
    if (type === 'class') {
      getSearchClass(form);
    } else if (type === 'teacher') {
      if (props?.route?.params?.fill !== 'requestById') getSearchTeacher(form);
      else
        teacheGetRequestById(
          props?.route?.params?.classId,
          1,
          Constants.LIMIT,
          textSearch,
        );
    } else if (type === 'student-request') getSearchRequest(1, 10, textSearch);
  }, [textSearch]);
  return (
    <Container
      header={
        <Statusbar
          search={true}
          headerHeight={ConfigStyle.statusBarHeightList}
          textSearch={textSearch}
          navigation={props.navigation}
          arrowBack={true}
          actionSearch={actionSearch}
          title={
            type === 'class'
              ? 'Danh sách lớp học'
              : type === 'student-request'
              ? 'Danh sách yêu cầu'
              : 'Danh sách gia sư'
          }
          // iconSearchRight={iconSearchRight}
          showModalSearch={showFilter}
        />
      }
      headerHeight={ConfigStyle.statusBarHeightList}
      hideBackground={props.route?.params?.hideBackground === undefined}
      keyboardShouldPersistTaps={'always'}
      notScroll={isBusy}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentTop={
        props.route?.params?.title ? (
          <View style={styles.wrapTitle}>
            <Text
              style={{
                ...Styles.title2RS,
                ...styles.title,
                ...props?.route?.params?.titleStyle,
              }}
            >
              {props.route.params.title}
            </Text>
          </View>
        ) : null
      }
    >
      {!isBusy ? (
        dataList.data?.length ? (
          <FlatList
            style={{marginTop: 0}}
            data={dataList.data}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.orange]}
              />
            }
            renderItem={({item}) =>
              type === 'class' || type === 'student-request' ? (
                <ClassRoomHorizontal
                  data={item}
                  navigation={props.navigation}
                  containerStyle={{
                    flex: 1,
                    marginBottom: 10,
                    marginHorizontal: 12,
                  }}
                  isRequest={type === 'student-request'}
                  classRequest={type === 'student-request'}
                  hideModalSearch={props.hideModalSearch}
                  onRefresh={onRefresh}
                  access={props?.route?.params?.access}
                />
              ) : (
                <ProfileHorizontal
                  data={item}
                  navigation={props.navigation}
                  containerStyle={{marginHorizontal: 12, marginBottom: 12}}
                  classId={props.route?.params?.classId}
                  className={props.route?.params?.className}
                  onRefresh={onRefresh}
                  access={props?.route?.params?.access}
                />
              )
            }
            ListFooterComponent={renderFooter}
            onEndReachedThreshold={0.4}
            onEndReached={handleLoadMore}
          />
        ) : (
          <View style={Styles.wrapEmptyImage}>
            <IconEmpty width={'20%'}
height={'40%'} />
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
          hideModalFilter={hideModalFilter}
          onSearch={onChangeTextSearch}
          iconRight={iconSearchRight}
          textSearch={textSearch}
          dataFill={form}
          handleChangeForm={handleChangeForm}
          handleFilter={handleSearch}
          searchBar={{
            justifyContent: 'center',
            marginTop: 30,
          }}
          controlGroup={{width: '86%'}}
        />
      ) : null}
    </Container>
  );
};

export default ShowAllList;

const styles = StyleSheet.create({
  countResult: {
    textAlign: 'center',
    color: Colors.black3,
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  wrapIconRight: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  iconFilter: {
    width: 12,
    height: 18,
    marginRight: 15,
  },
  wrapTitle: {
    margin: 10,
    marginBottom: 2,
    marginLeft: 15,
  },
});
