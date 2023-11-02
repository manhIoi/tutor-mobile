import React from 'react';
import {View, Image, Text} from 'react-native';
import PropTypes from 'prop-types';
import imagesUtil from '../../utils/images.util';

const ImgCustomize = (props) => {
  return (
    <Image
      style={[
        props.style,
        {
          width: props.imgWidth,
          height: props.imgHeight,
        },
      ]}
      source={props.imgSource || imagesUtil.noImage}
    />
  );
};

ImgCustomize.propTypes = {
  imgWidth: PropTypes.number.isRequired,
  imgHeight: PropTypes.number.isRequired,
  imgSource: PropTypes.number.isRequired,
};

export default ImgCustomize;
