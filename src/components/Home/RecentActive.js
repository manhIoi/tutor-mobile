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
import BackgroundGradient from '../common/BackgroudGradient';
import {getListTeacherOnline} from '../../api/users';
import config from '../../../config/config';
import Colors from '../../theme/Colors';

const window = Dimensions.get('window').width;
const RenderList = (props) => {
  const [teacherOnline, setTeacherOnline] = useState([]);
  const [countCol, setCountCol] = useState([]);
  const [isBusy, setBusy] = useState(true);
  useEffect(() => {
    fetchOnlineTeacher();
  }, [props?.refreshing]);
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
  return (
    <View style={styles.container}>
      <View style={styles.wrapTitle}>
        <Text style={Styles.title2RS}>HOẠT ĐỘNG GẦN ĐÂY</Text>
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
  const user = {
    fullName: 'Ngô Minh Nhí',
    star: 5,
    category: 'Adobe XD',
    online: true,
  };
  const contentRight = (item) => (
    <TouchableOpacity
      onPress={() => {
        props.navigation.navigate('Chat', {
          screen: 'InboxChat',
          params: {
            to: item?._id,
            userReceive: {
              avatar: item.avatar,
              online: item.isOnline,
              fullName: item?.fullName,
            },
          },
        });
      }}
    >
      <BackgroundGradient style={{...Styles.wrapBtn, height: 24}}>
        <Text style={[Styles.textWhite, styles.textBtn]}>Liên hệ</Text>
      </BackgroundGradient>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.wrapColItems}>
      {props.data.map((item, index) => {
        return item ? (
          <AvatarInfo
            key={index}
            source={item?.avatar?.small}
            size={72}
            showStatus={true}
            data={{...item}}
            showStar={true}
            content={user.category}
            contentRight={contentRight(item)}
            containerStyle={styles.containerStyle}
            titleStyle={Styles.textBold}
            onLeftPress={() =>
              props.navigation.navigate('DetailTutor', {_id: item?._id})
            }
          />
        ) : null;
      })}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginTop: 22,
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
  textBtn: {
    fontSize: 12,
    paddingHorizontal: 17,
    paddingVertical: 6,
  },
  wrapColItems: {
    width: 0.87 * window,
  },
  containerStyle: {
    width: '100%',
    paddingRight: 20,
  },
});
