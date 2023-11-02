import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import ImageUtils from '../../utils/images.util';
import {getStatusBarHeight} from '../../utils/ScaleAdaptor';

const statusBarHeight =
  Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;
const width = Dimensions.get('window').width;
const CallHeader = (props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          props.navigation.goBack();
        }}
        style={styles.wrapArrowLeft}
      >
        <Image style={styles.iconArrowLeft}
source={ImageUtils.iconArrowLeft} />
      </TouchableOpacity>
    </View>
  );
};

export default CallHeader;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: statusBarHeight,
    left: 0.05 * width,
    right: 0,
    zIndex: 999,
  },
  iconArrowLeft: {
    width: 11,
    height: 22,
  },
  wrapArrowLeft: {
    paddingVertical: 10,
    paddingLeft: 5,
  },
});
