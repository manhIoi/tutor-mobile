import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CheckBox} from 'react-native-elements';
import IconCheck from '../../assets/images/svg/icon-check.svg';
import IconUnCheck from '../../assets/images/svg/icon-uncheck.svg';

const ChoiceNumberDate = (props) => {
  const iconCheckBox = (number, isCheck) => (
    <View style={styles.wrapCheckBox}>
      <CheckBox
        center
        title={`${number} buổi`}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={isCheck}
        size={18}
        containerStyle={{
          backgroundColor: '#fff',
          borderWidth: 0,
          paddingHorizontal: 0,
          paddingVertical: 5,
        }}
        textStyle={{
          fontSize: 12,
          fontWeight: 'normal',
        }}
        checkedIcon={<IconCheck width={16}
height={16} />}
        uncheckedIcon={<IconUnCheck width={16}
height={16} />}
        onPress={() => {
          if (!props.disabled) {
            props.handleChange(number);
          }
        }}
      />
    </View>
  );
  return (
    <View style={styles.container}>
      {iconCheckBox(1, props.value === 1)}
      {iconCheckBox(2, props.value === 2)}
      {iconCheckBox(3, props.value === 3)}
      {iconCheckBox(4, props.value === 4)}
    </View>
  );
};
export default ChoiceNumberDate;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
    marginHorizontal: 10,
  },
  wrapCheckBox: {
    width: '25%',
  },
});
