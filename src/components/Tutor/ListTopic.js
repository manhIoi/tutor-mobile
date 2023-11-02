import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import Styles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';

const ListTopics = (props) => {
  return (
    <View style={{marginBottom: 10}}>
      <Text style={[Styles.title2RS, Styles.textNormal, {marginVertical: 7}]}>
        Chủ đề dạy
      </Text>
      <View style={[Styles.flexRow, {flexWrap: 'wrap'}]}>
        {props.data?.map((item, index) => (
          <Text
            key={index}
            style={{
              ...Styles.textBlack3,
              ...styles.wrapText,
              ...Styles.textLight,
            }}
          >
            {item?.name}
          </Text>
        ))}
      </View>
    </View>
  );
};
export default ListTopics;
const styles = StyleSheet.create({
  wrapText: {
    fontSize: 13,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: Colors.inboxSend,
    marginRight: 5,
    marginVertical: 5,
    borderRadius: 5,
  },
});
