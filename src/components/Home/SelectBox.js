import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
} from 'react-native';
import PropsTypes from 'prop-types';
import DateTimePicker from '@react-native-community/datetimepicker';
import ModalDatePicker from '../common/ModalDatePickerIOS';
import ModalGooglePlace from '../common/ModalGooglePlace';
import Styles from '../../theme/MainStyles';
import {formatDateRequest, formatHHMM} from '../../utils/string.util';
import Colors from '../../theme/Colors';
import CustomPicker from '../common/CustomPicker';

const SelectBox = (props) => {
  const ref = React.useRef();
  const [show, setShow] = useState(false);
  const [datePicked, setDatePicked] = useState('');
  const [showModalGG, setShowModalGG] = useState(false);

  const onChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    props.handleChange(selectedDate);
    setDatePicked(selectedDate);
  };
  useEffect(() => {
    setDatePicked(props.value);
  }, [props.value]);

  function handleHideModal() {
    setShow(false);
  }

  function handleFocusInput() {
    if (props.useGGPlaces) {
      Keyboard.dismiss();
      setShowModalGG(true);
    }
  }

  function handleHideModalGG() {
    setShowModalGG(false);
  }

  function handleShowPicker() {
    setShow(true);
  }

  return (
    <View style={{...styles.container, ...props.containerStyle}}>
      <View
        style={{
          ...Styles.flexRowCenter,
          ...styles.wrapImage,
        }}
      >
        {props.image ? (
          <Image
            source={props.image}
            style={{...styles.icon, ...props.imageStyle}}
          />
        ) : null}
        {props.svg ? props.svg : null}
      </View>

      {!props.noPicker ? (
        <CustomPicker
          items={props.data}
          value={props.value}
          title={props.placeholder}
          onChange={(value) => {
            props.handleChange(value)
          }}
          wrapStyle={{
            flex: 1,
            marginLeft: 17,
            marginBottom: 3,
            marginTop: 10,
          }}
          textStyle={Styles.textLight}
        />
      ) : null}
      {props.label || props.isInput ? (
        <View style={styles.wrapInput}>
          {props.label ? (
            <Text style={{...styles.textLabel, ...Styles.textLight}}>
              {props.label}
            </Text>
          ) : null}
          {!props?.noInput ? (
            <TextInput
              ref={ref}
              placeholder={props.placeholder}
              placeholderStyle={Styles.textLight}
              style={{
                ...styles.textInput,
                paddingVertical: props.isInput ? 4 : 0,
                paddingBottom: Platform.OS === 'ios' ? 7 : 2,
                paddingTop: Platform.OS === 'ios' ? 10 : props.isInput ? 4 : 0,
              }}
              autoCompleteType={'off'}
              value={props.value}
              autoCapitalize={props.autoCapitalize || 'sentences'}
              keyboardType={props.keyboardType || 'default'}
              onChangeText={(value) => props.handleChange(value)}
              onFocus={handleFocusInput}
            />
          ) : (
            <Text
              style={{
                ...styles.textInput,
                color: '#C0C0C0',
                paddingVertical: props.isInput ? 4 : 0,
                paddingBottom: Platform.OS === 'ios' ? 7 : 2,
                paddingTop: Platform.OS === 'ios' ? 10 : props.isInput ? 4 : 0,
                marginVertical: props?.isView ? 5 : 0,
              }}
              onPress={handleFocusInput}
              numberOfLines={1}
            >
              {' '}
              {props.value ? props.value : props.placeholder}
            </Text>
          )}
        </View>
      ) : null}
      {props.date && props.mode === 'date' ? (
        <TouchableOpacity
          style={[styles.wrapInput, styles.wrapDatePicker]}
          onPress={handleShowPicker}
        >
          <Text style={Styles.textLight}>{props.placeholder}</Text>
          <Text style={styles.textFormatDate}>
            {datePicked ? formatDateRequest(datePicked) : '_ _ | _ _ | _ _'}
          </Text>
        </TouchableOpacity>
      ) : null}
      {props.mode === 'time' ? (
        <TouchableOpacity
          style={[styles.wrapInput, styles.wrapDatePicker]}
          onPress={handleShowPicker}
        >
          <Text style={Styles.textLight}>{props.placeholder}</Text>
          <Text style={styles.textFormatDate}>
            {props.time && new Date(props.value)
              ? `${formatHHMM(props.value)}`
              : '__:__'}
          </Text>
        </TouchableOpacity>
      ) : null}
      {show &&
        (Platform.OS === 'ios' ? (
          <ModalDatePicker
            value={props.value || new Date()}
            mode={props.mode}
            show={show}
            is24Hour={true}
            minimumDate={props.notBefore ? new Date() : null}
            display="default"
            onChange={onChange}
            onHide={handleHideModal}
          />
        ) : (
          <DateTimePicker
            value={props.value || new Date()}
            mode={props.mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
            minimumDate={props.notBefore ? new Date() : null}
          />
        ))}
      {showModalGG ? (
        <ModalGooglePlace
          visible={showModalGG}
          text={props.value}
          setAddress={(value) => props.handleChange(value)}
          onHideModal={handleHideModalGG}
        />
      ) : null}
    </View>
  );
};
SelectBox.prototype = {
  image: PropsTypes.oneOfType([
    PropsTypes.arrayOf(PropsTypes.node),
    PropsTypes.node,
  ]),
  placeholder: PropsTypes.string,
  selected: PropsTypes.string,
  label: PropsTypes.string,
  noPicker: PropsTypes.bool,
  date: PropsTypes.object,
  isInput: PropsTypes.bool,
};
export default SelectBox;

const styles = StyleSheet.create({
  icon: {
    width: 16,
    height: 16,
    position: 'absolute',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#C0C0C0',
    borderBottomWidth: 1,
    position: 'relative',
    marginBottom: 4,
    marginTop: 10,
  },
  picker: {
    height: 35,
    // flex: 1,
    fontSize: 10,
    transform: [{scaleX: 0.95}, {scaleY: 0.95}],
    // marginLeft: 17,
    color: Colors.black4,
    fontFamily: Platform.OS === 'android' ? 'Segoe-UI-Semilight' : '',
  },
  itemStyle: {
    fontSize: 10,
  },
  wrapInput: {
    flex: 1,
    marginLeft: 17,
  },
  textInput: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  textLabel: {
    fontSize: 12,
  },
  wrapDatePicker: {
    paddingBottom: 5,
    flexDirection: 'row',
    paddingTop: 10,
  },
  textFormatDate: {
    marginLeft: 9,
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    color: '#C0C0C0',
  },
  wrapImage: {
    width: 23,
    height: '100%',
    alignItems: 'center',
    marginRight: 5,
  },
});
