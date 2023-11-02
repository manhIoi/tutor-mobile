import React from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';
import PropsTypes from 'prop-types';
import PropTypes from 'prop-types';
import ImagesUtil from '../../utils/images.util';
import {imageFormat} from './imageFormat';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const BackgroundImageTop = (props) => {
  return (
    <View style={styles.imgContainer}>
      <Image
        style={styles.bgImage}
        source={props?.imageSource ? props.imageSource : ImagesUtil.bgTop}
      />
      {props.children}
    </View>
  );
};
BackgroundImageTop.prototype = {
  imageSource: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
const styles = StyleSheet.create({
  imgContainer: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
  },
  bgImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 2,
    height: imageFormat(width, 1125, 557).height,
    width: width,
  },
});

export default BackgroundImageTop;
