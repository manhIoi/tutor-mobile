import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {Text} from 'react-native-elements';
import PropsTypes from 'prop-types';
import Styles from '../../theme/MainStyles';
import ConfigStyle from '../../theme/ConfigStyle';

const RenderList = (props) => {
  return (
    <View style={styles.containerList}>
      <View style={styles.wrapTitle}>
        <Text style={Styles.title2RS}>{props.title}</Text>
        {props.viewMore ? (
          <TouchableOpacity
            onPress={props.viewMoreAction ? props.viewMoreAction : null}
          >
            <Text style={styles.viewAll}>Xem tất cả</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View>
        <SafeAreaView style={styles.wrapList}>
          <FlatList
            horizontal={props.type === 'horizontal'}
            showsHorizontalScrollIndicator={props.type !== 'horizontal'}
            data={props.data}
            renderItem={({item}) =>
              React.cloneElement(props.children, {data: item})
            }
            keyExtractor={(item) => item.toString()}
          />
        </SafeAreaView>
      </View>
    </View>
  );
};
RenderList.prototype = {
  title: PropsTypes.string,
  viewMore: PropsTypes.bool,
  viewMoreAction: PropsTypes.func,
  data: PropsTypes.array,
  type: PropsTypes.string, // enum: ['horizontal', 'vertical']
};
export default RenderList;
const styles = StyleSheet.create({
  containerList: {
    marginHorizontal: 15,
    marginTop: 22,
  },
  wrapTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  wrapList: {
    marginTop: 20,
    flexDirection: 'row',
  },
  viewAll: {
    zIndex: 99,
    fontSize: ConfigStyle.RF.text6,
    paddingVertical: 5,
    paddingHorizontal: 3,
  },
});
