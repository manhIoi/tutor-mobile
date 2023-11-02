import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import {Text} from 'react-native-elements';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {getStatusBarHeight} from '../../utils/ScaleAdaptor';
import InputSearch from './InputSearch';
import Styles from '../../theme/MainStyles';
import ImageUtils from '../../utils/images.util';
import BackgroundImageTop from '../Tools/BackgroundImageTop';
import ConfigStyle from '../../theme/ConfigStyle';
import Colors from '../../theme/Colors';
import SwitchTabClass from './SwitchTabClass';
import {changeState} from '../../lib/slices/classManagementSlice';

const width = Dimensions.get('window').width;
const StatusBarManagement = (props) => {
  const dispatch = useDispatch();
  const isCheck = useSelector((state) => state.classManager.isChecked);
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  useEffect(() => {
    if (Platform.OS === 'android') {
      setStatusBarHeight(StatusBar.currentHeight);
    } else {
      setStatusBarHeight(getStatusBarHeight(true));
    }
  }, []);

  function changeText() {
    dispatch(changeState());
  }
  return (
    <View
      style={[styles.supperWrapper, props.tabLabels ? {marginBottom: 25} : {}]}
    >
      <View
        style={[
          styles.headerWrapper,
          props.headerHeight
            ? {height: props.headerHeight + statusBarHeight}
            : {},
        ]}
      >
        <BackgroundImageTop
          containerStyle={{
            height:
              (props.headerHeight
                ? props.headerHeight + statusBarHeight
                : ConfigStyle.statusBarHeight) -
              (Platform.OS === 'ios'
                ? getStatusBarHeight(true)
                : StatusBar.currentHeight),
          }}
          imageSource={props.imageSource}
        />
        <View
          style={{
            ...styles.container,
            marginTop: statusBarHeight,
            height:
              (props.headerHeight
                ? props.headerHeight + statusBarHeight
                : ConfigStyle.statusBarHeight) -
              (Platform.OS === 'ios'
                ? getStatusBarHeight(true)
                : StatusBar.currentHeight),
          }}
        >
          <View
            style={{
              ...styles.contentBar,
              ...props.contentBarStyles,
              marginBottom: Platform.OS === 'android' ? statusBarHeight / 2 : 0,
            }}
          >
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
                    style={[
                      Styles.title1RS,
                      styles.title,
                      props.tabLabels ? {marginBottom: 8} : {},
                    ]}
                  >
                    {props.title}
                  </Text>
                </View>
              ) : null}
              {props.search && !props.showModalSearchDelay ? (
                <InputSearch
                  onSearch={props.actionSearch}
                  iconRight={props.iconSearchRight}
                  disabled={props.disabledInput}
                  onFocusSearch={props.onFocusSearch || null}
                />
              ) : null}
              {props.content ? props.content : null}
            </View>
            {/* action right */}
            {props.textRight || props.iconRight ? (
              <View style={{...styles.holdAction, marginLeft: 17}}>
                {props.textRight ? (
                  <TouchableOpacity
                    onPress={() => {
                      props.actionRight();
                    }}
                  >
                    <Text style={styles.textAction}>{props.textRight}</Text>
                  </TouchableOpacity>
                ) : null}
                {props.iconRight ? (
                  <View
                    style={{...styles.wrapIconRight, ...props.wrapIconReight}}
                  >
                    {props.iconRight}
                  </View>
                ) : null}
              </View>
            ) : null}
            {props.arrowBack && !(props.textRight || props.iconRight) ? (
              <View style={{...styles.holdAction}} />
            ) : null}
          </View>
        </View>
      </View>
      {props.tabLabels ? (
        <View style={styles.wrapTabSwitch}>
          <SwitchTabClass
            tab={props.tab}
            tabLabels={props.tabLabels}
            changeTab={props.changeTab}
          />
        </View>
      ) : null}
    </View>
  );
};

StatusBarManagement.prototype = {
  title: PropTypes.string,
  textLeft: PropTypes.string,
  actionLeft: PropTypes.func,
  iconRight: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  content: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  textRight: PropTypes.string,
  actionRight: PropTypes.func,
  search: PropTypes.bool,
  actionSearch: PropTypes.func,
  arrowBack: PropTypes.bool,
  contentBarStyles: PropTypes.object,
  renderTab: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  tab: PropTypes.number,
  tabLabels: PropTypes.array,
  changeTab: PropTypes.func,
  iconSearchRight: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default StatusBarManagement;
const styles = StyleSheet.create({
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
  container: {
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
  },
  title: {
    color: '#fff',
  },
  wrapTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 0,
  },
  holdAction: {
    width: 35,
    justifyContent: 'center',
  },
  mainContent: {
    justifyContent: 'flex-start',
    flex: 1,
  },
  textAction: {
    color: '#fff',
  },
  wrapIconRight: {
    marginTop: 8,
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
    bottom: -10,
    borderRadius: 50,
    transform: [{translateY: 22}],
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
