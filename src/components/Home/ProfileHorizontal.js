import React, {useEffect, useMemo, useState} from 'react';
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
import IconLocation from '../../assets/images/svg/location.svg';
import IconBook from '../../assets/images/svg/open-magazine.svg';

import config from '../../../config/config';
import IconHeart from '../../assets/images/svg/like.svg';
import IconHeartActive from '../../assets/images/svg/like-active.svg';
import {userFollow, userUnFollow} from '../../api/users';
import ConfigStyle from '../../theme/ConfigStyle';
import ImageUtil from '../../utils/images.util';
import CustomActionSheet from '../common/CustomActionSheet';
import {userInviteTeacher} from '../../api/class';

const ProfileHorizontal = (props) => {

  const subjectName = useMemo(() => {
    const names = props.data.subjects.map(i => i.name);
    return names.join(', ')
  }, [props.data.subjects])
  function handleCLickItem() {
    props.navigation.navigate('DetailTutor', {teacher: props.data });
    if (typeof props.hideModalSearch === 'function') {
      props.hideModalSearch();
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
                  uri: props.data?.avatar || `https://ui-avatars.com/api/?background=random&name=${props?.data?.fullName}`,
                }}
                style={styles.image}
              />
            </View>
            <View style={styles.boxInfo}>
              <View style={{...styles.wrapTitle, flex: 5}}>
                <Text
                  numberOfLines={1}
                  style={{...Styles.title4RS, ...Styles.textBold, flex: 3}}
                >
                  {props.data?.fullName}
                </Text>
              </View>
              <RateStar activeValue={Math.round(props?.data?.voteValue)} numberOfVotes={props?.data?.votes?.length}  size={10} />
              <View style={[Styles.flexRow, styles.wrapBirth]}>
                <IconCake width={8}
height={12} />
                <Text style={{...Styles.textGrey2, ...styles.textBirth}}>
                  {props.data?.dob}
                </Text>
              </View>
              <View style={[Styles.flexRow, styles.wrapBirth]} >
                <IconLocation width={10}
                              height={14} />
                <Text
                    numberOfLines={1}
                    style={[Styles.textGrey2, styles.textLocation]}
                >
                  {props.data?.address}
                </Text>
              </View>
              <View style={[Styles.flexRow, styles.wrapBirth]}>
                <IconBook width={10}
                              height={14} />
                <Text numberOfLines={1} style={{...Styles.textGrey2, ...styles.textBirth}}>
                  {subjectName}
                </Text>
              </View>
            </View>
          </View>
        </BoxShadow>
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
