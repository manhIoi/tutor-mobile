import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-elements';
import ConfigStyle from '../../theme/ConfigStyle';
import Colors from '../../theme/Colors';

export default function ItemHistories(props) {
  const data = {
    id: 1,
    infor: 'Đóng học phí lớp toán cao cấp',
    date: '12/1',
    status: 'Thành công',
    money: '-1.000.000đ',
  };
  return (
    <TouchableOpacity
      style={styles.parentContainer}
      //   onPress={() => props.navigation.navigate('FeeManagement')}
    >
      <View style={styles.itemContainer}>
        <View style={styles.circleContainer}>
          <View style={styles.cirleIcon} />
        </View>
        <View style={styles.infor}>
          <Text style={styles.textInfor}>{data.infor}</Text>
          <Text style={styles.textNumber}>{data.date}</Text>
          <Text style={styles.textSuccess}>{data.status}</Text>
        </View>
      </View>
      <View style={styles.cash}>
        <Text style={styles.textPurchase}>{data.money}</Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  parentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.blackborder,
    marginHorizontal: 19,
    marginTop: 7,
  },
  itemContainer: {flexDirection: 'row'},
  infor: {marginLeft: 15},
  circleContainer: {
    justifyContent: 'center',
  },
  cirleIcon: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    borderWidth: 1,
    borderColor: Colors.blackborder,
  },
  cash: {
    justifyContent: 'flex-end',
  },
  textInfor: {
    fontSize: ConfigStyle.font12,
    color: Colors.black4,
  },
  textNumber: {
    fontSize: ConfigStyle.font10,
    color: Colors.greyBold,
    marginVertical: 5,
  },
  textSuccess: {
    paddingBottom: 7,
    color: Colors.greenBold,
    fontSize: ConfigStyle.font10,
  },
  textPurchase: {
    paddingBottom: 7,
    fontSize: ConfigStyle.font10,
    color: Colors.greyBold,
  },
});
