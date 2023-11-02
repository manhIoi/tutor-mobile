import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';
import BackgroundGradient from '../common/BackgroudGradient';
import BoxShadow from '../common/BoxShadow';

const Card = (props) => {
  const RenderItemSubject = (props) => {
    const {item} = props;
    return (
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => {
          props.handleChange(item._id);
        }}
      >
        <Text style={styles.topicName}>{item.name}</Text>
        <CheckBox
          checked={props.selected?.indexOf(item._id) !== -1}
          onPress={() => props.handleChange(item._id)}
          checkedIcon={
            <FastImage
              style={{width: 14, height: 14}}
              source={require('../../assets/images/iconChecked.png')}
              resizeMode={FastImage.resizeMode.contain}
            />
          }
          uncheckedIcon={
            <FastImage
              style={{width: 14, height: 14}}
              source={require('../../assets/images/IconUntick.png')}
              resizeMode={FastImage.resizeMode.contain}
            />
          }
        />
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <BoxShadow style={styles.card}>
        <ScrollView>
          <FlatList
            data={props.list}
            renderItem={({item, index}) => {
              return (
                <RenderItemSubject
                  item={item}
                  selected={props.selected}
                  handleChange={props.handleChange}
                />
              );
            }}
            contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
            keyExtractor={(item) => item.id}
          />
        </ScrollView>
        <TouchableOpacity
          style={styles.btnOk}
          onPress={() => {
            props.setShowBox(false);
          }}
        >
          <BackgroundGradient style={{borderRadius: 30}}>
            <Text style={styles.btnTitle}>OK</Text>
          </BackgroundGradient>
        </TouchableOpacity>
      </BoxShadow>
    </View>
  );
};
const styles = StyleSheet.create({
  checkbox: {
    position: 'absolute',
    right: -20,
    justifyContent: 'center',
    // top: -15,
  },
  topicName: {
    color: Colors.black3,
    fontSize: ConfigStyle.title4,
    justifyContent: 'center',
    // marginTop:10
    alignItems: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
  },
  btnTitle: {
    color: Colors.whiteColor,
    textAlign: 'center',
    fontSize: ConfigStyle.title3,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  btnOk: {
    // backgroundColor: Colors.orange,
    marginTop: 5,
    width: 80,
    // padding: 10,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    right: 15,
    // bottom:15,
    borderRadius: 20,
  },
  card: {
    borderRadius: 10,
    backgroundColor: '#fff',
    marginTop: 10,
    paddingVertical: 10,
    paddingLeft: 15,
    marginHorizontal: ConfigStyle.btnMarginHorizontal,
    flexDirection: 'column',
    maxHeight: 300,
    marginBottom: 10,
  },
});
export default Card;
