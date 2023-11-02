import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import ConfigStyle from '../../theme/ConfigStyle';
import Colors from '../../theme/Colors';

export default function ClassItem({time, date}) {
  return (
    <View style={styles.container}>
      <Text style={styles.textTime}>{time}</Text>
      <Text style={styles.textDate}>{date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 22,
    borderBottomWidth: 1,
    borderColor: Colors.grey,
  },
  textTime: {
    fontSize: ConfigStyle.font14,
    color: Colors.orange,
  },
  textDate: {
    fontSize: ConfigStyle.font14,
    color: Colors.black4,
    marginLeft: 10,
  },
});
