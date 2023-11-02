import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import {Text} from 'react-native-elements';
import BackgroundImageTop from '../Tools/BackgroundImageTop';
import ConfigStyle from '../../theme/ConfigStyle';
import {getStatusBarHeight} from '../../utils/ScaleAdaptor';
import ImageUtils from '../../utils/images.util';
import Styles from '../../theme/MainStyles';
import InputSearch from './InputSearch';
import SwitchTab from './SwitchTab';
import Colors from '../../theme/Colors';

const width = Dimensions.get('window').width;
const Container = (props) => {
  const scrollY = new Animated.Value(0);
  const refScroll = React.useRef();
  const HEADER_MAX_HEIGHT = props.headerHeight;
  const HEADER_MIN_HEIGHT = ConfigStyle.minStatusBar;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [
      HEADER_MAX_HEIGHT + statusBarHeight,
      HEADER_MIN_HEIGHT + statusBarHeight,
    ],
    extrapolate: 'clamp',
  });
  const contentHeaderHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
  const imageOpacity = scrollY.interpolate({
    inputRange: [
      0,
      (HEADER_SCROLL_DISTANCE + statusBarHeight) / 3,
      (HEADER_SCROLL_DISTANCE + statusBarHeight) / 2,
    ],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    if (Platform.OS === 'android') {
      setStatusBarHeight(StatusBar.currentHeight);
    } else {
      setStatusBarHeight(getStatusBarHeight(true));
    }
  }, []);

  function showScrollToEnd() {
    refScroll.current.scrollToEnd({animated: true});
  }

  useEffect(() => {
    if (props.scrollEnd) {
      setTimeout(() => {
        showScrollToEnd();
      }, 150);
    }
  }, [props.scrollEnd]);

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.supperWrapper,
          props.tabLabels ? {marginBottom: 25} : {},
        ]}
      >
        <Animated.View style={[styles.headerWrapper, {height: headerHeight}]}>
          <BackgroundImageTop
            containerStyle={{
              height:
                (props.headerHeight
                  ? props.headerHeight
                  : ConfigStyle.statusBarHeight) -
                (Platform.OS === 'ios'
                  ? getStatusBarHeight(true)
                  : StatusBar.currentHeight),
            }}
            imageSource={props.imageSource}
          />

          <Animated.View
            style={{
              ...styles.headerContainer,
              marginTop: statusBarHeight,
              height: contentHeaderHeight,
              //   ? headerHeight
              //   : ConfigStyle.statusBarHeight) -
              // (Platform.OS === 'ios'
              //   ? getStatusBarHeight(true)
              //   : StatusBar.currentHeight),
            }}
          >
            <View style={{...styles.contentBar, ...props.contentBarStyles}}>
              {/* action left */}
              {props.textLeft || props.arrowBack ? (
                <View style={{...styles.holdAction}}>
                  {props.textLeft ? (
                    <TouchableOpacity onPress={() => props.actionLeft}>
                      <Text style={styles.textAction}>{props.textLeft}</Text>
                    </TouchableOpacity>
                  ) : null}
                  {props.arrowBack ? (
                    <TouchableOpacity
                      onPress={() => props.navigation.goBack()}
                      style={styles.wrapArrowLeft}
                    >
                      <Image
                        style={styles.iconArrowLeft}
                        source={ImageUtils.iconArrowLeft}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              ) : null}
              {/* content */}
              <View style={styles.mainContent}>
                {props.title ? (
                  <View style={styles.wrapTitle}>
                    <Text
                      numberOfLines={1}
                      style={[Styles.title1RS, styles.title]}
                    >
                      {props.title}
                    </Text>
                  </View>
                ) : null}
                {props.search ? (
                  <InputSearch
                    onSearch={props.actionSearch}
                    iconRight={props.iconSearchRight}
                  />
                ) : null}
                {props.content ? props.content : null}
              </View>
              {/* action right */}
              {props.textRight || props.iconRight ? (
                <View style={{...styles.holdAction, marginLeft: 17}}>
                  {props.textRight ? (
                    <TouchableOpacity onPress={() => props.actionRight}>
                      <Text style={styles.textAction}>{props.textRight}</Text>
                    </TouchableOpacity>
                  ) : null}
                  {props.iconRight ? (
                    <View style={styles.wrapIconRight}>{props.iconRight}</View>
                  ) : null}
                </View>
              ) : null}
              {props.arrowBack && !(props.textRight || props.iconRight) ? (
                <View style={{...styles.holdAction}} />
              ) : null}
            </View>
          </Animated.View>
        </Animated.View>
        {props.tabLabels ? (
          <View style={styles.wrapTabSwitch}>
            <SwitchTab
              tab={props.tab}
              tabLabels={props.tabLabels}
              changeTab={props.changeTab}
            />
          </View>
        ) : null}
      </Animated.View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.wrapper}
      >
        <Animated.ScrollView
          ref={refScroll}
          keyboardShouldPersistTaps={
            props.keyboardShouldPersistTaps ? 'handled' : 'never'
          }
          style={{
            ...styles.container,
          }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: false},
          )}
        >
          <View
            style={{
              flex: 1,
              marginTop: props.headerHeight + statusBarHeight || 0,
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
  supperWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 99,
  },
  headerWrapper: {
    backgroundColor: Colors.whiteColor,
    overflow: 'hidden',
  },
  headerContainer: {
    // minHeight: 90,
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width,
    paddingHorizontal: 18,
    alignItems: 'center',
    zIndex: 99,
  },
  contentBar: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    // marginBottom: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  title: {
    color: '#fff',
    // marginBottom: 10,
  },
  wrapTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 0,
  },
  holdAction: {
    width: 30,
    justifyContent: 'center',
  },
  mainContent: {
    justifyContent: 'flex-start',
  },
  textAction: {
    color: '#fff',
  },
  wrapIconRight: {
    marginTop: 8,
    // height: '100%',
  },
  iconArrowLeft: {
    width: 11,
    height: 22,
  },
  wrapArrowLeft: {
    paddingVertical: 10,
    paddingLeft: 5,
  },
  wrapTabSwitch: {
    position: 'absolute',
    bottom: 0,
    borderRadius: 50,
    transform: [{translateY: 22}],
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
