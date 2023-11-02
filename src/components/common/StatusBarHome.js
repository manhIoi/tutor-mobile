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

const INIT_FORM = {
  city: '',
  duration: '',
  typeTeacher: '',
  teachingType: '',
  topic: '',
  subject: '',
  class: '',
  text: '',
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

  function handleFilter() {
    setShouldSearch(new Date().getTime());
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
        height: ConfigStyle.statusBarHomeHeight + statusBarHeight,
      }}
    >
      <StatusBar translucent
backgroundColor="transparent" />
      <BackgroundImageTop imageSource={props.imageSource} />
      <View
        style={{
          ...styles.container,
          marginTop: statusBarHeight,
        }}
      >
        <View style={styles.searchBar}>
          <View style={styles.controlGroup}>
            <View style={{height: 43}}>
              {!showFilter && !showModalSearch ? (
                <InputSearch
                  iconRight={iconRight}
                  onSearch={props.onSearch}
                  textSearch={props.textSearch}
                  onFocusSearch={() => onFocusSearch(true)}
                  disabled={true}
                />
              ) : null}
            </View>

            <View style={styles.controlTab}>
              {props.tab === 0 ? (
                <IconCustom
                  width={26.7}
                  height={30.3}
                  svg={<IconContact width={26.7}
height={30.3} />}
                  containerStyle={{marginLeft: 5}}
                  styleNumber={{right: 3, top: -3}}
                  onPress={() =>
                    props.navigation.navigate('Chat', {screen: 'Contacts'})
                  }
                />
              ) : (
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('Calendar', {
                      screen: 'ManageRegistry',
                      params: {tab: 1},
                    })
                  }
                >
                  <IconHeart width={30}
height={30} />
                </TouchableOpacity>
              )}

              {!showModalSearch ? (
                <SwitchTab
                  tab={props.tab}
                  tabLabels={['Giáo viên', 'Lớp học']}
                  changeTab={props.changeTab}
                />
              ) : null}
            </View>
          </View>
          <View style={{...styles.iconNoti}}>
            <IconCustom
              type="ionicon"
              number={numberNotify}
              name="notifications-outline"
              onPress={() =>
                props.navigation.navigate('Profile', {screen: 'Notification'})
              }
            />
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
            textSearch={form.text}
            navigation={props.navigation}
            hideModalSearch={hideModalSearch}
            hideModalFilter={hideModalFilter}
            onSearch={(value) => handleChangeForm('text', value)}
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
