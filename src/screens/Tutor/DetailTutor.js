import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Image
} from 'react-native';
import { Text } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
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
  getVoteByTeacher
} from '../../api/users';
import VoteItem from "../../components/common/VoteItem";
import { useSelector } from "react-redux";

const INIT_REVIEWS = {
  data: [],
  totalItems: 0,
  currentPage: 1,
};

const EmptyComponent = () => {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
      <Text style={{ fontStyle: 'italic' }}>
        Không có dữ liệu
      </Text>
    </View>

  )
}

const DetailTutor = (props) => {
  const { teacher } = props.route.params;
  const user = useSelector(state => state?.auth?.user);
  const [voteList, setVoteList] = useState([]);

  useEffect(() => {
    getVoteList()
  }, [teacher]);

  const getVoteList = async () => {
    try {
      const response = await getVoteByTeacher(teacher?._id);
      setVoteList(response);
    } catch (e) {
      console.info(`LOG_IT:: getVoteList e`, e);
    }
  }

  async function onRefresh(showLoading = true) {
    getVoteList();
  }

  const footer = user?.role === 'student' ? (
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
              userReceive: teacher,
            },
          });
        }}
        style={{ flex: 1 }}
      >
        <BackgroundGradient style={styles.wrapBtn}>
          <Text style={[Styles.textWhite, styles.textBtn]}>CHAT</Text>
        </BackgroundGradient>
      </TouchableOpacity>
    </BoxShadow>
  ) : null;

  const renderVoteItem = ({ item, index }) => {
    return (
      <View style={{ marginBottom: 8 }} >
        <BoxShadow>
          <VoteItem vote={item} />
        </BoxShadow>
      </View>

    )
  }

  return (
    <Container
      title={'Hồ sơ gia sư'}
      arrowBack={true}
      contentBarStyles={{ justifyContent: 'space-between' }}
      navigation={props.navigation}
      headerHeight={ConfigStyle.statusBarHeight}
      hideBackground={false}
      keyboardShouldPersistTaps={true}
      footer={footer}
      imageSource={ImageUtils.bgNotDot}
    >
      <View style={{ marginHorizontal: 15, }} >
        <BoxShadow>
          <View style={styles.container}>
            <View>
              <DetailInfo data={teacher} />
              <View style={styles.containerList}>
                <View>
                  <Text
                    style={{
                      ...Styles.title2RS,
                      ...Styles.textNormal,
                      marginLeft: 5,
                      color: Colors.orange2,
                      fontWeight: "bold",
                    }}
                  >
                    Đánh giá giáo viên
                  </Text>
                  <FlatList data={voteList} renderItem={renderVoteItem} keyExtractor={(item) => `vote_${item?._id}`} ListEmptyComponent={EmptyComponent} />
                </View>
              </View>
            </View>
          </View>
        </BoxShadow>
      </View>
    </Container>
  );
};

export default DetailTutor;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
    borderRadius: 4,
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
