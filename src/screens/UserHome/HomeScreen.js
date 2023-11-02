import * as React from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {Text} from 'react-native-elements';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import Container from '../../components/common/Container';
import StatusBarHome from '../../components/common/StatusBarHome';
import RecommendCard from '../../components/Home/RecommendCard';
import ProfileHorizontal from '../../components/Home/ProfileHorizontal';
import AddButton from '../../components/common/AddButton';
import RecentActive from '../../components/Home/RecentActive';
import ClassListCard from '../../components/Home/ClassListCard';
import RecommendPlaceholder from '../../components/Home/RecommendCardPlaceholder';
import ProfilePlaceholder from '../../components/Home/ProfilePlacceholder';
import MessageUpdateInfo from '../../components/Home/MessageUpdateInfo';
import ActionNotification from '../../components/Home/ActionNotification';
import ConfigStyle from '../../theme/ConfigStyle';
import Styles from '../../theme/MainStyles';
import ImageUtils from '../../utils/images.util';
import {
  getListTeacher,
  teacherSuggestInfo,
  teacherSuggestDistance,
  teacherSuggestRating,
  getTeacherSuggest,
} from '../../api/users';
import {setCurrentUser} from '../../lib/slices/socketSlice';
import {checkUser} from '../../lib/slices/authSlice';
import IconEmpty from '../../assets/images/svg/empty-list.svg';
import {
  getListClassRecommend,
  getListClassByDistance,
  getListClassByRate,
  getClassSuggestService,
} from '../../api/class';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
// const teachers = [
//   {
//     isFlow: false,
//     _id: '1',
//     fullName: 'Full Name',
//     rate: 0,
//     avatar: {
//       large: '',
//
//     },
//     subject: [{
//       name: 'van',
//
//     }, {
//       name: 'toan'
//     }]
//   },
//   {
//     isFlow: false,
//     _id: '2',
//     fullName: 'Full Name',
//     rate: 0,
//     avatar: {
//       large: '',
//
//     },
//     subject: [{
//       name: 'van',
//
//     }, {
//       name: 'toan'
//     }]
//   },
// ]
//
// const teachersDistance = [
//   {
//     isFlow: false,
//     distance: null,
//     _id: '1',
//     fullName: 'Full Name',
//     dob: '20/05/2001',
//     rate: 0,
//     avatar: {
//       large: '',
//
//     },
//     subject: [{
//       name: 'van',
//
//     }, {
//       name: 'toan'
//     }]
//   },
//   {
//     isFlow: false,
//     distance: 2,
//     _id: '1',
//     fullName: 'Full Name',
//     dob: '20/05/2001',
//     rate: 0,
//     avatar: {
//       large: '',
//
//     },
//     subject: [{
//       name: 'van',
//
//     }, {
//       name: 'toan'
//     }]
//   },
//   {
//     isFlow: false,
//     distance: null,
//     _id: '1',
//     fullName: 'Full Name',
//     dob: '20/05/2001',
//     rate: 0,
//     avatar: {
//       large: '',
//
//     },
//     subject: [{
//       name: 'van',
//
//     }, {
//       name: 'toan'
//     }]
//   },
// ]

