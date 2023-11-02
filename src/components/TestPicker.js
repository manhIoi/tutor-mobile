import React, {useState} from 'react';
import {View, Button, Platform, Text} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ModalDatePicker from "./common/ModalDatePickerIOS";

const App = () => {
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };
  const hideDatePicker = () => {
    setShow(false);
  };
  return (
    <View>
      <View>
        <Button onPress={showDatepicker}
title="Show date picker!" />
      </View>
      <View>
        <Button onPress={showTimepicker}
title="Show time picker!" />
      </View>
      <Text>{date.toISOString()}</Text>
      {show && (
        <ModalDatePicker
          testID="dateTimePicker"
          show={show}
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
          onHide={hideDatePicker}
        />
      )}
    </View>
  );
};
export default App;
