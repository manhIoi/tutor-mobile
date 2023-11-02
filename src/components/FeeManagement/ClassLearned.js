import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Text} from 'react-native-elements';
import Styles from '../../theme/MainStyles';
import ItemClassLearned from './ItemClassLearned';

export default function ClassLearned(props) {
  return (
    <View style={styles.container}>
      <Text style={[Styles.textBold, styles.title]}>Danh sách lớp đã học</Text>
      <FlatList
        data={[1, 2, 3, 4]}
        renderItem={({item, index}) => (
          <ItemClassLearned
            data={item}
            containerStyle={{flex: 1, marginBottom: 10}}
            navigation={props.navigation}
          />
        )}
        keyExtractor={(item) => item.toString}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    marginBottom: 15,
    marginTop: 50,
  },
});
