import React, {useEffect} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';

import ImgCustomize from '../../components/Tools/ImgCustomize';
import imagesUtil from '../../utils/images.util';

const LoadingScreen = () => {
  StatusBar.setTranslucent(true);
  return (
    <View style={styles.wrap}>
      <StatusBar translucent
backgroundColor="transparent" />
      <ImgCustomize
        imgWidth={231}
        imgHeight={232}
        imgSource={imagesUtil.logoLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingScreen;
