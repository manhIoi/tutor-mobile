import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';

const BottomImgCustomize = (props) => {
  return (
    <View style={styles.bottom}>
      <Image
        source={props.imgSource}
        style={[styles.botImage, {height: props.imgHeight}]}
      />
      {props.title && (
        <View style={styles.bottomText}>
          <Text style={styles.title4}>{props.title}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  botImage: {
    // resizeMode: 'cover',
    width: '100%',
  },
  bottom: {
    position: 'relative',
    marginTop: 20,
    zIndex: -1,
  },
  title4: {
    fontSize: ConfigStyle.title4,
    color: Colors.whiteColor,
    textAlign: 'center',
  },
  bottomText: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
  },
});

BottomImgCustomize.propTypes = {
  imgHeight: PropTypes.number.isRequired,
  imgSource: PropTypes.number.isRequired,
  title: PropTypes.string,
};

export default BottomImgCustomize;
