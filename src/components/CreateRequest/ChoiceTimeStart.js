import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import {Text} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../../theme/Colors';
import ModalDatePicker from '../common/ModalDatePickerIOS';
import {formatHHMM} from '../../utils/string.util';
import Styles from '../../theme/MainStyles';

const ChoiceSpecificDay = (props) => {
  const [show, setShow] = useState(false);
  const onChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    props.handleChangeTimeStart(selectedDate);
  };
  function handleHideModal() {
    setShow(false);
  }
  function handleShowPicker() {
    setShow(true);
  }
  return (
    <View style={styles.container}>
      <View style={styles.wrapDetailClass}>
        <TouchableOpacity onPress={handleShowPicker}>
          <Text style={{...styles.labelText, ...Styles.textLight}}>
            Thời gian: {'  '}
            <Text style={Styles.textBold}>
              {formatHHMM(props.timeStart)} -{' '}
              {formatHHMM(
                new Date(
                  new Date(props.timeStart).getTime() +
                    (props.time || 1) * 45 * 60 * 1000,
                ),
              )}
            </Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.wrapNumberLesson}>
          <Text
            style={{...styles.labelText, ...Styles.textLight, marginBottom: 0}}
          >
            Tổng số buổi học: {'  '}
          </Text>
          <TextInput
            style={styles.inputNumberLesson}
            keyboardType={'phone-pad'}
            value={props.totalLesson}
            onChangeText={(value) => props.handleChangeTotalLesson(value)}
          />
          <Text>buổi</Text>
        </TouchableOpacity>
      </View>
      {show &&
        (Platform.OS === 'ios' ? (
          <ModalDatePicker
            value={props.value || new Date()}
            show={show}
            mode={'time'}
            is24Hour={true}
            display="default"
            onChange={onChange}
            onHide={handleHideModal}
          />
        ) : (
          <DateTimePicker
            value={props.value || new Date()}
            mode={'time'}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        ))}
    </View>
  );
};
export default ChoiceSpecificDay;
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  textDetail: {
    color: Colors.black3,
    fontSize: 12,
    marginBottom: 5,
  },
  textDay: {
    fontSize: 10,
    color: Colors.black3,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  wrapListDay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  wrapDay: {
    borderRadius: 12,
  },
  wrapDayContent: {
    borderRadius: 12,
    width: 28,
    alignItems: 'center',
  },
  labelText: {
    color: Colors.black3,
    fontSize: 12,
    marginVertical: 4,
  },
  wrapDetailClass: {
    marginTop: 10,
  },
  inputNumberLesson: {
    width: 50,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    height: 25,
  },
  wrapNumberLesson: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});
