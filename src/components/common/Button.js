import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-elements';
import PropTypes from 'prop-types';

const BtnBorder = (props) => {
  return (
    <TouchableOpacity onPress={() => props.onSubmit()}>
      <View style={{...styles.btn, ...props.styles}}>
        <Text style={{...styles.text, ...props.textStyle}}>{props.text}</Text>
        {props.iconRight ? props.iconRight : null}
      </View>
    </TouchableOpacity>
  );
};

BtnBorder.prototype = {
  onSubmit: PropTypes.func,
};
export default BtnBorder;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  text: {
    color: '#000',
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
});
