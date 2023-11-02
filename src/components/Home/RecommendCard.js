import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {Text} from 'react-native-elements';
import PropTypes from 'prop-types';
import Toast from 'react-native-toast-message';
import FastImage from '../common/FastImage';
import BoxShadow from '../common/BoxShadow';
import Styles from '../../theme/MainStyles';
import RateStar from '../common/RateStar';
import BackgroundGradient from '../common/BackgroudGradient';
import Colors from '../../theme/Colors';
import {userFollow, userUnFollow} from '../../api/users';
import config from '../../../config/config';
import ConfigStyle from '../../theme/ConfigStyle';
import IconLike from '../../assets/images/svg/like.svg';
import IconLikeActive from '../../assets/images/svg/like-active.svg';

const width = Dimensions.get('window').width;

const RecommendCard = (props) => {
  const [favorite, setFavorite] = useState(false);

  async function handleFollow(id) {
    try {
      const response = await userFollow({guest: id});
      if (response) {
        setFavorite(true);
        props.onRefresh(false);
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
  useEffect(() => {
    setFavorite(props.data?.isFollow);
  }, [props.data]);

  async function handleDisFollow(id) {
    try {
      const response = await userUnFollow({guest: id});
      if (response) {
        setFavorite(false);
        props.onRefresh(false);
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
  return (
    <TouchableWithoutFeedback
      onPress={() =>
        props.navigation.navigate('DetailTutor', {_id: props.data?._id})
      }
    >
      <View>
        <BoxShadow
          style={
            props?.index === 0
              ? styles.wrapperLeft
              : props?.index + 1 === props?.length
              ? styles.wrapperRight
              : styles.wrapper
          }
        >
          <View style={styles.boxImage}>
            <FastImage
              source={{
                uri: props.data?.avatar,
              }}
              style={styles.image}
            />
            {favorite ? (
              <TouchableOpacity
                style={styles.wrapIconHeart}
                onPress={() => handleDisFollow(props.data?._id)}
              >
                <IconLikeActive width={20}
height={20} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.wrapIconHeart}
                onPress={() => handleFollow(props.data?._id)}
              >
                <IconLike width={20}
height={20} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.boxInfo}>
            <View style={styles.wrapTitle}>
              <Text
                numberOfLines={1}
                style={{...Styles.title4RS, ...Styles.textBold}}
              >
                {props.data?.fullName || ''}
              </Text>
            </View>
            <RateStar star={props.data?.rate || 0}
size={10} />
            <View>
              <Text numberOfLines={1}>
                {props.data?.subject?.map((item, index) => {
                  return (
                    <Text style={Styles.textGrey2}
key={index}>
                      {index < props.data?.subject?.length - 1
                        ? `${item.name}, `
                        : `${item.name}.`}
                    </Text>
                  );
                })}
              </Text>
            </View>
            <View>
              <Text
                numberOfLines={1}
                style={{
                  ...Styles.textGrey2,
                  ...styles.textLocation,
                }}
              >
                {props.data?.address}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('Calendar', {
                  screen: 'RequestManagement',
                  params: {
                    teacherId: props.data?._id,
                    fullName: props.data?.fullName,
                  },
                });
              }}
            >
              <BackgroundGradient style={styles.wrapBtn}>
                <Text style={[Styles.textWhite, styles.textBtn]}>Mời dạy</Text>
              </BackgroundGradient>
            </TouchableOpacity>
          </View>
        </BoxShadow>
      </View>
    </TouchableWithoutFeedback>
  );
};
RecommendCard.prototype = {
  user: PropTypes.object,
};
export default RecommendCard;

const styles = StyleSheet.create({
  wrapper: {
    width: 0.4 * width,
  },
  wrapperLeft: {
    width: 0.4 * width,
    marginLeft: 15,
  },
  wrapperRight: {
    width: 0.4 * width,
    marginRight: 15,
  },
  boxImage: {
    position: 'relative',
    zIndex: 95,
  },
  image: {
    width: '100%',
    height: 110,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 0.8,
    borderBottomColor: Colors.borderThin,
  },
  wrapIconHeart: {
    position: 'absolute',
    right: 5,
    top: 5,
    paddingHorizontal: 3,
    paddingVertical: 3,
  },
  wrapTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boxInfo: {
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 6,
  },
  price: {
    fontSize: 14,
    color: Colors.orange,
  },
  textLocation: {
    fontSize: 11,
  },
  wrapBtn: {
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    height: 20,
  },
  textBtn: {
    fontSize: 11,
  },
});
