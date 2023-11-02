import React from 'react';
import {View, StyleSheet, Image, FlatList, ScrollView} from 'react-native';
import {Text} from 'react-native-elements';
import ConfigStyle from '../../theme/ConfigStyle';
import Colors from '../../theme/Colors';
import ItemHistory from "../FeeManagement/ItemHistory";
import ItemHistories from './ItemHistories';

export default function History(props) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.textMonth}>Tháng 1/2020</Text>
      </View>
      <View style={styles.shapeContainer}>
        <FlatList
          data={[1, 2, 3, 4]}
          renderItem={({item, index}) => (
            <ItemHistories data={item}
navigation={props.navigation} />
          )}
          keyExtractor={(item) => item.toString}
        />
      </View>
      <View>
        <Text style={styles.textMonthBelow}>Tháng 12/2020</Text>
      </View>
      <View style={styles.shapeContainer}>
        <FlatList
          data={[1, 2, 3, 4]}
          renderItem={({item, index}) => (
            <ItemHistories data={item}
navigation={props.navigation} />
          )}
          keyExtractor={(item) => item.toString}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: 15},
  textMonth: {fontSize: ConfigStyle.font16, color: Colors.black4},
  shapeContainer: {
    paddingVertical: 10,
    shadowColor: '#C0C0C0',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 5,
    backgroundColor: Colors.whiteColor,
    borderRadius: 10,
    marginTop: 15,
  },
  textMonthBelow: {
    marginTop: 22,
    fontSize: ConfigStyle.font16,
    color: Colors.black4,
  },
});
