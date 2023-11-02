import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

const BackgroundImage = (props) => {
  return (
    <View style={style.imgContainer}>
      <Image style={style.bgImage}
source={props.imgSource} />
      {props.children}
    </View>
  );
};

const style = StyleSheet.create({
  imgContainer: {
    flex: 1,
  },
  bgImage: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    zIndex: 0,
    resizeMode: 'cover',
    height: 174,
    width: '100%',
  },
});

export default BackgroundImage;
