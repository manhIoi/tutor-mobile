import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';

import Colors from '../../../constants/Colors';
import ImgCustomize from './ImgCustomize';

const BtnIconText = (props) => {
  return (
    <TouchableOpacity onPress={() => props.handlePress && props.handlePress()}>
      <LinearGradient
        start={{x: 1, y: 0}}
        end={{x: 0, y: 0}}
        colors={['#ffb02c', '#ff982c', '#ff802c']}
        style={styles.viewWrap}
      >
        <View style={styles.viewImg}>
          <ImgCustomize
            imgWidth={props.imgWidth}
            imgHeight={props.imgHeight}
            imgSource={props.imgSource}
          />
        </View>
        <Text style={[styles.text, {fontSize: props.fntSize}]}>
          {props.title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  viewWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 292,
    height: 49,
    marginTop: 20,
    borderRadius: 40,
  },
  viewImg: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
    left: 20,
  },
  text: {
    color: Colors.whiteColor,
  },
});

BtnIconText.propTypes = {
  handlePress: PropTypes.func,
  imgWidth: PropTypes.number.isRequired,
  imgHeight: PropTypes.number.isRequired,
  imgSource: PropTypes.number.isRequired,
  fntSize: PropTypes.number,
};

export default BtnIconText;
