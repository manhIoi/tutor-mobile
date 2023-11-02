import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import ImagesUtil from '../../utils/images.util';
import ModalSearch from '../RequestManagement/ModalSearch';

export default function InputModalSearch(props) {
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleModalDrop = () => {
    setModalVisible(false);
  };
  const input = useRef(null);

  return (
    <View
      style={{
        ...styles.container,
        justifyContent: props.iconRight ? 'space-between' : 'flex-start',
      }}
    >
      <Modal
        animationType="slide"
        transparent={true}
        onBackdropPress={toggleModalDrop}
        isVisible={isModalVisible}
      >
        <ModalSearch />
      </Modal>
      <TouchableOpacity>
        <Image style={styles.iconSearch}
source={ImagesUtil.iconSearch} />
      </TouchableOpacity>
      {props.disabled ? (
        <TouchableWithoutFeedback
          onPress={props.onFocusSearch}
          style={{zIndex: 2}}
        >
          <View style={styles.overplayTextInput} />
        </TouchableWithoutFeedback>
      ) : null}
      <TextInput
        ref={input}
        style={{
          ...styles.textInput,
          marginLeft: props.iconRight ? 4 : 12,
        }}
        placeholder="Search...."
        value={props.textSearch}
        onChange={props.onSearch}
        onFocus={props.onFocusSearch}
        autoFocus={props.autoFocus}
      />
      {props.iconRight ? props.iconRight : null}
    </View>
  );
}
InputModalSearch.prototype = {
  onSearch: PropTypes.func,
  iconRight: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  disabled: PropTypes.bool,
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 25,
    backgroundColor: '#fff',
    paddingLeft: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    height: 43,
    marginHorizontal: 0,
    zIndex: 99,
  },
  textInput: {
    marginTop: 5,
    width: '75%',
  },
  iconSearch: {
    width: 22,
    height: 22,
  },
  overplayTextInput: {
    height: 46,
    position: 'absolute',
    width: '75%',
    top: 0,
    left: 37,
    zIndex: 99,
  },
});
