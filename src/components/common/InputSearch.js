import React, {useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import Styles from '../../theme/MainStyles';
import IconSearch from '../../assets/images/svg/magnifying-glass.svg';
import Colors from '../../theme/Colors';

const InputSearch = (props) => {
  const input = useRef(null);
  return (
    <View
      style={{
        ...styles.container,
        justifyContent: props.iconRight ? 'space-between' : 'flex-start',
      }}
    >
      <IconSearch />
      {props.disabled ? (
        <TouchableWithoutFeedback
          onPress={props.onFocusSearch}
          style={{zIndex: 2}}
        >
          <View style={styles.overplayTextInput}></View>
        </TouchableWithoutFeedback>
      ) : null}
      <TextInput
        ref={input}
        style={{
          ...styles.textInput,
          ...Styles.textNormal,
          marginLeft: props.iconRight ? 8 : 12,
        }}
        showSoftInputOnFocus={!props.isTouch}
        placeholder="Search...."
        placeholderTextColor="grey"
        value={props.textSearch}
        onChange={props.onSearch}
        onChangeText={props?.isSearch ? (v) => props.Search(v) : null}
        onFocus={props.onFocusSearch}
        autoFocus={props.autoFocus}
        {...props?.textInputProps}
      />
      {props.iconRight ? props.iconRight : null}
    </View>
  );
};
InputSearch.prototype = {
  onSearch: PropTypes.func,
  iconRight: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  disabled: PropTypes.bool,
};
export default InputSearch;
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
    flex: 1,
    color: Colors.black3,
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
