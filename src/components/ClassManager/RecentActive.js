import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {Text} from 'react-native-elements';
import PropsTypes from 'prop-types';
import Styles from '../../theme/MainStyles';
import AvatarInfo from '../common/AvatarInfo';
import ImageUtil from '../../utils/images.util';
import BackgroundGradient from '../common/BackgroudGradient';
import {getListTeacherOnline} from '../../api/users';
import {userGetTeacherOfRequest, teacherGetStudent} from '../../api/class';
import config from '../../../config/config';
import Colors from '../../theme/Colors';

const window = Dimensions.get('window').width;
const RenderList = (props) => {
  const [teacherOnline, setTeacherOnline] = useState([]);
  const [countCol, setCountCol] = useState([]);
  const [isBusy, setBusy] = useState(true);
  useEffect(() => {
    props?.listStudent ? getStudent(props?.id) : fetchOnlineTeacher();
  }, []);
  async function fetchOnlineTeacher(page = 1, limit = 6, loadMore = false) {
    try {
      setBusy(true);
      const response = await getListTeacherOnline(page, limit);
      setBusy(false);
      setTeacherOnline(response);
      let i = 0;
      const count = [];
      while (i < Math.ceil(response.length / 3)) {
        count.push(i);
        i += 1;
      }
      setCountCol(count);
    } catch (error) {
      console.log('fetchOnlineTeacher ==>', error);
    }
  }

  async function getStudent(id, limit = 10, page = 1, loadMore = false) {
    try {
      setBusy(true);
      const response = await teacherGetStudent(id, limit, page);
      setBusy(false);
      setTeacherOnline(response?.payload);
      let i = 0;
      const count = [];
      while (i < Math.ceil(response?.payload.length / 3)) {
        count.push(i);
        i += 1;
      }
      setCountCol(count);
    } catch (error) {
      console.log('fetchOnlineTeacher ==>', error);
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.wrapTitle}>
        <Text style={{...Styles.title2RS, justifyContent: 'center'}}>
          {props.title}
        </Text>
        {teacherOnline?.length >= 2 ? (
          <TouchableOpacity
            onPress={() => {
              props?.listStudent
                ? props.navigation?.navigate('StudentClass', {
                    id: props?.id,
                    title: props?.titleClass,
                  })
                : null;
            }}
          >
            <Text
              style={{
                color: '#333333',
                fontSize: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              Xem tất cả
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View>
        <SafeAreaView style={styles.wrapList}>
          {!isBusy ? (
            teacherOnline.length ? (
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={countCol}
                renderItem={({item, index}) => (
                  <ColItems
                    data={[
                      teacherOnline[index * 3],
                      teacherOnline[index * 3 + 1],
                      teacherOnline[index * 3 + 2],
                    ]}
                    navigation={props.navigation}
                  />
                )}
                keyExtractor={(item) => item.toString()}
              />
            ) : (
              <View style={[Styles.flexRowCenter, {flex: 1}]}>
                <Text style={Styles.textBlack3}>Không có dữ liệu</Text>
              </View>
            )
          ) : (
            <View style={[Styles.flexRowCenter, {flex: 1}]}>
              <ActivityIndicator color={Colors.orange} />
            </View>
          )}
        </SafeAreaView>
      </View>
    </View>
  );
};

RenderList.prototype = {
  title: PropsTypes.string,
  viewMore: PropsTypes.bool,
  viewMoreAction: PropsTypes.func,
  data: PropsTypes.array,
  type: PropsTypes.string, // enum: ['horizontal', 'vertical']
};
export default RenderList;

const ColItems = (props) => {
  return (
    <SafeAreaView style={styles.wrapColItems}>
      {props.data.map((item, index) => {
        let avatar = '';
        if (typeof item?.avatar === 'string') {
          avatar = config.IMAGE_SM_URL + JSON.parse(item?.avatar)?.small;
        }
        return item ? (
          <AvatarInfo
            key={index}
            source={
              item?.user?.avatar?.small ||
              avatar ||
              config.IMAGE_SM_URL + item?.teacherInfo?.avatar?.small ||
              config.IMAGE_SM_URL + item?.avatar?.small
            }
            size={48}
            phone={null}
            showStatus={false}
            data={item?.user || item?.teacherInfo || item}
            showStar={false}
            content={item?.isPayment ? 'Đã thanh toán' : 'Chưa thanh toán'}
            containerStyle={styles.containerStyle}
            titleStyle={Styles.textBold}
            onLeftPress={() =>
              props.navigation.navigate('DetailTutor', {
                _id: item?.teacherInfo?.teacherId || item?.teacherId,
              })
            }
          />
        ) : null;
      })}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    marginTop: 22,
  },
  wrapTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapList: {
    marginTop: 20,
    flexDirection: 'row',
  },
  textBtn: {
    fontSize: 12,
    paddingHorizontal: 17,
    paddingVertical: 6,
  },
  wrapColItems: {
    width: 0.5 * window,
  },
});
