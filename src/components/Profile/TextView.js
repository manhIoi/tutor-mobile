import * as React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
  TextInput,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import IconFeather from 'react-native-vector-icons/Feather';
import MainStyles from '../../theme/MainStyles';
import Styles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';

const width = Dimensions.get('window').width;
const TextView = (props) => {
  return (
    <View style={styles.viewText}>
      <Image source={props.src}
style={styles.image}
resizeMode="contain" />
      <View style={{justifyContent: 'center'}}>
        <Text style={styles.textTittle}>{props.name}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  viewText: {
    flexDirection: 'row',
    marginHorizontal: 15,
    paddingVertical: 10,
    borderBottomColor: '#C0C0C0',
    borderBottomWidth: 1,
    marginVertical: 5,
  },
  image: {
    width: 25,
    height: 25,
  },
  viewTitle: {justifyContent: 'center'},
  textTittle: {fontSize: ConfigStyle.customeTitle1, marginLeft: 15},
});
export default TextView;
