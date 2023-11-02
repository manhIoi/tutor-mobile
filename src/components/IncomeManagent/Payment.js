import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Text, CheckBox} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Styles from '../../theme/MainStyles';
import ConfigStyle from '../../theme/ConfigStyle';
import Colors from '../../theme/Colors';
import ItemFee from './ItemFee';

export default function Payment(props) {
  // const [selected, setSelected] = useState([]);
  const {action} = props;
  useEffect(() => {
    if (props.checked) {
      // props.onSelect(props.DATA?._id);
    }
  }, [props.checked]);
  return (
    <View style={styles.container}>
      <View>
        <Text> Số dư hiện tại</Text>
      </View>
      <ItemFee
        data={props?.DATA}
        selected={props.selected}
        navigation={props.navigation}
        checked={props.checked}
        action={action}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    paddingHorizontal: 16,
    // marginTop: 80,
  },
  linearGradient: {
    borderRadius: 13,
  },
  buttonText: {
    paddingHorizontal: 47,
    paddingVertical: 4,
  },
  textPurchase: {
    fontSize: ConfigStyle.font14,
    color: Colors.whiteColor,
  },
  footerContainer: {
    backgroundColor: Colors.whiteColor,
    shadowColor: '#dcdbdb',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 200,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
