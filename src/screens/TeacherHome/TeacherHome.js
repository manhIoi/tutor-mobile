import React, {useEffect, useState} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import Container from '../../components/common/Container';
import StatusbarCusTom from '../../components/common/StatusBar';
import ConfigStyle from '../../theme/ConfigStyle';
import IconCustom from '../../components/common/IconCustom';
import ClassListCard from '../../components/Home/ClassListCard';
import AddButton from '../../components/common/AddButton';
import ModalSearch from '../../components/TeacherHome/ModalSearch';
import {
  getListClass,
  teacherGetAllRequest,
  teacherGetClassInfo,
  teacherGetClassDistance,
  getRequestSuggestService,
} from '../../api/class';
import {checkUser} from '../../lib/slices/authSlice';
import ActionNotification from '../../components/Home/ActionNotification';
import {setCurrentUser} from '../../lib/slices/socketSlice';
import {getNotificationStatistic} from '../../api/notification';
import {updateNumberNotify} from '../../lib/slices/notificationSlice';

const TeacherHome = (props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const user = useSelector((state) => state.auth.user);
  const numberNotify = useSelector((state) => state.notification.numberNotify);
  const newNotifications = useSelector(
    (state) => state.notification.newNotifications,
  );
  const notify = useSelector((state) => state.notification.notiUpdate);

  const [textSearch, setTextSearch] = useState('');
  const [showModalSearch, setShowModalSearch] = useState(false);
  const [classes, setClasses] = useState([]);
  const [classesDistance, setClassesDistance] = useState([]);
  const [classBusy, setClassBusy] = useState(false);
  const [refreshing, setRefresh] = useState(false);
  const [timeLoad, setTimeLoad] = useState(0);
  useFocusEffect(
    React.useCallback(() => {
      if (timeLoad !== 0) {
        onRefresh(false);
        getNumberNotify();
      }
    }, [isFocused]),
  );

  useEffect(() => {
    getNumberNotify();
  }, [newNotifications]);

  useEffect(() => {
    if (user?._id) {
      const currentUser = {
        _id: user._id,
        access: user?.type,
        notify: notify?.notification,
      };
      dispatch(setCurrentUser(currentUser));
    }
  }, [user]);

  async function hideModalSearch() {
    setShowModalSearch(false);
  }
  useEffect(() => {
    getInitData();
    getNumberNotify();
  }, []);
  async function getInitData() {
    const promise = [
      dispatch(checkUser()),
      getClasses(),
      getClassesByDistance(),
    ];
    await Promise.all(promise);
  }
  async function getClasses(
    page = 1,
    limit = 4,
    type = 'info',
    all = false,
    refresh = false,
  ) {
    try {
      if (!refresh) {
        setClassBusy(true);
      }
      const response = await getRequestSuggestService(
        page,
        limit,
        'info',
        false,
      );
      setTimeLoad(timeLoad + 1);
      if (response?.payload) {
        setClasses(response?.payload || []);
      }
      setClassBusy(false);
      setRefresh(false);
    } catch (error) {
      console.log('get teacherGetAllRequest  ==>', error);
    }
  }
  async function getClassesByDistance(
    page = 1,
    limit = 4,
    type = 'distance',
    all = false,
    refresh = false,
  ) {
    try {
      if (!refresh) {
        setClassBusy(true);
      }
      const response = await getRequestSuggestService(
        page,
        limit,
        'distance',
        false,
      );
      setTimeLoad(timeLoad + 1);
      if (response?.payload) {
        setClassesDistance(response?.payload || []);
      }
      setClassBusy(false);
      setRefresh(false);
    } catch (error) {
      console.log('get teacherGetClassByDistace  ==>', error);
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

  const iconRight = (
    <IconCustom
      type="ionicon"
      number={numberNotify}
      name="notifications-outline"
      onPress={
        () => props.navigation.navigate('Profile', {screen: 'Notification'})
        // props.navigation.navigate('WebViewPayment')
      }
    />
  );
  // const renderFooter = loading ? (
  //   <ActivityIndicator color={Colors.orange} />
  // ) : null;
  function createRequest() {
    props.navigation.navigate('TeacherCreateClass');
  }
  function onFocusSearch() {
    setShowModalSearch(true);
  }
  async function onRefresh(showLoading = true) {
    if (showLoading) {
      setRefresh(true);
    }
    const promise = [
      dispatch(checkUser()),
      getClasses(1, 4, 'info', false, true),
      getClassesByDistance(1, 4, 'distance', false, true),
    ];
    await Promise.all(promise);
  }
  function handleViewAll(type) {
    props.navigation.navigate('ShowAllList', type);
  }
  return (
    <Container
      header={
        <StatusbarCusTom
          search={true}
          iconRight={iconRight}
          headerHeight={ConfigStyle.statusBarHeight}
          wrapIconReight={{marginTop: 0}}
          disabledInput={true}
          onFocusSearch={onFocusSearch}
          showModalSearch={showModalSearch}
        />
      }
      footer={<AddButton onPress={createRequest} />}
      headerHeight={ConfigStyle.statusBarHeight}
      hideBackground={true}
      notScroll={classBusy}
      refreshing={refreshing}
      onRefresh={onRefresh}
    >
      <StatusBar translucent
backgroundColor="transparent" />
      <ActionNotification navigation={props.navigation} />
      <View style={styles.marginContent}>
        <ClassListCard
          data={classes}
          title={'ĐỀ XUẤT'}
          viewMore={true}
          type={'horizontal'}
          isRequest={true}
          navigation={props.navigation}
          isBusy={classBusy}
          viewMoreAction={() =>
            handleViewAll({
              type: 'student-request',
              fill: 'student-request-recommend',
              access: 'teacher',
            })
          }
          access={'teacher'}
          isPayment={false}
          onRefresh={onRefresh}
          isHomepage={true}
        />
        <ClassListCard
          data={classesDistance}
          title={'GẦN ĐÂY'}
          isRequest={true}
          viewMore={true}
          type={'vertical'}
          navigation={props.navigation}
          isBusy={classBusy}
          viewMoreAction={() =>
            handleViewAll({
              type: 'student-request',
              fill: 'student-request-distance',
              access: 'teacher',
            })
          }
          access={'teacher'}
          onRefresh={onRefresh}
          isHomepage={true}
        />
      </View>
      {showModalSearch ? (
        <ModalSearch
          show={showModalSearch}
          hideModalSearch={hideModalSearch}
          navigation={props.navigation}
          textSearch={textSearch}
          onSearch={(value) => setTextSearch(value.nativeEvent.text)}
          access={'teacher'}
        />
      ) : null}
    </Container>
  );
};
export default TeacherHome;

const styles = StyleSheet.create({
  marginContent: {
    marginBottom: 30,
  },
});
