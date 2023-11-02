import * as React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Container from '../../components/common/Container';
import Header from '../../components/Profile/Header';
import ConfigStyle from '../../theme/ConfigStyle';
import Component from '../../components/UpdateScreen/Component';
import StatusBar from '../../components/common/StatusBar';

const width = Dimensions.get('window').width;

export default function ProfileScreen(props) {
  const footer = (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        props.navigation.reset({
          index: 0,
          routes: [{name: 'Profile'}],
        });
      }}
    >
      <Text style={styles.btnText}>XONG</Text>
    </TouchableOpacity>
  );
  return (
    <Container
      footer={footer}
      header={
        <StatusBar
          headerHeight={ConfigStyle.statusBarHeight}
          hideBackground={false}
          arrowBack={false}
        />
      }
      headerHeight={ConfigStyle.statusBarHeight}
    >
      <Component content="Cập nhật thành công" />
    </Container>
  );
}

const styles = StyleSheet.create({
  btnText: {color: '#EE6423', fontSize: 15},
  textView: {
    fontSize: ConfigStyle.title1,
    alignSelf: 'center',
    color: '#333333',
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  button: {
    width: width - 80,
    marginHorizontal: 40,
    borderWidth: 1,
    marginVertical: 25,
    borderColor: '#EE6423',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
