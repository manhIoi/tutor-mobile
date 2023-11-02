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
import Colors from '../../theme/Colors';

const Container = (props) => {
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const refScroll = React.useRef();
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
  useEffect(() => {
    !props?.scroll
      ? refScroll?.current?.scrollTo({y: 0, animated: true})
      : refScroll?.current?.scrollTo({y: 500, animated: true});
  }, [props.shouldScrollTop, props?.scroll]);
  return (
    <View style={styles.wrapper}>
      {props.header}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.wrapper}
      >
        <Animated.ScrollView
          ref={refScroll}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: false},
          )}
          keyboardShouldPersistTaps={
            props.keyboardShouldPersistTaps ? 'handled' : 'never'
          }
          scrollEnabled={!props.notScroll}
          style={{
            marginTop: props.headerHeight
              ? props.headerHeight + statusBarHeight
              : 0,
            ...styles.container,
          }}
          refreshControl={
            props.onRefresh ? (
              <RefreshControl
                refreshing={props.refreshing}
                onRefresh={props.onRefresh}
                colors={[Colors.orange]}
              />
            ) : null
          }
        >
          <View
            style={{
              flex: 1,
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

            <View style={{...props.containerStyle}}>{props.children}</View>
          </View>
        </Animated.ScrollView>
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
