import React from 'react';
import {View, StyleSheet} from 'react-native';
import Colors from '../../theme/Colors';

const BoxShadow = (props) => {
  return (
    <View style={{...styles.container, ...props.style}}>{props.children}</View>
  );
};
export default BoxShadow;
const styles = StyleSheet.create({
  container: {
    margin: 5,
    borderRadius: 12,
    shadowColor: '#dcdbdb',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.7,
    shadowRadius: 3.84,
    elevation: 4,
    zIndex: 200,
    borderWidth: 0.5,
    borderColor: 'rgba(199,198,198,0.44)',
    backgroundColor: Colors.whiteColor,
  },
});
