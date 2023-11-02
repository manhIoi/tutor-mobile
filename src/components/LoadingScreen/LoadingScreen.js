import React from 'react';
import {Modal, StatusBar, StyleSheet, View, Text, Button} from 'react-native';
import {Colors} from '../../theme';

const LoadingScreen = () => {
  return (
    <Modal>
      <StatusBar
        animated={true}
        translucent={false}
        barStyle="light-content"
        backgroundColor={Colors.primary}
      />
      <View style={styles.loading}>
        <Text style={styles.logo}>THE GIOI GIA SU</Text>
        <Button type="clear"
loading />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    color: Colors.tintColor,
    fontSize: 32,
  },
});

export default LoadingScreen;
