import React from 'react';
import {Icon,Text} from 'react-native-elements';
import PropTypes from 'prop-types';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {PropsType} from 'react-native/ReactCommon/hermes/inspector/tools/msggen/src/Type';

const IconCustom = (props) => {
  return (
    <TouchableOpacity
      style={{...styles.container, ...props.containerStyle}}
      onPress={props.onPress ? props.onPress : null}
    >
      {props.number ? (
        <View style={{...styles.wrapText, ...props.styleNumber}}>
          <Text style={styles.text}>
            {props.number >= 10 ? `9+` : props.number}
          </Text>
        </View>
      ) : null}
      {props.name ? (
        <Icon name={props.name}
type={props.type}
color="#fff"
size={35} />
      ) : null}
      {props.image ? (
        <Image
          style={{width: props.width, height: props.height}}
          source={props.image}
        />
      ) : null}
      {props.svg ? props.svg : null}
    </TouchableOpacity>
  );
};
IconCustom.prototype = {
  name: PropTypes.string,
  type: PropTypes.string,
  image: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  width: PropTypes.number,
  height: PropTypes.number,
  count: PropTypes.number,
  containerStyle: PropTypes.object,
  styleNumber: PropTypes.object,
  onPress: PropTypes.func,
  svg: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  number: PropTypes.number,
};
export default IconCustom;
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 35,
    height: 35,
  },
  text: {
    color: '#fff',
    paddingHorizontal: 2,
    fontSize: 10,
    lineHeight: 13,
  },
  wrapText: {
    minWidth: 15,
    minHeight: 15,
    alignItems: 'center',
    backgroundColor: '#f00',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#fff',
    position: 'absolute',
    right: 0,
    zIndex: 99,
  },
});
