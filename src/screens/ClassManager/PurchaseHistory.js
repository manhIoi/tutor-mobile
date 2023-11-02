import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {Text} from 'react-native-elements';
import ConfigStyle from '../../theme/ConfigStyle';
import Colors from '../../theme/Colors';
import ItemHistory from '../../components/FeeManagement/ItemHistory';
import BoxShadow from '../../components/common/BoxShadow';

export default function PurchaseHistory(props) {
  return (
    <View style={styles.container}>
      <View>{/* <Text style={styles.textMonth}>Tháng 1/2020</Text> */}</View>
      <BoxShadow style={styles.shapeContainer}>
        <FlatList
          data={props?.data}
          renderItem={({item, index}) => (
            <ItemHistory
              data={item}
              index={index}
              // navigation={props.navigation}
            />
          )}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={props?.refreshing}
              onRefresh={props?.onRefresh}
              colors={[Colors.orange]}
            />
          }
          ListFooterComponent={props?.renderFooter}
          onEndReachedThreshold={0.4}
          onEndReached={props?.handleLoadMore}
          // keyExtractor={(item) => item.toString}
        />
      </BoxShadow>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {paddingHorizontal: 15},
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
