import React from 'react';
import {Avatar} from 'react-native-elements';
import {View, StyleSheet} from 'react-native';
import PropsTypes from 'prop-types';
import PropTypes from 'prop-types';
import FastImage from './FastImage';
import Colors from '../../theme/Colors';

const AvatarStatus = (props) => {
  return (
    <View style={[styles.container, {width: props.size || 72}]}>
      <FastImage
        source={
          typeof props.source === 'string' ? {uri: props.source} : props.source
        }
        style={{
          width: props.size,
          height: props.size,
          borderRadius: 100,
          borderWidth: 0.5,
          borderColor: Colors.greyText,
        }}
        zoomView={props.zoomView}
        hideLoad={props.hideLoad}
      />
      {props.showStatus ? (
        <View
          style={{
            ...styles.marker,
            ...props.styleMarker,
            backgroundColor: props.online ? Colors.green : Colors.grey,
          }}
        />
      ) : null}
      {props.icon ? (
        <View
          style={{
            ...styles.marker,
            ...props.styleMarker,
            backgroundColor: props.online ? Colors.green : Colors.grey,
            ...styles.markerIcon,
          }}
        >
          {props.icon}
        </View>
      ) : null}
    </View>
  );
};

AvatarStatus.prototype = {
  source: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  size: PropsTypes.number,
  showStatus: PropsTypes.bool,
  online: PropsTypes.bool,
  styleMarker: PropsTypes.object,
  zoomView: PropTypes.bool,
};
export default AvatarStatus;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  marker: {
    width: 16,
    height: 16,
    borderWidth: 2.5,
    borderColor: Colors.whiteColor,
    backgroundColor: Colors.orange,
    borderRadius: 50,
    position: 'absolute',
    bottom: 3,
    right: 3,
  },
  markerIcon: {
    width: 16,
    height: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.orange,
  },
});
