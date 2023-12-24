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
  Keyboard,
  SafeAreaView,
} from 'react-native';
import PropTypes from 'prop-types';
import BackgroundImageTop from '../Tools/BackgroundImageTop';
import {getStatusBarHeight} from '../../utils/ScaleAdaptor';

const Container = (props) => {
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const refScroll = React.useRef();
  useEffect(() => {
    if (Platform.OS === 'android') {
      setStatusBarHeight(StatusBar.currentHeight);
    } else {
      setStatusBarHeight(getStatusBarHeight(true));
    }
  }, []);
  useEffect(() => {
    setTimeout(() => {
      showScrollToEnd();
    }, 150);
  }, [props.showScroll]);
  useEffect(() => {
    Keyboard?.addListener?.('keyboardDidShow', _keyboardDidShow);
    return () => {
      Keyboard?.removeListener?.('keyboardDidShow', _keyboardDidShow);
    };
  }, []);

  const _keyboardDidShow = () => {
    showScrollToEnd();
  };

  function showScrollToEnd() {
    refScroll?.current?.scrollToEnd({animated: true});
  }
  return (
    <SafeAreaView style={styles.wrapper}>
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
          <View style={{...props.containerStyle}}>{props.children}</View>
        </View>
        {props.footer ? props.footer : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
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
