import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import ImageUtil from '../../utils/images.util';

const AddButton = (props) => {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={[styles.btn]}>
        <Image source={ImageUtil.btnAdd}
style={styles.image} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AddButton;

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnIconPlus: {
    fontSize: 30,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  wrapIcon: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 50,
    backgroundColor: '#f00',
  },
  image: {
    width: 61,
    height: 61,
  },
});
