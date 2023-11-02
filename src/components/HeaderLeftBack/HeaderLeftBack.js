import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';

export default function HeaderLeftBack(props) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.iconContainer}>
        <SimpleLineIcons
          name="arrow-left"
          size={HEADER_ICON_SIZE}
          color="#FFF"
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
      <Text style={styles.textContainer}>{props.title}</Text>
      <View style={styles.iconContainer}>
        <View style={styles.iconHide} />
      </View>
    </View>
  );
}
const HEADER_ICON_SIZE = 25;
const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconContainer: {
    paddingHorizontal: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconHide: {
    width: HEADER_ICON_SIZE,
  },
  textContainer: {
    fontSize: ConfigStyle.title1,
    color: Colors.whiteColor,
  },
});
