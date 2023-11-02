import React, {useEffect} from 'react';
import {ActivityIndicator, View, StatusBar, StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import Modal from 'react-native-modal';
import Colors from '../../theme/Colors';

const Loading = (props) => {
  // useEffect(() => {
  //   StatusBar.setBackgroundColor('rgba(0,0,0,0.25)')
  //   return () => {
  //     StatusBar.setBackgroundColor('transparent')
  //   }
  // })

  return (
    <Modal style={styles.container}
isVisible={true}
backdropOpacity={0.25}>
      <View style={styles.wrapContent}>
        <ActivityIndicator color={Colors.grey2} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    </Modal>
  );
};
export default Loading;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapContent: {},
  text: {
    color: Colors.whiteColor,
    fontSize: 13,
    marginTop: 2,
  },
});
