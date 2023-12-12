import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

const AddChat = (props) => {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={[styles.btn, props.style]}>
        <Image source={{uri: "https://media.istockphoto.com/id/1010001882/vector/%C3%B0%C3%B0%C2%B5%C3%B1%C3%B0%C3%B1%C3%B1.jpg?s=612x612&w=0&k=20&c=1jeAr9KSx3sG7SKxUPR_j8WPSZq_NIKL0P-MA4F1xRw="}}
style={styles.image} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AddChat;

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
