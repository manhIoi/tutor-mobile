import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Text} from 'react-native-elements';
import PropsTypes from 'prop-types';
import InputSearch from '../common/InputSearch';
import IconCustom from '../common/IconCustom';
import ImagesUtil from '../../utils/images.util';
import Styles from '../../theme/MainStyles';
import ProfileHorizontal from './ProfileHorizontal';
import ClassRoomHorizontal from './ClassRoomHorizontal';
import SwitchTab from '../common/SwitchTab';
import ConfigStyle from '../../theme/ConfigStyle';
import {getStatusBarHeight} from '../../utils/ScaleAdaptor';
import {getListTeacher, searchListTeacher} from '../../api/users';
import {getListClass, searchListClass} from '../../api/class';
import Colors from '../../theme/Colors';
import Constants from '../../../constants/Values';
import IconClose from '../../assets/images/svg/close.svg';
import useDebouncedEffect from '../../hooks/useDebounce';

const INIT_DATA_FILTER = {
  city: '',
  isOnline: '',
  maxDistance: '',
  subject: '',
  text: '',
  topic: '',
  typeClass: '',
  typeTeacher: '',
};
const INIT_VALUE = {
  data: [],
  currentPage: 1,
  totalItems: 0,
  limit: 10,
};

const height = Dimensions.get('window').height;
const ModalSearch = (props) => {
  const [tab, setTab] = useState(props?.tab);
  const [teachers, setTeacher] = useState(INIT_VALUE);
  const [classes, setClasses] = useState(INIT_VALUE);
  const [isBusy, setBusy] = useState(true);
  const [refreshing, setRefresh] = useState(false);
  const [dataFilter, setDataFilter] = useState(INIT_DATA_FILTER);
  // useEffect(() => {
  //   if (tab === 1 ) {
  //     console.log('tab1')
  //     getClasses(dataFilter);
  //   } else {
  //     console.log('tab2')
  //     getTeacher(dataFilter);
  //   }
  // }, [tab]);
  useDebouncedEffect(
    () => {
      const data = {
        maxDistance: props.dataFilter?.duration?.length
          ? parseInt(props.dataFilter?.duration) * 1000
          : '',
        typeTeacher: props.dataFilter?.typeTeacher,
        isOnline:
          tab === 1
            ? props.dataFilter?.teachingType === 0
              ? false
              : props.dataFilter?.teachingType === 1
              ? true
              : ''
            : props.dataFilter?.teachingType === 0
            ? 1
            : props.dataFilter?.teachingType === 1
            ? 0
            : '',
        topic: props.dataFilter?.topic,
        subject: props.dataFilter?.subject,
        typeClass: props.dataFilter?.class,
        city: props.dataFilter?.city,
        text: props.dataFilter?.text,
      };

      if (tab === 1) {
        getClasses(data);
      } else {
        getTeacher(data);
      }
    },
    500,
    [props?.dataFilter?.text, tab],
  );
  useEffect(() => {
    setTab(props.tab);
    setBusy(true);
  }, [props.tab]);
  async function getTeacher(
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
          setTeacher({
            data: [...teachers.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setTeacher({
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

  async function getClasses(
    data,
    page = 1,
    limit = 6,
    isRequest = false,
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) setBusy(true);
      const response = await searchListClass(data, page, limit, false);
      if (loadMore) {
        if (response?.payload) {
          setClasses({
            data: [...classes.data, ...response?.payload],
            currentPage: response?.page,
            totalItems: response?.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setClasses({
            data: response?.payload || [],
            currentPage: response?.page,
            totalItems: response?.total_item,
          });
        }
        setBusy(false);
      }
      setRefresh(false);
    } catch (error) {
      console.log('get getClasses searchListClass ==>', error);
    }
  }
  // useEffect(() => {
  //   if (Platform.OS === 'android') {
  //     // setStatusBarHeight(StatusBar.currentHeight);
  //   } else {
  //     setStatusBarHeight(getStatusBarHeight(true));
  //   }
  //   StatusBar.setBackgroundColor('rgba(0,0,0,0.5)');
  //   return () => {
  //     StatusBar.setBackgroundColor('rgba(255,0,0,0)');
  //   };
  // }, []);

  function handleLoadMore() {
    console.log('handleLoadMore');
    if (tab === 0) {
      if (teachers.currentPage * Constants.LIMIT < teachers.totalItems) {
        getTeacher(dataFilter, teachers.currentPage + 1, Constants.LIMIT, true);
      }
    } else {
      if (classes.currentPage * Constants.LIMIT < classes.totalItems) {
        getClasses(
          dataFilter,
          classes.currentPage + 1,
          Constants.LIMIT,
          false,
          true,
        );
      }
    }
  }
  function onRefresh(showLoading = true) {
    if (showLoading) {
      setRefresh(true);
    }
    if (tab === 0) {
      getTeacher(dataFilter, 1, Constants.LIMIT, false, true);
    } else {
      getClasses(dataFilter, 1, Constants.LIMIT, false, false, true);
    }
  }
  return (
    <View style={{height: 0.95 * height}}>
      <View style={styles.searchBar}>
        <View style={styles.controlGroup}>
          <InputSearch
            iconRight={props.iconRight}
            onSearch={props.onSearch}
            textSearch={props.textSearch}
            autoFocus={props.autoFocus}
          />
          <View style={styles.controlTab}>
            <IconCustom
              width={27}
              height={30}
              image={ImagesUtil.iconContact}
              containerStyle={{opacity: 0}}
            />
            <SwitchTab
              tab={tab}
              tabLabels={['Giáo viên', 'Lớp học']}
              changeTab={(index) => {
                props.changeTab(index);
                setTab(index);
              }}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={props.hideModalSearch}
          style={styles.iconClose}
        >
          <IconClose width={20}
height={20} />
        </TouchableOpacity>
      </View>
      {!isBusy ? (
        <FlatList
          style={styles.results}
          keyboardShouldPersistTaps="handled"
          data={tab === 1 ? classes.data : teachers.data}
          keyExtractor={(item) => item._id}
          renderItem={({item}) =>
            tab === 1 ? (
              <ClassRoomHorizontal
                hideModalSearch={props.hideModalSearch}
                navigation={props.navigation}
                data={item}
                onRefresh={onRefresh}
                containerStyle={{flex: 1, marginBottom: 10}}
                isRequest={item?.isRequest}
              />
            ) : (
              <ProfileHorizontal
                hideModalSearch={props.hideModalSearch}
                onRefresh={onRefresh}
                navigation={props.navigation}
                isRequest={item?.isRequest}
                data={item}
              />
            )
          }
          onEndReachedThreshold={0.2}
          onEndReached={() => handleLoadMore()}
          ListHeaderComponent={<View style={Styles.paddingTop} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.orange]}
            />
          }
          ListFooterComponent={() =>
            (tab === 0 && teachers.data?.length >= teachers.totalItems) ||
            (tab === 1 && classes.data?.length >= classes.totalItems) ? (
              <Text style={styles.countResult}>
                {tab === 0 ? teachers.totalItems : classes.totalItems} kết quả
              </Text>
            ) : (
              <ActivityIndicator color={Colors.whiteColor} />
            )
          }
        />
      ) : (
        <View style={{marginTop: 20}}>
          <ActivityIndicator color={Colors.greyText} />
        </View>
      )}
    </View>
  );
};

ModalSearch.prototype = {
  show: PropsTypes.bool.isRequired,
  hideModalSearch: PropsTypes.func,
};
export default ModalSearch;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#fff',
  },
  modal: {
    justifyContent: 'flex-start',
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  controlGroup: {
    width: '84%',
  },
  controlTab: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    height: 45,
    alignItems: 'center',
  },
  results: {
    marginTop: 15,
    // marginBottom: 100,
  },
  countResult: {
    textAlign: 'center',
    color: Colors.whiteColor,
    fontSize: 13,
    fontStyle: 'italic',
  },
  iconClose: {
    justifyContent: 'flex-start',
    paddingHorizontal: 5,
    marginTop: 10,
  },
});
