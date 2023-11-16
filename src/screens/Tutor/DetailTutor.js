import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Text} from 'react-native-elements';
import Toast from 'react-native-toast-message';
import {useFocusEffect} from '@react-navigation/native';
import ConfigStyle from '../../theme/ConfigStyle';
import Container from '../../components/common/ContainerAnimated';
import DetailInfo from '../../components/Tutor/DetailInfo';
import Styles from '../../theme/MainStyles';
import ListTopics from '../../components/Tutor/ListTopic';
import ClassRoomHorizontal from '../../components/Home/ClassRoomHorizontal';
import ReviewList from '../../components/Tutor/ReviewList';
import CreateReview from '../../components/Tutor/CreateReview';
import BoxShadow from '../../components/common/BoxShadow';
import BackgroundGradient from '../../components/common/BackgroudGradient';
import Loading from '../../components/common/Loading';
import Colors from '../../theme/Colors';
import ImageUtils from '../../utils/images.util';
import {
  getReviewByClass,
  getReviewByTeacher,
  getTeacherById,
  userFollow,
  userUnFollow,
} from '../../api/users';
import {getClassByTeacher} from '../../api/class';

const INIT_REVIEWS = {
  data: [],
  totalItems: 0,
  currentPage: 1,
};
const DetailTutor = (props) => {
  const {teacher} = props.route.params
  const [classBusy, setClassBusy] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loadReview, setLoadReview] = useState(true);
  const [reviews, setReviews] = useState(INIT_REVIEWS);
  const [favorite, setFavorite] = useState(false);
  const [refreshing, setRefresh] = useState(false);

  useEffect(() => {
    setFavorite(teacher?.statusIsFollow);
  }, [teacher]);

  async function fetchData(id) {
    const promise = [getTeacherData(id), getClasses(id), getListReview(id)];
    await Promise.all(promise);
  }
  function reloadReview() {
    getListReview(teacher?._id, 1, 5, '', true);
  }

  async function getListReview(id, page = 1, limit = 4, refresh = false) {
    try {
      if (!refresh) {
        setLoadReview(true);
      }
      const response = await getReviewByTeacher(id, page, limit);
      console.log('getReviewByTeacher');
      console.log(response);
      setLoadReview(false);
      setReviews({
        data: response?.payload || [],
        currentPage: response?.page,
        totalItems: response?.total_item || 0,
      });
    } catch (error) {
      console.log('getListReview ==>', error);
    }
  }
  async function onRefresh(showLoading = true) {
    // if (showLoading) {
    //   setRefresh(true);
    // }
    // getClasses(props.route.params._id, 1, 4, true);
  }
  async function handleFollow() {
    try {
      const response = await userFollow({guest: teacher._id});
      if (response) {
        setFavorite(true);
      }
    } catch (error) {
      if (error?.response?.data?.errors) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'error',
          text1:
            error?.response?.data?.errors[0].message ||
            error?.response?.data?.errors[0].param,
        });
      } else {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'error',
          text1: 'Lỗi máy chủ',
        });
      }
      console.log('handleFollow =>>', error);
    }
  }

  async function handleDisFollow() {
    try {
      const response = await userUnFollow({guest: teacher._id});
      if (response) {
        setFavorite(false);
      }
    } catch (error) {
      if (error?.response?.data?.errors) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'error',
          text1:
            error?.response?.data?.errors[0].message ||
            error?.response?.data?.errors[0].param,
        });
      } else {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'error',
          text1: 'Lỗi máy chủ',
        });
      }
      console.log('handleDisFollow =>>', error);
    }
  }

  const footer = (
    <BoxShadow style={styles.wrapFooter}>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('UserCreateRequest', {
            teacher
          });
        }}
        style={[styles.wrapBtn, styles.wrapBtnInvited]}
      >
        <Text style={[styles.textBtn, styles.textInvited]}>TẠO YÊU CẦU</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('Chat', {
            screen: 'InboxChat',
            params: {
              to: teacher?._id,
              userReceive: {
                _id: teacher?._id,
                avatar: teacher.avatar,
                online: teacher.isOnline,
                fullName: teacher?.fullName,
              },
            },
          });
        }}
        style={{flex: 1}}
      >
        <BackgroundGradient style={styles.wrapBtn}>
          <Text style={[Styles.textWhite, styles.textBtn]}>CHAT</Text>
        </BackgroundGradient>
      </TouchableOpacity>
    </BoxShadow>
  );
  console.log(classes);
  return (
    <Container
      title={'Hồ sơ gia sư'}
      arrowBack={true}
      contentBarStyles={{justifyContent: 'space-between'}}
      navigation={props.navigation}
      headerHeight={ConfigStyle.statusBarHeight}
      hideBackground={false}
      keyboardShouldPersistTaps={true}
      footer={footer}
      imageSource={ImageUtils.bgNotDot}
    >
      <View style={styles.container}>
        <View>
          <DetailInfo
              favorite={favorite}
              activeFollow={favorite ? handleDisFollow : handleFollow}
              data={teacher}
          />
          <View style={styles.containerList}>
            <View style={styles.wrapTitle}>
              <Text
                  style={{
                    ...Styles.title2RS,
                    ...Styles.textNormal,
                    marginLeft: 5,
                  }}
              >
                Danh sách lớp đang mở
              </Text>
              <TouchableOpacity
                  // onPress={props.viewMoreAction ? props.viewMoreAction : null}
              >
                {classes?.length > 4 ? (
                    <Text style={styles.viewAll}>Xem tất cả</Text>
                ) : null}
              </TouchableOpacity>
            </View>
            <View>
              {!classBusy ? (
                  classes?.length ? (
                      <SafeAreaView style={styles.wrapList}>
                        <FlatList
                            data={classes}
                            renderItem={({item, index}) => (
                                <ClassRoomHorizontal
                                    onRefresh={onRefresh}
                                    data={item}
                                    containerStyle={{flex: 1, marginBottom: 10}}
                                    navigation={props.navigation}
                                    isFollow={classes?.isFollow}
                                />
                            )}
                            keyExtractor={(item) => item._id}
                        />
                      </SafeAreaView>
                  ) : (
                      <View
                          style={{
                            ...Styles.flexRowCenter,
                            marginVertical: 10,
                            marginBottom: 0,
                          }}
                      >
                        <Text style={{fontStyle: 'italic'}}>
                          Không có dữ liệu
                        </Text>
                      </View>
                  )
              ) : (
                  <View style={{...Styles.flexRowCenter, marginTop: 15}}>
                    <ActivityIndicator color={Colors.orange} />
                  </View>
              )}
            </View>
          </View>
          {/*<ListTopics data={teacher?.topic} />*/}
        </View>
      </View>
    </Container>
  );
};

export default DetailTutor;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    flex: 1,
  },
  containerList: {
    marginTop: 22,
  },
  wrapTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  wrapList: {
    marginTop: 10,
    flexDirection: 'row',
  },
  viewAll: {
    zIndex: 99,
    fontSize: ConfigStyle.RF.text6,
    paddingVertical: 5,
    paddingHorizontal: 3,
  },
  wrapFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 0,
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    borderBottomWidth: 0,
    paddingVertical: 9,
    marginTop: 1,
  },
  textBtn: {
    fontSize: 14,
  },
  wrapBtn: {
    paddingVertical: 3,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapBtnInvited: {
    borderWidth: 1,
    borderColor: Colors.orange2,
    paddingVertical: 4,
  },
  textInvited: {
    color: Colors.orange2,
  },
});
