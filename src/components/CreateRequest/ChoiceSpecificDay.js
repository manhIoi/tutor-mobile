import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import {Text} from 'react-native-elements';
import Colors from '../../theme/Colors';
import BoxShadow from '../common/BoxShadow';
import Styles from '../../theme/MainStyles';

const ChoiceSpecificDay = (props) => {
  function handleChange(value) {
    if (!props.disabled) {
      const currentList = JSON.parse(JSON.stringify(props.dayStudy));
      const index = currentList.indexOf(value);
      if (index === -1) {
        if (props.numberDay > currentList.length) {
          currentList.push(value);
        }
      } else {
        currentList.splice(index, 1);
      }
      if (typeof props.handleChange === 'function') {
        props.handleChange(currentList);
      }
    }
  }
  function checkActiveDay(value) {
    return props.dayStudy?.indexOf(value) !== -1;
  }
  return (
    <View style={[styles.container, props.containerStyle]}>
      <Text style={[styles.textDetail, Styles.textLight]}>
        Ngày học trong tuần:
      </Text>
      <View style={styles.wrapListDay}>
        <BoxShadow style={[styles.wrapDay]}>
          <TouchableOpacity
            style={[
              styles.wrapDayContent,
              checkActiveDay(1) ? {backgroundColor: Colors.inboxSend} : {},
            ]}
            onPress={() => handleChange(1)}
            disabled={props.disabled}
          >
            <Text
              style={[
                styles.textDay,
                Styles.textLight,
                checkActiveDay(1) ? {color: Colors.orange} : {},
              ]}
            >
              MO
            </Text>
          </TouchableOpacity>
        </BoxShadow>
        <BoxShadow style={[styles.wrapDay]}>
          <TouchableOpacity
            style={[
              styles.wrapDayContent,
              checkActiveDay(2) ? {backgroundColor: Colors.inboxSend} : {},
            ]}
            onPress={() => handleChange(2)}
            disabled={props.disabled}
          >
            <Text
              style={[
                styles.textDay,
                checkActiveDay(2) ? {color: Colors.orange} : {},
              ]}
            >
              TU
            </Text>
          </TouchableOpacity>
        </BoxShadow>
        <BoxShadow style={[styles.wrapDay]}>
          <TouchableOpacity
            style={[
              styles.wrapDayContent,
              checkActiveDay(3) ? {backgroundColor: Colors.inboxSend} : {},
            ]}
            onPress={() => handleChange(3)}
            disabled={props.disabled}
          >
            <Text
              style={[
                styles.textDay,
                checkActiveDay(3) ? {color: Colors.orange} : {},
              ]}
            >
              WE
            </Text>
          </TouchableOpacity>
        </BoxShadow>
        <BoxShadow style={[styles.wrapDay]}>
          <TouchableOpacity
            style={[
              styles.wrapDayContent,
              checkActiveDay(4) ? {backgroundColor: Colors.inboxSend} : {},
            ]}
            onPress={() => handleChange(4)}
            disabled={props.disabled}
          >
            <Text
              style={[
                styles.textDay,
                checkActiveDay(4) ? {color: Colors.orange} : {},
              ]}
            >
              TH
            </Text>
          </TouchableOpacity>
        </BoxShadow>
        <BoxShadow style={[styles.wrapDay]}>
          <TouchableOpacity
            style={[
              styles.wrapDayContent,
              checkActiveDay(5) ? {backgroundColor: Colors.inboxSend} : {},
            ]}
            onPress={() => handleChange(5)}
            disabled={props.disabled}
          >
            <Text
              style={[
                styles.textDay,
                checkActiveDay(5) ? {color: Colors.orange} : {},
              ]}
            >
              FR
            </Text>
          </TouchableOpacity>
        </BoxShadow>
        <BoxShadow style={[styles.wrapDay]}>
          <TouchableOpacity
            style={[
              styles.wrapDayContent,
              checkActiveDay(6) ? {backgroundColor: Colors.inboxSend} : {},
            ]}
            onPress={() => handleChange(6)}
            disabled={props.disabled}
          >
            <Text
              style={[
                styles.textDay,
                checkActiveDay(6) ? {color: Colors.orange} : {},
              ]}
            >
              SA
            </Text>
          </TouchableOpacity>
        </BoxShadow>
        <BoxShadow style={[styles.wrapDay]}>
          <TouchableOpacity
            style={[
              styles.wrapDayContent,
              checkActiveDay(0) ? {backgroundColor: Colors.inboxSend} : {},
            ]}
            onPress={() => handleChange(0)}
            disabled={props.disabled}
          >
            <Text
              style={[
                styles.textDay,
                checkActiveDay(0) ? {color: Colors.orange} : {},
              ]}
            >
              SU
            </Text>
          </TouchableOpacity>
        </BoxShadow>
      </View>
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
    flex: 1,
  },
});
