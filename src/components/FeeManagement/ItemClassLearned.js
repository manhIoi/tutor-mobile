import React, {useState} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-elements';
import BoxShadow from '../common/BoxShadow';
import ImageUtil from '../../utils/images.util';
import Styles from '../../theme/MainStyles';
import RateStar from '../common/RateStar';
import BackgroundGradient from '../common/BackgroudGradient';
import Colors from '../../theme/Colors';

export default function ItemClassLearned(props) {
  const [favorite, setFavorite] = useState(false);
  return (
    <BoxShadow
      style={props.containerStyle ? props.containerStyle : styles.wrapper}
    >
      <TouchableOpacity
        onPress={() => props.navigation.navigate('FeeManagement')}
      >
        <View style={styles.container}>
          <View style={styles.boxImage}>
            <FastImage source={ImageUtil.imageProfile1}
style={styles.image} />
            {favorite ? (
              <TouchableOpacity
                style={styles.wrapIconHeart}
                onPress={() => setFavorite(false)}
              >
                <Image source={ImageUtil.iconHeart}
style={styles.iconHeart} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.wrapIconHeart}
                onPress={() => setFavorite(true)}
              >
                <Image
                  source={ImageUtil.iconHeartEmpty}
                  style={styles.iconHeart}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.boxInfo}>
            <View style={styles.wrapTitle}>
              <View style={styles.wrapStatus}>
                <View
                  style={[
                    styles.point,
                    {
                      backgroundColor: props.online
                        ? Colors.green
                        : Colors.greyBold,
                    },
                  ]}
                ></View>
                <Text
                  style={[
                    styles.textStatus,
                    {color: props.online ? Colors.green : Colors.greyBold},
                  ]}
                >
                  {props.online ? 'Online' : 'Offline'}
                </Text>
              </View>
              <View style={styles.wrapLocation}>
                <Image
                  source={ImageUtil.iconLocation}
                  style={styles.iconLocation}
                />
                <Text style={Styles.textGrey}>0.2 km</Text>
              </View>
            </View>
            <View style={styles.wrapTitle}>
              <Text
                numberOfLines={1}
                style={{...Styles.title4RS, ...Styles.textBold}}
              >
                Photoshop căn bản
              </Text>
            </View>
            <View style={styles.wrapRating}>
              <RateStar star={4}
size={10} />
              <Text style={styles.textRating}>(49/100)</Text>
            </View>
            <View>
              <Text style={[Styles.textGrey, styles.textGrey]}>
                Lịch học : thứ 2-4-6
              </Text>
            </View>
            <View>
              <Text style={[Styles.textGrey, styles.textGrey]}>
                Giờ học: 7h30 - 9h
              </Text>
            </View>
            <View style={styles.wrapStartTime}>
              <Text
                numberOfLines={1}
                style={[Styles.textGrey, styles.timeStart, Styles.textBold]}
              >
                Bắt đầu: {'12/01/20'}
              </Text>
            </View>
            <View style={[Styles.flexRow, styles.groupBtn]}>
              <Text style={[styles.price]}>200$/h</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </BoxShadow>
  );
}
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
  image: {
    width: '100%',
    flex: 1,
    borderBottomLeftRadius: 12,
    borderTopLeftRadius: 12,
  },
  iconHeart: {
    width: 20,
    height: 20,
  },
  wrapIconHeart: {
    position: 'absolute',
    right: 8,
    top: 8,
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
  wrapLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLocation: {
    width: 8.5,
    height: 12,
    marginRight: 3.5,
  },
  iconCake: {
    width: 8,
    height: 12,
    marginRight: 2.5,
  },
  wrapBirth: {
    alignItems: 'center',
  },
  groupBtn: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 14,
    color: Colors.orange,
  },
  textBtn: {
    fontSize: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  point: {
    width: 5,
    height: 5,
    borderRadius: 5,
    marginRight: 2.3,
  },
  wrapStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  textRating: {
    color: Colors.greyText,
    fontSize: 10,
    marginLeft: 5,
  },
  textGrey: {
    color: '#A1A1A1',
  },
  textStatus: {
    fontSize: 10,
  },
  wrapStartTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  timeStart: {
    fontSize: 11,
    marginTop: 2,
  },
});
