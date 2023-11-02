import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import {Picker} from '@react-native-community/picker';
import {Icon, Text} from 'react-native-elements';
import Colors from '../../theme/Colors';
import Styles from '../../theme/MainStyles';
import CustomPicker from './CustomPicker';

const InputForm = ({
  label,
  required,
  msgError,
  icon,
  actions,
  value,
  name,
  number,
  listPhoneCode,
  phoneCode,
  onFocus,
  setPhoneCode,
  isFocus,
  actionActiveAccount,
}) => {
  const [show, setShow] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.wrapTextTop}>
        <View style={styles.wrapLabel}>
          <Text style={[Styles.title4RS, styles.label, Styles.textBold]}>
            {label}
          </Text>
          {required ? <Text style={styles.textRed}>*</Text> : null}
        </View>
        <Text style={[styles.textRed, styles.textError]}>{msgError}</Text>
        {actionActiveAccount || null}
      </View>
      <View
        style={[
          styles.wrapInput,
          {borderBottomColor: msgError ? '#f00' : Colors.inputBorder},
        ]}
      >
        {listPhoneCode ? (
          <View style={styles.countryPhoneCode}>
            <CustomPicker
              items={listPhoneCode}
              value={phoneCode}
              title={'Chọn mã vùng'}
              onChange={(value) => setPhoneCode(value)}
              wrapStyle={{
                borderRightWidth: 1,
                marginVertical: 5,
                paddingRight: 10,
                marginRight: 5,
                borderRightColor: Colors.blue,
              }}
              textStyle={{fontSize: 18}}
            />
          </View>
        ) : null}
        <TextInput
          style={styles.input}
          keyboardType={number ? 'phone-pad' : null}
          value={value}
          autoCompleteType={'off'}
          secureTextEntry={!icon ? false : !show}
          onChangeText={(value) => actions(value, name)}
          onFocus={(val) => {
            isFocus ? onFocus(false) : console.log(1);
          }}
          onBlur={(val) => {
            isFocus ? onFocus(true) : console.log(1);
          }}
        />
        {!icon ? null : !show ? (
          <View style={{margin: 3}}>
            <Icon
              type="feather"
              name="eye"
              size={20}
              color="#c6c5c5"
              onPress={() => setShow(true)}
            />
          </View>
        ) : (
          <View style={{margin: 3}}>
            <Icon
              type="feather"
              name="eye-off"
              size={20}
              color="#c6c5c5"
              onPress={() => setShow(false)}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default InputForm;
const styles = StyleSheet.create({
  container: {},
  wrapTextTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 5,
    marginTop: 15,
  },
  wrapLabel: {
    flexDirection: 'row',
  },
  label: {
    color: Colors.grey,
    marginRight: 5,
  },
  textRed: {
    color: '#f00',
  },
  inputContainerStyle: {
    height: 30,
    borderBottomWidth: 0,
  },
  input: {
    height: 30,
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 18,
    flex: 1,
  },
  containerStyle: {
    height: 30,
  },
  textError: {
    fontSize: 11,
  },
  wrapInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    marginHorizontal: 10,
  },
  pickerCountryCode: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 30,
    color: '#004892',
  },
  countryPhoneCode: {
    flex: 1,
    marginRight: 5,
    minWidth: 90,
    maxWidth: 90,
  },
});
