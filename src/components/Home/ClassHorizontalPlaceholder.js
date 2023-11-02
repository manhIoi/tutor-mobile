import React, {useState} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-elements';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  ShineOverlay,
} from 'rn-placeholder';
import BoxShadow from '../common/BoxShadow';
import ImageUtil from '../../utils/images.util';
import Styles from '../../theme/MainStyles';
import RateStar from '../common/RateStar';
import BackgroundGradient from '../common/BackgroudGradient';
import Colors from '../../theme/Colors';
import config from '../../../config/config';
import {formatDate2} from '../../utils/string.util';
import IconHeart from '../../assets/images/svg/like.svg';
import IconHeartActive from '../../assets/images/svg/like-active.svg';

const ClassRoomHorizontal = (props) => {
  const [favorite, setFavorite] = useState(false);
  function formatDayWeek(arr) {
    const listDay = [];
    if (!Array.isArray(arr) || !arr.length) return '';
    arr?.map((item) => {
      if (item === 0) {
        listDay.push('CN');
      } else {
        listDay.push((item + 1).toString());
      }
    });
    listDay.sort();
    let str = 'Thứ ';
    if (listDay.length === 1 && listDay[0] === 'CN') {
      return 'Chủ nhật';
    }
    listDay.map((item, index) => {
      if (index + 1 === listDay.length) {
        str += item;
      } else {
        str += `-${item}`;
      }
    });
    return str;
  }

  function formatTime(time) {
    const date = new Date(time);
    const minute = date.getMinutes();
    return `${date.getHours()}h${
      minute !== 0 ? (minute < 10 ? `0${minute}` : minute) : ''
    }`;
  }
  function handleClickItem() {
    if (typeof props.hideModalSearch === 'function') {
      props.hideModalSearch();
    }
    props.navigation.navigate('DetailClass', {
      title: props.data?.title,
      _id: props.data?._id,
    });
  }
  return (
    <BoxShadow
      style={props.containerStyle ? props.containerStyle : styles.wrapper}
    >
      <Placeholder Animation={ShineOverlay}>
        <View style={styles.container}>
          <View style={styles.boxImage}>
            <PlaceholderMedia
              style={{
                position: 'relative',
                height: '100%',
                width: '100%',
              }}
            />
          </View>
          <View style={styles.boxInfo}>
            <View style={styles.wrapTitle}>
              <PlaceholderLine
                style={{
                  width: '30%',
                  height: 10,
                  marginBottom: 4,
                  backgroundColor: '#e2e1e1',
                }}
              />

              <PlaceholderLine
                style={{
                  width: '35%',
                  height: 11,
                  marginBottom: 4,
                }}
              />
            </View>
            <View style={styles.wrapTitle}>
              <PlaceholderLine
                style={{
                  width: '95%',
                  marginBottom: 2,
                  height: 13,
                  backgroundColor: '#d5d5d5',
                }}
              />
            </View>
            <View style={styles.wrapRating}>
              <PlaceholderLine
                style={{
                  width: '45%',
                  height: 10,
                  marginBottom: 1,
                  marginTop: 1,
                }}
              />
            </View>
            <View>
              <PlaceholderLine
                style={{
                  width: '75%',
                  height: 12,
                  marginBottom: 1,
                  marginTop: 1,
                  backgroundColor: '#eeeeee',
                }}
              />
            </View>
            <View>
              <PlaceholderLine
                style={{
                  width: '85%',
                  height: 12,
                  marginBottom: 1,
                  marginTop: 3,
                  backgroundColor: '#eeeeee',
                }}
              />
            </View>
            <View style={styles.wrapStartTime}>
              <PlaceholderLine
                style={{
                  width: '55%',
                  height: 12,
                  marginBottom: 1,
                  marginTop: 3,
                  backgroundColor: '#d2d1d1',
                }}
              />
            </View>
            <View style={[Styles.flexRow, styles.groupBtn]}>
              <PlaceholderLine
                style={{
                  width: '40%',
                  height: 12,
                  marginBottom: 1,
                  marginTop: 3,
                  backgroundColor: '#e2e0e0',
                }}
              />
              <View>
                <View style={styles.wrapBtn}>
                  <Text
                    style={{
                      ...Styles.textWhite,
                      ...styles.textBtn,
                    }}
                  >
                    Đăng ký
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Placeholder>
    </BoxShadow>
  );
};
export default ClassRoomHorizontal;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 18,
    width: '100%',
  },
  container: {
    flexDirection: 'row',
  },
  boxImage: {
    position: 'relative',
    // zIndex: 95,
    width: '45%',
    height: '100%',
  },
  boxInfo: {
    marginHorizontal: 13,
    marginBottom: 13,
    marginTop: 15,
    flex: 1,
  },
  wrapTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupBtn: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  wrapBtn: {
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    height: 20,
    backgroundColor: Colors.grey2,
  },
  textBtn: {
    fontSize: 11,
    paddingHorizontal: 12,
    paddingVertical: 4,
    color: Colors.grey2,
  },
  wrapRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  wrapStartTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
});
