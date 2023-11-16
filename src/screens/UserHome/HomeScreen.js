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
import {useEffect, useReducer, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import Container from '../../components/common/Container';
import StatusBarHome from '../../components/common/StatusBarHome';
import ProfileHorizontal from '../../components/Home/ProfileHorizontal';
import AddButton from '../../components/common/AddButton';
import ClassListCard from '../../components/Home/ClassListCard';
import ProfilePlaceholder from '../../components/Home/ProfilePlacceholder';
import ActionNotification from '../../components/Home/ActionNotification';
import ConfigStyle from '../../theme/ConfigStyle';
import Styles from '../../theme/MainStyles';
import {
  getTeacherSuggest,
} from '../../api/users';
import IconEmpty from '../../assets/images/svg/empty-list.svg';
import {
  getOtherDataClass,
} from '../../api/class';
import ItemCourseRequest from "../../components/RequestManagement/ItemCourseRequest";
import TutorRequestItem from "../../components/RequestManagement/TutorRequestItem";
import Calendar from "../../routes/CalendarStack";


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function HomeScreen(props) {
  const user = useSelector((state) => state.auth.user);
  const notify = useSelector((state) => state.notification.notiUpdate);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [classRecommend, setClassRecommend] = useState([]);
  const [classDistance, setClassDistance] = useState([]);
  const [classRate, setClassRate] = useState([]);
  const [tab, setTab] = useState(0);
  const [textSearch, setTextSearch] = useState('');
  const [classBusy, setClassBusy] = useState(true);
  const [refreshing, setRefresh] = useState(false);
  const [scrollTop, setScrollTop] = useState(new Date().getTime());

  const [state, setState] = useReducer((prev, next) => ({
    ...prev, ...next
  }), {
    teachers: [],
    classes: [],
    loading: true,
  })
  const { loading, teachers} = state
  useEffect(() => {
    getTeachers();
    getClasses();
  }, []);

  const getClasses = async () => {
    try {
      const data = await getOtherDataClass();
      if (data) {
        setState({ classes: data });
      }
    } catch (error) {
    } finally {
      setState({ loading: false });
    }
  }

  function createRequest() {
    props.navigation.navigate('UserCreateRequest');
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
    //TODO: implement
  }
  async function getTeachers() {
    try {
      const data = await getTeacherSuggest();
      if (data) {
        setState({ teachers: data });
      }
    } catch (error) {
      console.log('get teacherSuggestDistance ==>', error);
    } finally {
      setState({ loading: false });
    }
  }

  const renderClassItem = ({item, index}) => {
    return (
        <TutorRequestItem
            data={item}
            onPress={() => {
              props.navigation.navigate('Calendar', {
                screen: 'DetailRequest',
                tutorRequest: item,
              })
            }}
        />
        )

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
      notScroll={loading}
      refreshing={refreshing}
      onRefresh={onRefresh}
      shouldScrollTop={scrollTop}
    >
      <StatusBar translucent
backgroundColor="transparent" />
      <ActionNotification navigation={props.navigation} />
      {tab === 0 ? (
        <View style={styles.marginContent}>
          <View style={styles.containerList}>
            <View style={styles.wrapTitle}>
              <Text style={Styles.title2RS}>DANH SÁCH GIA SƯ</Text>
            </View>
            <View>
              <SafeAreaView
                style={[styles.wrapList, {flexDirection: 'column'}]}
              >
                {!loading ? (
                  teachers.length ? (
                    <FlatList
                      horizontal={false}
                      showsHorizontalScrollIndicator={false}
                      data={teachers}
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
        </View>
      ) : null}
      {tab === 1 ? (
        <View style={styles.marginContent}>
          <FlatList data={state.classes} renderItem={renderClassItem} />
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
