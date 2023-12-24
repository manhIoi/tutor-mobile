import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import InputSearch from './InputSearch';
import IconCustom from './IconCustom';
import SwitchTab from './SwitchTab';
import BackgroundImageTop from '../Tools/BackgroundImageTop';
import Filter from '../Home/Filter';
import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';
import IconHeart from '../../assets/images/svg/iconHeartCircle.svg';
import {getStatusBarHeight} from '../../utils/ScaleAdaptor';
import IconContact from '../../assets/images/svg/contact (1).svg';
import IconFill from '../../assets/images/svg/icon-fill.svg';
import IconFillActive from '../../assets/images/svg/icon-fill-active.svg';
import {getNotificationStatistic} from '../../api/notification';
import {updateNumberNotify} from '../../lib/slices/notificationSlice';
import IconNotification from "../../assets/images/svg/alarm.svg";

const INIT_FORM = {
  city: '',
  duration: '',
  typeTeacher: '',
  teachingType: '',
  topic: '',
  subject: '',
  class: '',
  text: '',
  dob: '',
};
const StatusBarHome = (props) => {
  const dispatch = useDispatch();
  const numberNotify = useSelector((state) => state.notification.numberNotify);
  const newNotifications = useSelector(
    (state) => state.notification.newNotifications,
  );
  const [showFilter, setFilter] = useState(false);
  const [showModalSearch, setModalSearch] = useState(false);
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const [form, setForm] = useState(INIT_FORM);
  const [autoFocus, setAutoFocus] = useState(false);
  const [shouldSearch, setShouldSearch] = useState('');
  const isSearchTeacher = props?.tab === 0;
  useEffect(() => {
    if (Platform.OS === 'android') {
      setStatusBarHeight(StatusBar.currentHeight);
    } else {
      setStatusBarHeight(getStatusBarHeight(true));
    }
  }, []);

  useEffect(() => {
    getNumberNotify();
  }, [newNotifications]);

  useFocusEffect(
    React.useCallback(() => {
      getNumberNotify();
    }, []),
  );

  function handleChangeForm(name, value) {
    setForm({
      ...form,
      [name]: value,
    });
  }

  function hideModalFilter() {
    // setFilter(false);
    if (showFilter) {
      setFilter(false);
    } else {
      setModalSearch(false);
    }
  }

  async function getNumberNotify() {
    try {
      const response = await getNotificationStatistic();
      dispatch(updateNumberNotify(response.unView));
    } catch (error) {
      console.log('getNumberNotify ==> ', error);
    }
  }

  function handleFilter({ subject } = {}) {
    console.info(`🔥🔥🔥LOGGER::  subject`, subject, form);
    setAutoFocus(false);
    onFocusSearch(false);
    hideModalFilter();
  }
  function showModalFilter() {
    setFilter(true);
  }
  async function hideModalSearch() {
    setForm(INIT_FORM);
    setModalSearch(false);
  }
  const iconRight = (
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

  function onFocusSearch(showKeyboard = true) {
    if (showKeyboard) {
      setAutoFocus(true);
    }
    setModalSearch(true);
  }

  return (
    <View
      style={{
        ...styles.wrapper,
        height: Platform.select({
          ios: 170,
          android: ConfigStyle.statusBarHomeHeight + statusBarHeight
        }),
      }}
    >
      <StatusBar translucent
backgroundColor="transparent" />
      <BackgroundImageTop imageSource={props.imageSource} />
      <View
        style={{
          ...styles.container,
          marginTop: Platform.select({ android: statusBarHeight, ios: 60 }) ,
        }}
      >
        <View style={styles.searchBar}>
          <View style={styles.controlGroup}>
            <View style={{height: 43, flexDirection: "row", justifyContent: "space-between"}}>
              <TouchableOpacity style={{ flex:1}} onPress={() => {
                props.navigation.navigate('Search', {
                  isSearchTeacher
                })
              }} >
                <InputSearch textInputProps={{ editable: false, placeholder: `Tìm kiếm ${isSearchTeacher ? "giáo viên" : "lớp học"} ...` }}   />
              </TouchableOpacity>
              <View>
                <View style={{ marginLeft:10, backgroundColor: Colors.whiteColor,height: "100%", aspectRatio:1, borderRadius: 50, justifyContent: "center", alignItems: "center"}}>
                  <IconNotification
                      onPress={() =>
                          props.navigation.navigate('Profile', {screen: 'Notification'})
                      }
                  />
                </View>
              </View>
            </View>

            <View style={styles.controlTab}>

              {!showModalSearch ? (
                <SwitchTab
                  tab={props.tab}
                  tabLabels={['Giáo viên', 'Lớp học']}
                  changeTab={props.changeTab}
                />
              ) : null}
            </View>
          </View>
        </View>

        {showModalSearch || showFilter ? (
          <Filter
            showFilter={showFilter}
            showSearch={showModalSearch}
            autoFocus={autoFocus}
            shouldSearch={shouldSearch}
            iconRight={iconRight}
            tab={props.tab}
            dataFilter={form}
            changeTab={props.changeTab}
            navigation={props.navigation}
            hideModalSearch={hideModalSearch}
            hideModalFilter={hideModalFilter}
            handleChangeForm={handleChangeForm}
            handleFilter={handleFilter}
          />
        ) : null}
      </View>
    </View>
  );
};




export default StatusBarHome;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 99,
    backgroundColor: Colors.whiteColor,
    overflow: 'hidden',
    paddingBottom: 10,
  },
  container: {
    minHeight: 90,
    // paddingTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    zIndex: 99,
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  controlGroup: {
    width: '100%',
  },
  controlTab: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
    height: 45,
    alignItems: 'center',
  },
  iconFilter: {
    width: 12,
    height: 18,
    marginRight: 15,
  },
  iconNoti: {
    marginTop: 5,
  },
  wrapIconRight: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
});