export default function HomeScreen(props) {
  const user = useSelector((state) => state.auth.user);
  const notify = useSelector((state) => state.notification.notiUpdate);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [teachers, setTeacher] = useState([]);
  const [teachersDistance, setTeachersDistance] = useState([]);
  const [teachersRating, setTeachersRating] = useState([]);
  const [classRecommend, setClassRecommend] = useState([]);
  const [classDistance, setClassDistance] = useState([]);
  const [classRate, setClassRate] = useState([]);
  const [tab, setTab] = useState(0);
  const [textSearch, setTextSearch] = useState('');
  const [isBusy, setBusy] = useState(false);
  const [isBusy1, setBusy1] = useState(false);
  const [isBusy2, setBusy2] = useState(true);
  const [classBusy, setClassBusy] = useState(true);
  const [refreshing, setRefresh] = useState(false);
  const [scrollTop, setScrollTop] = useState(new Date().getTime());
  const [showModalUpdate, setShowModalUpdate] = useState('');
  const [timeLoad, setTimeLoad] = useState(0);
  useFocusEffect(
    React.useCallback(() => {
      onRefresh(false);
      setShowModalUpdate(new Date().getTime());
    }, [isFocused]),
  );
  useEffect(() => {
    getInitData();
  }, []);
  useEffect(() => {
    // if (user?._id) {
    //   const currentUser = {
    //     _id: user._id,
    //     teacherId: user?.teacherId,
    //     access: user?.access,
    //     notify: notify?.notification,
    //   };
    //   dispatch(setCurrentUser(currentUser));
    // }
  }, [user]);
  async function getInitData() {
    const promise = [
      dispatch(checkUser()),
      getTeacher(),
      // getClassDistance(),
      getSuggestTeacherRating(),
      getSuggestTeacherDistance(),
    ];
    await Promise.all(promise);
  }
  useEffect(() => {
    if (tab === 1 && classBusy) {
      getClasses();
    }
  }, [tab]);
  function createRequest() {
    props.navigation.navigate('UserCreateRequest');
    // props.navigation.navigate('TeacherCreateClass');
  }
  function changeTab(value) {
    setScrollTop(new Date().getTime());
    setTab(value);
  }
  function onSearch(event) {
    const {text} = event.nativeEvent;
    setTextSearch(text);
  }
  async function onRefresh(showLoading = true) {
    return;
    if (showLoading) {
      setRefresh(true);
    }
    if (tab === 0) {
      const promise = [
        dispatch(checkUser()),
        getTeacher(),
        // getSuggestTeacherDistance(1, 4, 'distance', false, true),
        // getSuggestTeacherRating(1, 4, 'rating', false, true),
      ];
      await Promise.all(promise);
    } else {
      await getClasses(true);
    }
  }

  async function getTeacher(
    page = 1,
    limit = 4,
    type = 'info',
    all = false,
    refresh = false,
  ) {
    try {
      if (!refresh) {
        setBusy(true);
      }
      const data = await getTeacherSuggest(page, limit, type, false);
      if (data) {
        setTeacher(data);
        setTimeLoad(1);
      }
      setBusy(false);
      setRefresh(false);
    } catch (error) {
      console.log('get teacherSuggestInfo ==>', error);
    }
  }
  async function getSuggestTeacherDistance(
    page = 1,
    limit = 4,
    type = 'distance',
    all = false,
    refresh = false,
  ) {
    try {
      if (!refresh) {
        setBusy1(true);
      }
      const data = await getTeacherSuggest(page, limit, type, false);
      if (data) {
        setTeachersDistance(data || []);
        setTimeLoad(timeLoad + 1);
      }
      setBusy1(false);
      setRefresh(false);
    } catch (error) {
      console.log('get teacherSuggestDistance ==>', error);
    }
  }

  async function getSuggestTeacherRating(
    page = 1,
    limit = 4,
    type = 'rating',
    all = false,
    refresh = false,
  ) {
    try {
      if (!refresh) {
        setBusy2(true);
      }
      const data = await getTeacherSuggest(page, limit, type, false);
      if (data) {
        setTeachersRating(data || []);
        setTimeLoad(timeLoad + 1);
      }
      setBusy2(false);
      setRefresh(false);
    } catch (error) {
      console.log('get getSuggestTeacherRating ==>', error);
    }
  }
  async function getClasses(refresh = false) {
    if (!refresh) {
      setClassBusy(true);
    }
    const promise = [getClassRecommend(), getClassDistance(), getClassRate()];
    await Promise.all(promise);
    setClassBusy(false);
    setRefresh(false);
  }

  async function getClassRecommend(
    page = 1,
    limit = 4,
    type = 'info',
    all = false,
  ) {
    try {
      const response = await getClassSuggestService(page, limit, type, false);
      if (response?.payload) {
        setClassRecommend(response?.payload);
      }
    } catch (error) {
      console.log('get getClassRecommend ==>', error);
    }
  }
  async function getClassDistance(
    page = 1,
    limit = 4,
    type = 'distance',
    all = false,
  ) {
    try {
      // const response = await getListClassByDistance(page, limit, status, false)
      const response = await getClassSuggestService(page, limit, type, false);

      if (response?.payload) {
        setClassDistance(response?.payload || []);
      }
    } catch (error) {
      console.log('get getClassDistance ==>', error);
    }
  }

  async function getClassRate(
    page = 1,
    limit = 4,
    type = 'rating',
    all = false,
  ) {
    try {
      const response = await getClassSuggestService(page, limit, type, false);
      if (response?.payload) {
        setClassRate(response?.payload || []);
      }
    } catch (error) {
      console.log('get getClassRate ==>', error);
    }
  }

  function viewMoreAction(type, title, fill = '') {
    props.navigation.navigate('ShowAllList', {type: type, title, fill});
  }

  return (
    <Container
      footer={<AddButton onPress={createRequest} />}
      header={
        <StatusBarHome
          tab={tab}
          textSearch={textSearch}
          changeTab={changeTab}
          onSearch={onSearch}
          navigation={props.navigation}
          headerHeight={ConfigStyle.statusBarHomeHeight}
        />
      }
      headerHeight={ConfigStyle.statusBarHomeHeight}
      route={props.route}
      notScroll={(tab === 0 && isBusy) || (tab === 1 && classBusy)}
      refreshing={refreshing}
      onRefresh={onRefresh}
      shouldScrollTop={scrollTop}
    >
      <StatusBar translucent
backgroundColor="transparent" />
      <ActionNotification navigation={props.navigation} />
      {tab === 0 ? (
        <View style={styles.marginContent}>
          <View style={styles.containerListHorizontal}>
            <View style={{...styles.wrapTitle, marginHorizontal: 15}}>
              <Text style={[Styles.title2RS]}>ĐỀ XUẤT</Text>
              <TouchableOpacity
                onPress={() =>
                  viewMoreAction('teacher', 'ĐỀ XUẤT', 'recommend')
                }
              >
                {teachers.length ? (
                  <Text style={styles.viewAll}>Xem tất cả</Text>
                ) : null}
              </TouchableOpacity>
            </View>
            <View>
              <SafeAreaView style={styles.wrapList}>
                {!isBusy ? (
                  teachers.length ? (
                    <FlatList
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      scrollEnabled={!isBusy}
                      data={teachers}
                      renderItem={({item, index}) => (
                        <RecommendCard
                          data={item}
                          index={index}
                          length={teachers?.length}
                          onRefresh={onRefresh}
                          navigation={props.navigation}
                        />
                      )}
                      keyExtractor={(item) => item._id}
                    />
                  ) : (
                    <View style={styles.wrapEmptyImage}>
                      <IconEmpty width={'50%'}
height={'50%'} />
                      <Text style={Styles.textBlack3}>Không có dữ liệu</Text>
                    </View>
                  )
                ) : (
                  <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={[1, 2, 3]}
                    renderItem={({item}) => <RecommendPlaceholder />}
                    keyExtractor={(item) => item?.toString()}
                  />
                )}
              </SafeAreaView>
            </View>
          </View>
          <View style={styles.containerList}>
            <View style={styles.wrapTitle}>
              <Text style={Styles.title2RS}>GẦN ĐÂY</Text>
              <TouchableOpacity
                onPress={() => viewMoreAction('teacher', 'GẦN ĐÂY', 'distance')}
              >
                {teachersDistance.length ? (
                  <Text style={styles.viewAll}>Xem tất cả</Text>
                ) : null}
              </TouchableOpacity>
            </View>
            <View>
              <SafeAreaView
                style={[styles.wrapList, {flexDirection: 'column'}]}
              >
                {!isBusy1 ? (
                  teachersDistance.length ? (
                    <FlatList
                      horizontal={false}
                      showsHorizontalScrollIndicator={false}
                      data={teachersDistance}
                      renderItem={({item}) => (
                        <ProfileHorizontal
                          data={item}
                          onRefresh={onRefresh}
                          navigation={props.navigation}
                        />
                      )}
                      keyExtractor={(item) => item._id}
                    />
                  ) : (
                    <View style={styles.wrapEmptyImage}>
                      <IconEmpty width={'50%'}
height={'50%'} />
                      <Text style={Styles.textBlack3}>Không có dữ liệu</Text>
                    </View>
                  )
                ) : (
                  <FlatList
                    horizontal={false}
                    showsHorizontalScrollIndicator={false}
                    data={[1, 2, 3]}
                    renderItem={({item}) => <ProfilePlaceholder />}
                    keyExtractor={(item) => item?.toString()}
                  />
                )}
              </SafeAreaView>
            </View>
          </View>
          {!isBusy2 ? (
            <View>
              <View style={styles.containerListHorizontal}>
                <View style={{...styles.wrapTitle, marginHorizontal: 15}}>
                  <Text style={[Styles.title2RS]}>XẾP HẠNG CAO</Text>
                  <TouchableOpacity
                    onPress={() =>
                      viewMoreAction('teacher', 'XẾP HẠNG CAO', 'rate')
                    }
                  >
                    {teachersRating.length ? (
                      <Text style={styles.viewAll}>Xem tất cả</Text>
                    ) : null}
                  </TouchableOpacity>
                </View>
                <View>
                  <SafeAreaView style={styles.wrapList}>
                    {!isBusy2 ? (
                      teachersRating.length ? (
                        <FlatList
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}
                          data={teachersRating}
                          renderItem={({item, index}) => (
                            <RecommendCard
                              data={item}
                              index={index}
                              length={teachersRating?.length}
                              onRefresh={onRefresh}
                              navigation={props.navigation}
                            />
                          )}
                          keyExtractor={(item) => item._id}
                        />
                      ) : (
                        <View style={styles.wrapEmptyImage}>
                          <IconEmpty width={'50%'}
height={'50%'} />
                          <Text style={Styles.textBlack3}>
                            Không có dữ liệu
                          </Text>
                        </View>
                      )
                    ) : (
                      <FlatList
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={[1, 2, 3]}
                        renderItem={({item}) => <RecommendPlaceholder />}
                        keyExtractor={(item) => item?.toString()}
                      />
                    )}
                  </SafeAreaView>
                </View>
              </View>
              <RecentActive
                refreshing={refreshing}
                navigation={props.navigation}
              />
            </View>
          ) : null}
        </View>
      ) : null}
      {tab === 1 ? (
        <View style={styles.marginContent}>
          <ClassListCard
            data={classRecommend}
            title={'ĐỀ XUẤT'}
            viewMore={true}
            type={'horizontal'}
            isBusy={classBusy}
            onRefresh={onRefresh}
            navigation={props.navigation}
            viewMoreAction={() =>
              viewMoreAction('class', 'ĐỀ XUẤT', 'recommend')
            }
          />
          <ClassListCard
            data={classDistance}
            title={'GẦN ĐÂY'}
            viewMore={true}
            onRefresh={onRefresh}
            type={'vertical'}
            isBusy={classBusy}
            navigation={props.navigation}
            distance={true}
            viewMoreAction={() =>
              viewMoreAction('class', 'GẦN ĐÂY', 'distance')
            }
          />
          {!classBusy ? (
            <ClassListCard
              data={classRate}
              title={'XẾP HẠNG CAO'}
              viewMore={true}
              type={'horizontal'}
              onRefresh={onRefresh}
              isBusy={classBusy}
              navigation={props.navigation}
              viewMoreAction={() =>
                viewMoreAction('class', 'XẾP HẠNG CAO', 'rate')
              }
            />
          ) : null}
        </View>
      ) : null}
      {/*TODO: */}
      {/*<MessageUpdateInfo*/}
      {/*  navigation={props.navigation}*/}
      {/*  showModalUpdate={showModalUpdate}*/}
      {/*/>*/}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marginContent: {
    marginBottom: 50,
  },
  containerList: {
    marginHorizontal: 15,
    marginTop: 22,
  },
  containerListHorizontal: {
    marginHorizontal: 0,
    marginTop: 32,
  },
  wrapTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  wrapList: {
    marginTop: 20,
    flexDirection: 'row',
  },
  viewAll: {
    fontSize: ConfigStyle.RF.text6,
    paddingVertical: 5,
    paddingHorizontal: 3,
    zIndex: 99,
  },
  wrapEmptyImage: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 220,
    paddingBottom: 15,
  },
  emptyImage: {
    width: 150,
    height: 150,
    borderWidth: 1,
  },
  icon: {
    position: 'absolute',
    right: 0,
    top: 8,
  },
});
