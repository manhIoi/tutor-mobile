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
import { Text } from 'react-native-elements';
import { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import Container from '../../components/common/Container';
import StatusBarHome from '../../components/common/StatusBarHome';
import ProfileHorizontal from '../../components/Home/ProfileHorizontal';
import AddButton from '../../components/common/AddButton';
import ProfilePlaceholder from '../../components/Home/ProfilePlacceholder';
import ActionNotification from '../../components/Home/ActionNotification';
import ConfigStyle from '../../theme/ConfigStyle';
import Styles from '../../theme/MainStyles';
import {
  getTeacherSuggest,
} from '../../api/users';
import IconEmpty from '../../assets/images/svg/empty-list.svg';
import TutorRequestItem from "../../components/RequestManagement/TutorRequestItem";
import { getSubjects } from "../../api/subject";
import { setSubjectsValue } from "../../lib/slices/subjectSlice";
import { getNotificationList, syncAll, syncAllAsync } from "../../helper/main";
import { hideLoadingModal, showLoadingModal } from '../../lib/slices/modalSlice';

export default function HomeScreen(props) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user)
  const mainState = useSelector(state => state.main)
  const [tab, setTab] = useState(0);
  const [textSearch, setTextSearch] = useState('');
  const [refreshing, setRefresh] = useState(false);
  const [scrollTop, setScrollTop] = useState(new Date().getTime());
  const [loading, setLoading] = useState(true)

  const { teacherList: teachers, tutorRequestList: classes } = mainState || {}
  useEffect(() => {
    if (user?._id) {
      dispatch(showLoadingModal())
      syncData().then(() => {
        setTimeout(() => {
          setLoading(false)
          dispatch(hideLoadingModal())
        }, 2000)
      });
      getListSubject();
    }
  }, [user?._id]);

  const syncData = () => {
    return new Promise((resolve) => {
      getNotificationList(dispatch, user);
      syncAllAsync(dispatch, user).then(() => {
        setLoading(false)

      }).finally(() => {
        resolve()
      })
    })
  }

  const getListSubject = async () => {
    const subjects = await getSubjects();
    dispatch(setSubjectsValue(subjects))
  }

  function createRequest() {
    props.navigation.navigate('UserCreateRequest');
  }
  function changeTab(value) {
    setScrollTop(new Date().getTime());
    setTab(value);
  }
  function onSearch(event) {
    const { text } = event.nativeEvent;
    setTextSearch(text);
  }
  async function onRefresh(showLoading = true) {
    syncAllAsync(dispatch, user);
  }

  const renderClassItem = ({ item, index }) => {
    return (
      <TutorRequestItem
        data={item}
        onPress={() => {
          props.navigation.navigate('Calendar', {
            screen: 'DetailRequest',
            params: {
              tutorRequest: item,
            }
          })
        }}
      />
    )

  }

  return (
    <Container
      footer={user?.role === 'student' ? <AddButton onPress={createRequest} /> : null}
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
                style={[styles.wrapList, { flexDirection: 'column' }]}
              >
                {!loading ? (
                  teachers.length ? (
                    <FlatList
                      horizontal={false}
                      showsHorizontalScrollIndicator={false}
                      data={teachers}
                      renderItem={({ item }) => (
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
                    renderItem={({ item }) => <ProfilePlaceholder />}
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
          <FlatList data={classes} renderItem={renderClassItem} />
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
