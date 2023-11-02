import React from 'react';
import {View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../../theme/Colors';

const ModalDatePicker = (props) => {
  return (
    <Modal
      isVisible={props.show}
      backdropOpacity={0.35}
      onBackdropPress={props.onHide}
    >
      <View style={styles.container}>
        <DateTimePicker
          value={props.value || new Date()}
          mode={props.mode}
          is24Hour={props.is24Hour}
          onChange={props.onChange}
          minimumDate={props.minimumDate}
          maximumDate={props.maximumDate}
        />
      </View>
    </Modal>
  );
};
ModalDatePicker.prototype = {
  show: PropTypes.bool,
  mode: PropTypes.string,
  value: PropTypes.object,
  onChange: PropTypes.func,
  is24Hour: PropTypes.bool,
  onHide: PropTypes.func,
  minimumDate: PropTypes.object,
  maximumDate: PropTypes.object,
};
export default ModalDatePicker;
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    backgroundColor: Colors.whiteColor,
    borderRadius: 15,
    borderColor: Colors.borderThin,
  },
});
