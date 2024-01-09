import React, { useEffect } from 'react';
import { ActivityIndicator, View, StatusBar, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-elements';
import Colors from '../../theme/Colors';

const { width, height } = Dimensions.get("window")

const Loading = (props) => {
  return (
    <View style={styles.container} >
      <View style={styles.wrapContent}>
        <ActivityIndicator color={Colors.grey2} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    </View>
  );
};
export default Loading;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width, height,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  wrapContent: {},
  text: {
    color: Colors.whiteColor,
    fontSize: 13,
    marginTop: 2,
  },
});
