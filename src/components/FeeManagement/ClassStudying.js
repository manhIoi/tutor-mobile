import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Text, CheckBox} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Styles from '../../theme/MainStyles';
import ItemClassStudying from './ItemClassStudying';
import ConfigStyle from '../../theme/ConfigStyle';
import Colors from '../../theme/Colors';

const ClassStudying = (props) => {
  const [selected, setSelected] = useState([]);
  useEffect(() => {
    if (props.checked) {
      onSelect(DATA[0]);
    }
  }, [props.checked]);
  const DATA = [1, 2, 3, 4];
  function onSelect(id) {
    const currentSelected = JSON.parse(JSON.stringify(selected));
    const index = currentSelected.indexOf(id);
    if (index === -1) {
      currentSelected.push(id);
    } else {
      currentSelected.splice(index, 1);
    }
    setSelected(currentSelected);
  }
  function checkAll() {
    const items = [];
    DATA.map((item) => items.push(item));
    setSelected(items);
  }

  return (
    <View>
      <View style={styles.container}>
        <Text style={[Styles.textBold, styles.title]}>
          Danh sách lớp đang học
        </Text>
        <FlatList
          data={props.DATA}
          renderItem={({item, index}) => (
            <ItemClassStudying
              data={item}
              selected={props.selected}
              onSelect={props.onSelect}
              navigation={props.navigation}
              checked={props.checked}
            />
          )}
          keyExtractor={(item) => item.toString}
        />
      </View>
    </View>
  );
};

export default ClassStudying;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    marginBottom: 15,
    marginTop: 50,
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
