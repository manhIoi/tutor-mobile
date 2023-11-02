import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import MainStyles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';


const PaymentScreen = (props) => {
  return (
    <TouchableOpacity
      style={styles.accordingHeader}
      onPress={() => {
        props?.onChange(props?.type, 'method');
        props.action(props.click, props.setClick);
      }}
    >
      <View style={{...styles.topicView}}>
        <Text style={styles.topic}>{props.title}</Text>
      </View>
      {props.click ? (
        <Icon name="down"
color={Colors.black4}
size={10} />
      ) : (
        <Icon name="right"
color={Colors.black4}
size={10} />
      )}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  accordingHeader: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 10,
  },
  topicView: {
    flexDirection: 'row',
  },
  topic: {
    color: Colors.black4,
    fontSize: ConfigStyle.font16,
    paddingRight: ConfigStyle.btnPaddingHorizontal,
    ...MainStyles.textBold,
  },
});
export default PaymentScreen;
