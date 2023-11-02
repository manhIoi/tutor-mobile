import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import ConfigStyle from '../../theme/ConfigStyle';
import TopicHeader from './TopicHeader';
import Card from './Card';
import Styles from '../../theme/MainStyles';

const Form = (props) => {
  function handleChange() {
    if (!props.isBusy) {
      if (props.showBox) {
        props.setShowBox(false);
      } else {
        props.setShowBox(true);
      }
    }
  }
  const filterArr = (data, index) => {
    return data
      .filter(function (val) {
        return val._id === index;
      })
      .map(function (v) {
        return v.name;
      });
  };
  const RenderItem = ({selected, data}) => {
    return selected.map((v, index) =>
      !props.isBusy ? (
        <Text key={index}
style={{...styles.topicText, ...Styles.textLight}}>
          {filterArr(data, v)}
        </Text>
      ) : null,
    );
  };
  return (
    <View>
      <View
        style={{
          marginHorizontal: 17,
          marginTop: 30,
        }}
      >
        <TopicHeader title={props.title}
number={props.number} />
        <View style={styles.topicWrap}>
          <RenderItem selected={props?.selected}
data={props?.data} />
        </View>
        <TouchableOpacity
          onPress={() => {
            handleChange();
          }}
          style={{marginHorizontal: 5}}
        >
          <Image
            source={require('../../assets/images/iconNote.png')}
            style={styles.image}
          />
          <View style={styles.dropdownTitle}>
            <Text
              style={{
                justifyContent: 'center',
                bottom: 5,
                fontSize: ConfigStyle.title3,
              }}
            >
              {props.title}
            </Text>
            {props.showBox ? (
              <Icon
                name="down"
                style={{color: 'black', position: 'absolute', right: 0}}
              />
            ) : (
              <Icon
                name="right"
                style={{color: 'black', position: 'absolute', right: 0}}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
      {props.showBox ? (
        <Card
          list={props.data}
          selected={props.selected}
          handleChange={props.handleChange}
          setShowBox={props.setShowBox}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  topicText: {
    paddingHorizontal: ConfigStyle.btnPaddingHorizontal,
    marginVertical: 5,
    backgroundColor: '#FFEDDD',
    marginRight: 8,
    borderRadius: 5,
    paddingVertical: 2,
    overflow: 'hidden',
  },

  dropdownTitle: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingLeft: 30,
    fontSize: ConfigStyle.title3,
  },
  image: {
    width: 20,
    height: 20,
    position: 'absolute',
    left: 0,
    bottom: 5,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicWrap: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
});
export default Form;
