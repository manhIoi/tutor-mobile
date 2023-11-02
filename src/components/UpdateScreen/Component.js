import * as React from 'react';
import {StyleSheet, View, Image, Text, Dimensions} from 'react-native';
import ConfigStyle from '../../theme/ConfigStyle';

const width = Dimensions.get('window').width;

export default function Component(props) {
  return (
    <View style={styles.bgImage}>
      <Image
        source={require('../../assets/images/Nerd-01.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.textView}>{props.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    marginTop: 50,
  },
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
