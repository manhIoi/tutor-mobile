import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  TextInput,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';

const TopicHeader = (props) => {
  return (
    <View style={styles.topicView}>
      <Text style={styles.topic}>{props.title}</Text>
      {props.number ? (
        <Text style={styles.topicNumber}>({props.number})</Text>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  topicNumber: {
    color: Colors.black4,
    fontSize: ConfigStyle.new_title,
    marginTop: 3,
    marginLeft: 0,
  },
  topic: {
    color: Colors.black4,
    fontSize: ConfigStyle.RF.title2,
    // paddingRight: ConfigStyle.btnPaddingHorizontal,
  },

  topicView: {
    // marginHorizontal: ConfigStyle.marginHorizontal,
    // marginTop: ConfigStyle.marginTop1,
    flexDirection: 'row',
  },
});
export default TopicHeader;
