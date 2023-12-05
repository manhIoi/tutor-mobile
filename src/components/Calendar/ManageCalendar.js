import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-elements';
import {useSelector} from 'react-redux';
import IconRegistry from '../../assets/images/svg/manage-registry.svg';
import IconRequirement from '../../assets/images/svg/manage-requirement.svg';
import IconClass from '../../assets/images/svg/manage-class.svg';
import IconWallet from '../../assets/images/svg/manage-wallet.svg';
import Colors from '../../theme/Colors';

const ManageCalendar = (props) => {
  const user = useSelector((state) => state.auth.user);
  return (
    <View style={styles.container}>
      <View style={styles.itemContent}>
        <TouchableOpacity
          style={styles.wrapIcon}
          onPress={() => {
              props.navigation.navigate('ManageRegistry');
          }}
        >
          <IconRegistry width={props.access ? '100%' : '75%'} />
        </TouchableOpacity>
          <Text style={styles.textDetail}>Quản lý{'\n'}đăng ký</Text>
      </View>
      <View style={styles.itemContent}>
        <TouchableOpacity
          style={styles.wrapIcon}
          onPress={() => {
              props.navigation.navigate('RequestManagement');
          }}
        >
          <IconRequirement width={props.access ? '100%' : '75%'} />
        </TouchableOpacity>
        <Text numberOfLines={2}
style={styles.textDetail}>
          Quản lý{'\n'}yêu cầu
        </Text>
      </View>
    </View>
  );
};

export default ManageCalendar;

const styles = StyleSheet.create({
  container: {
    margin: 16,
    backgroundColor: '#FFB02C',
    // paddingHorizontal: 7,
    paddingVertical: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  itemContent: {
    alignItems: 'center',
    flex: 1,
  },
  textDetail: {
    color: Colors.whiteColor,
    textAlign: 'center',
  },
  wrapIcon: {
    width: '100%',
    alignItems: 'center',
    height: 85,
  },
});
