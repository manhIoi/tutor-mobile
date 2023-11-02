import React, {useEffect, useState} from 'react';
import PropsTypes from 'prop-types';
import {Platform, StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import ActionSheet from 'react-native-actionsheet';
import Styles from '../../theme/MainStyles';

const CustomActionSheet = (props) => {
  const actionSheetRef = React.useRef();
  const [actionSheet, setActionSheet] = useState([]);
  useEffect(() => {
    if (Array.isArray(props.arrayActions) && props.arrayActions.length) {
      if (Platform.OS === 'android') {
        const arr = [];
        props.arrayActions.map((item, index) => {
          if (index + 1 !== props.arrayActions.length) {
            arr.push(<Text style={Styles.sheetActionText1}>{item}</Text>);
          } else {
            arr.push(<Text style={Styles.sheetActionText2}>{item}</Text>);
          }
        });
        setActionSheet(arr);
      } else {
        setActionSheet(props.arrayActions || []);
      }
    }
  }, []);
  useEffect(() => {
    if (props.shouldShow) {
      actionSheetRef?.current.show();
    }
  }, [props.shouldShow]);
  return (
    <ActionSheet
      ref={actionSheetRef}
      title={
        !props.title ? null : Platform.OS === 'android' ? (
          <Text style={Styles.titleActionSheet}>{props.title}</Text>
        ) : (
          props.title
        )
      }
      message={
        props.message ? (
          Platform.OS === 'android' ? (
            <Text
              style={{
                ...Styles.textGrey,
                marginHorizontal: 20,
              }}
              numberOfLines={2}
            >
              {props.message}
            </Text>
          ) : (
            props.message
          )
        ) : null
      }
      options={actionSheet}
      cancelButtonIndex={props.cancelButtonIndex}
      destructiveButtonIndex={props.destructiveButtonIndex}
      onPress={(index) => props.actionSheetOnPress(index)}
    />
  );
};
CustomActionSheet.prototype = {
  title: PropsTypes.string,
  arrayActions: PropsTypes.string,
  actionSheetOnPress: PropsTypes.func,
  shouldShow: PropsTypes.number,
  message: PropsTypes.string,
  destructiveButtonIndex: PropsTypes.number,
  cancelButtonIndexprops: PropsTypes.number,
};
export default CustomActionSheet;
const styles = StyleSheet.create({});
