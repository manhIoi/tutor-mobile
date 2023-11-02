import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import {Text} from 'react-native-elements';
import Toast from 'react-native-toast-message';
import FastImage from '../common/FastImage';
import BoxShadow from '../common/BoxShadow';
import Styles from '../../theme/MainStyles';
import RateStar from '../common/RateStar';
import BackgroundGradient from '../common/BackgroudGradient';
import Colors from '../../theme/Colors';
import IconCake from '../../assets/images/svg/cake-pop.svg';
import IconLocation from '../../assets/images/svg/maps-and-flags.svg';
import config from '../../../config/config';
import IconHeart from '../../assets/images/svg/like.svg';
import IconHeartActive from '../../assets/images/svg/like-active.svg';
import {userFollow, userUnFollow} from '../../api/users';
import ConfigStyle from '../../theme/ConfigStyle';
import ImageUtil from '../../utils/images.util';
import CustomActionSheet from '../common/CustomActionSheet';
import {userInviteTeacher} from '../../api/class';

const ProfileHorizontal = (props) => {
  const [favorite, setFavorite] = useState(false);
  const [showPick, setShowPick] = useState(false);
  const [isBusy, setBusy] = useState(false);
  function handleCLickItem() {
    props.navigation.navigate('DetailTutor', {_id: props?.data?._id});
    if (typeof props.hideModalSearch === 'function') {
      props.hideModalSearch();
    }
  }
  async function handleFollow(id) {
    try {
      console.log(id);
      const response = await userFollow({guest: id});
      if (response) {
        // set status follow
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
    setFavorite(props.data?.isFollow || props.data?.statusIsFollow);
  }, [props.data]);

  async function handleDisFollow(id) {
    try {
      console.log(id);
      const response = await userUnFollow({guest: id});
      if (response) {
        // set status follow
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

  function inviteTeacherToClass() {
    if (props.classId) {
      setShowPick(true);
      setTimeout(() => {
        setShowPick(false);
      }, 150);
    }
  }

  async function inviteTeacher() {
    try {
      setBusy(true);
      const data = {
        teacherId: props.data?.teacherId || props.data?._id,
        classId: props.classId,
      };
      const response = await userInviteTeacher(data);
      setBusy(false);
      // props.onRefresh(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'success',
        text1: 'Mời dạy lớp học thành công',
      });
      props?.onRefresh(false);
    } catch (error) {
      setBusy(false);
      console.log('handleInvite => ', error);
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
    }
  }

  function handleActionSheetOnPress(index) {
    if (index === 0) {
      inviteTeacher();
    }
  }
  return (
    <TouchableWithoutFeedback onPress={handleCLickItem}>
      <View>
        <BoxShadow style={{...styles.wrapper, ...props.containerStyle}}>
          <View style={styles.container}>
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
                  <IconHeartActive width={20}
height={20} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.wrapIconHeart}
                  onPress={() => handleFollow(props.data?._id)}
                >
                  <IconHeart width={20}
height={20} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.boxInfo}>
              <View style={{...styles.wrapTitle, flex: 5}}>
                <Text
                  numberOfLines={1}
                  style={{...Styles.title4RS, ...Styles.textBold, flex: 3}}
                >
                  {props.data?.fullName}
                </Text>
                <View style={{...styles.wrapLocation, flex: 2}}>
                  {props.data?.dist?.distance !== undefined ||
                  (props.data?.distance !== undefined &&
                    (props.data?.dist?.distance !== null ||
                      props.data?.distance !== null)) ? (
                    <IconLocation width={8.5}
height={12} />
                  ) : null}

                  <Text style={{...Styles.textGrey, marginLeft: 5}}>
                    {`${props.data?.distance || 0}km`}
                  </Text>
                </View>
              </View>
              <RateStar star={props.data?.rate || 0}
size={10} />
              <View style={[Styles.flexRow, styles.wrapBirth]}>
                <IconCake width={8}
height={12} />
                <Text style={{...Styles.textGrey2, ...styles.textBirth}}>
                  {props.data?.dob}
                </Text>
              </View>
              <View>
                <Text numberOfLines={1}>
                  {props.data?.subject?.map((item, index) => {
                    return (
                      <Text style={Styles.textGrey2}
key={index}>
                        {index < props.data.subject.length - 1
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
                  style={[Styles.textGrey2, styles.textLocation]}
                >
                  {props.data?.address}
                </Text>
              </View>
              <View style={[Styles.flexRow, styles.groupBtn]}>
                <TouchableOpacity
                  onPress={() => {
                    if (props.classId) {
                      inviteTeacherToClass();
                    } else {
                      props.navigation.navigate('Calendar', {
                        screen: 'RequestManagement',
                        params: {
                          teacherId: props.data?._id,
                          fullName: props.data?.fullName,
                        },
                      });
                    }
                  }}
                >
                  <BackgroundGradient style={styles.wrapBtn}>
                    <Text style={[Styles.textWhite, styles.textBtn]}>
                      Mời dạy
                    </Text>
                  </BackgroundGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </BoxShadow>
        <CustomActionSheet
          title={'Mời dạy lớp'}
          message={`Mời giáo viên ${props?.data?.fullName} dạy lớp ${props.className}`}
          arrayActions={['Xác nhận', 'Hủy']}
          actionSheetOnPress={handleActionSheetOnPress}
          shouldShow={showPick}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
export default ProfileHorizontal;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 18,
  },
  container: {
    flexDirection: 'row',
  },
  boxImage: {
    position: 'relative',
    height: '100%',
    flex: 45,
  },
  image: {
    width: '100%',
    flex: 1,
    borderBottomLeftRadius: 12,
    borderTopLeftRadius: 12,
    borderRightWidth: 0.8,
    borderRightColor: Colors.borderThin,
  },
  wrapIconHeart: {
    position: 'absolute',
    right: 5,
    top: 5,
    paddingHorizontal: 3,
    paddingVertical: 3,
  },
  boxInfo: {
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 6,
    flex: 55,
  },
  textBirth: {
    marginLeft: 5,
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
  wrapBirth: {
    alignItems: 'center',
    marginVertical: 2,
  },
  groupBtn: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 14,
    color: Colors.orange,
  },
  wrapBtn: {
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    height: 20,
  },
  textBtn: {
    fontSize: 11,
    paddingHorizontal: 18,
    paddingVertical: 4,
  },
  textLocation: {
    fontSize: 12,
  },
});
