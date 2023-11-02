import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  RefreshControl,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import BackgroundImageTop from '../Tools/BackgroundImageTop';
import {getStatusBarHeight} from '../../utils/ScaleAdaptor';
import ConfigStyle from '../../theme/ConfigStyle';

const Container = (props) => {
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const scrollY = new Animated.Value(0);
  const HEADER_MAX_HEIGHT = props.headerHeight || 0;
  const HEADER_MIN_HEIGHT = ConfigStyle.minStatusBar;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
  const imageOpacity = props.headerHeight
    ? scrollY.interpolate({
        inputRange: [
          0,
          (HEADER_SCROLL_DISTANCE + statusBarHeight) / 3,
          (HEADER_SCROLL_DISTANCE + statusBarHeight) / 2,
        ],
        outputRange: [1, 0.5, 0],
        extrapolate: 'clamp',
      })
    : 1;
  useEffect(() => {
    if (Platform.OS === 'android') {
      setStatusBarHeight(StatusBar.currentHeight);
    } else {
      setStatusBarHeight(getStatusBarHeight(true));
    }
  }, []);
  return (
    <View style={styles.wrapper}>
      {props.header}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.wrapper}
      >
        <View
          style={{
            marginTop: props.headerHeight
              ? props.headerHeight + statusBarHeight
              : 0,
            ...styles.container,
          }}
        >
          {!props.hideBackground ? (
            <Animated.View
              style={{
                transform: [
                  {
                    translateY: -(props.headerHeight
                      ? props.headerHeight + statusBarHeight
                      : 0),
                  },
                ],
                opacity: imageOpacity,
              }}
            >
              <BackgroundImageTop imageSource={props.imageSource} />
            </Animated.View>
          ) : null}
          {props.contentTop}
          <View
            style={{
              flex: 1,
            }}
          >
            <View style={{...props.containerStyle}}>{props.children}</View>
          </View>
        </View>
      </KeyboardAvoidingView>
      {props.footer ? props.footer : null}
    </View>
  );
};

Container.propTypes = {
  title: PropTypes.string,
  imageSource: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  header: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  footer: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  headerHeight: PropTypes.number,
  hideBackground: PropTypes.bool,
  containerStyle: PropTypes.object,
  keyboardAvoidingView: PropTypes.bool,
  keyboardShouldPersistTaps: PropTypes.bool,
  notScroll: PropTypes.bool,
};
export default Container;
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
