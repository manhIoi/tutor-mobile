import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import PropsTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import ImageUtil from '../../utils/images.util';
import Star from '../../assets/images/svg/star.svg';
import StarGrey from '../../assets/images/svg/star-grey.svg';

const RateStar = (props) => {
  const [arrStar, setArrStar] = useState([]);
  useEffect(() => {
    formatStar(props.star);
  }, []);
  useEffect(() => {
    formatStar(props.star);
  }, [props.star]);
  function formatStar(number) {
    let star = Math.round(number);
    if (star < 0) {
      star = 0;
    }
    if (star > 5) {
      star = 5;
    }
    let i = 0;
    const arr = [];
    while (i < 5) {
      if (i < star) {
        arr.push(1);
      } else {
        arr.push(0);
      }
      i++;
    }
    setArrStar(arr);
  }
  return (
    <View style={styles.containerRate}>
      {arrStar.map((item, index) => {
        if (item === 1) {
          return (
            <View key={index}
style={styles.imageStar}>
              <Star width={props.size || 10}
height={props.size || 10} />
            </View>
          );
        }
        return (
          <View key={index}
style={styles.imageStar}>
            <StarGrey width={props.size || 10}
height={props.size || 10} />
          </View>
        );
      })}
    </View>
  );
};

RateStar.prototype = {
  size: PropsTypes.number,
  star: PropsTypes.number,
};
export default RateStar;

const styles = StyleSheet.create({
  containerRate: {
    flexDirection: 'row',
    minHeight: 10,
  },
  imageStar: {
    marginHorizontal: 0.5,
    width: 10,
    height: 10,
  },
});
