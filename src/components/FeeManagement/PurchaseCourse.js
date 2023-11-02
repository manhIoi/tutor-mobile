import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import ConfigStyle from '../../theme/ConfigStyle';
import Colors from '../../theme/Colors';

export default function PurchaseCourse({fee, addfee, totalFee}) {
  return (
    <View style={styles.shapeContainer}>
      <View style={styles.shapeContent}>
        <Text style={styles.textHeader}>Thanh toán học phí</Text>
        <View style={styles.rowFee}>
          <View style={styles.rowText}>
            <Text style={styles.textFee}>Học phí</Text>
            <Text style={styles.unit}>(đ)</Text>
          </View>
          <Text style={styles.textMoney}>{fee}</Text>
        </View>
        <View style={styles.rowFee}>
          <View style={styles.rowText}>
            <Text style={styles.textFee}>Phát sinh</Text>
            <Text style={styles.unit}>(đ)</Text>
          </View>
          <Text style={styles.textMoney}>{addfee}</Text>
        </View>
        <View style={styles.feeFooter}>
          <View style={styles.rowText}>
            <Text style={styles.textFee}>Tổng cộng</Text>
            <Text style={styles.unit}>(đ)</Text>
          </View>
          <Text style={styles.textMoney}>{totalFee}</Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  shapeContainer: {marginTop: 21},
  shapeContent: {
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  textHeader: {
    color: Colors.black4,
    fontSize: ConfigStyle.font20,
  },
  rowFee: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 13,
  },
  textFee: {fontSize: ConfigStyle.font14, color: Colors.grey},
  unit: {color: Colors.grey, fontSize: ConfigStyle.font12},
  rowText: {flexDirection: 'row', alignItems: 'center'},
  textMoney: {fontSize: ConfigStyle.font20, color: Colors.orange},
  feeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 13,
    paddingBottom: 19,
  },
  purchase: {
    backgroundColor: Colors.whiteColor,
    shadowColor: '#C0C0C0',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 5,
    marginTop: 10,
    paddingHorizontal: 23,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  linearGradient: {
    height: 27,
    paddingHorizontal: 47,
    paddingVertical: 4,
    borderRadius: 13,
  },
  textPurchase: {
    fontSize: ConfigStyle.font14,
    color: Colors.whiteColor,
  },
});
