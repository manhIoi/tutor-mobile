import * as React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Text} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import ConfigStyle from '../../theme/ConfigStyle';
import {formatYYYYMMDD, formatDDMMYYY} from '../../utils/string.util';
import ModalDatePicker from '../common/ModalDatePickerIOS';

const width = Dimensions.get('window').width;

const Datepicker = (props) => {
  const [date, setDate] = React.useState(props?.value || new Date());
  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(false);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    if (Platform.OS === 'android') setShow(false);
    setDate(currentDate);
    props.actions(currentDate, props.name);
  };
  const showMode = (currentMode) => {
    if (props.editable === false) setShow(false);
    else {
      setShow(true);
      setMode(currentMode);
    }
  };

  const showDatepicker = () => {
    showMode('date');
  };
  return (
    <View style={{...styles.viewText}}>
      <View style={styles.image}>{props.src}</View>
      <View style={{...styles.viewTitle, marginVertical: 15}}>
        <TouchableOpacity onPress={showDatepicker}
style={styles.text}>
          <Text
            style={
              !props?.editable ? {fontSize: 14, opacity: 0.5} : {fontSize: 14}
            }
          >
            {formatYYYYMMDD(props?.value)}
          </Text>
        </TouchableOpacity>
        {show &&
          (Platform.OS === 'ios' ? (
            <ModalDatePicker
              value={props.value}
              mode={mode}
              show={show}
              maximumDate={new Date()}
              display="default"
              onChange={onChange}
              onHide={() => {
                setShow(false);
              }}
            />
          ) : (
            <DateTimePicker
              testID="dateTimePicker"
              value={props.value}
              mode={mode}
              maximumDate={new Date()}
              // is24Hour={true}
              display="default"
              onChange={onChange}
            />
          ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  viewText: {
    flexDirection: 'row',
    marginHorizontal: 15,
    borderBottomColor: '#C0C0C0',
    borderBottomWidth: 1,
    // marginVertical: 5,
  },
  image: {
    width: 25,
    height: 25,
    alignSelf: 'center',
  },
  viewTitle: {justifyContent: 'center'},
  text: {
    fontSize: ConfigStyle.customTitle2,
    width: width - 80,
    flex: 1,
    paddingRight: 20,
    alignSelf: 'center',
    marginLeft: 11,
    color: '#333333',
  },
});
export default Datepicker;
