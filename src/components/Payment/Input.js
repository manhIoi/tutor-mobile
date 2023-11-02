import React, {useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Input, Icon} from 'react-native-elements';
import Colors from '../../theme/Colors';
import Styles from '../../theme/MainStyles';

const InputForm = ({
  label,
  required,
  msgError,
  icon,
  actions,
  value,
  name,
  number,
  padding,
  autoCapitalize,
}) => {
  const [show, setShow] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.wrapTextTop}>
        <View style={styles.wrapLabel}>
          <Text style={[Styles.title4, styles.label]}>{label}</Text>
          {required ? <Text style={styles.textRed}>*</Text> : null}
        </View>
        <Text style={[styles.textRed, styles.textError]}>{msgError}</Text>
      </View>
      <Input
        inputStyle={styles.input}
        keyboardType={number ? 'numeric' : null}
        containerStyle={styles.containerStyle}
        autoCapitalize={autoCapitalize ? 'characters' : ''}
        inputContainerStyle={[
          styles.inputContainerStyle,
          {borderBottomColor: msgError ? '#f00' : Colors.inputBorder},
        ]}
        value={value}
        secureTextEntry={!icon ? false : !show}
        onChangeText={(value) => actions(value, name)}
      />
    </View>
  );
};

export default InputForm;
const styles = StyleSheet.create({
  countryPhoneCode: {
    fontSize: 12,
    color: '#004892',
    borderRightWidth: 1,
    paddingHorizontal: 15,
    borderRightColor: 'lightgray',
  },
  container: {
    //   marginBottom :10
  },
  wrapTextTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    // marginBottom: 5,
    marginTop: 8,
  },
  wrapLabel: {
    flexDirection: 'row',
  },
  label: {
    color: Colors.grey,
    fontWeight: 'bold',
    marginRight: 5,
  },
  textRed: {
    color: '#f00',
  },
  inputContainerStyle: {
    height: 30,
  },
  containerStyle: {
    height: 30,
  },
  textError: {
    fontSize: 11,
  },
});
