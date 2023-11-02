import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-elements';
import ConfigStyle from '../../theme/ConfigStyle';
import Colors from '../../theme/Colors';
import {formatDDMMYYY} from '../../utils/string.util';

export default function ItemHistory(props) {
  return (
    <TouchableOpacity
      style={
        props?.index + 1 === props.length
          ? styles.parentContainer2
          : styles.parentContainer1
      }
    >
      <View style={styles.itemContainer}>
        <View style={styles.circleContainer}>
          <View style={styles.cirleIcon} />
        </View>
        <View style={styles.infor}>
          <Text style={styles.textInfor}>{props?.data?.activity}</Text>
          <Text style={styles.textNumber}>
            {formatDDMMYYY(props?.createdAt)}
          </Text>
          <Text style={styles.textSuccess}>success</Text>
        </View>
      </View>
      <View style={styles.cash}>
        <Text style={styles.textPurchase}>
          {props?.data.amount.toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  parentContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    marginHorizontal: 19,
    borderBottomColor: Colors.blackborder,
    marginTop: 7,
  },
  parentContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
