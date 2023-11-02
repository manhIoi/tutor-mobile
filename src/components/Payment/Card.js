import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Image} from 'react-native';
import {CheckBox} from 'react-native-elements';
import MainStyles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';
import InputForm from './Input';
import ViString from '../../theme/ViString';
import BoxShadow from '../common/BoxShadow';

const Card = (props) => {
  return (
    <BoxShadow style={{marginHorizontal: 14}}>
      {props.data.map((val, index) => {
        return (
          <View style={{flexDirection: 'column'}}>
            <View
              style={{flexDirection: 'row', marginVertical: 4}}
              key={index.toString()}
            >
              <TouchableOpacity
                onPress={() => {
                  props?.onChange(val.nameBanking, 'nameBank');
                  props?.onChange(val.codeBank, 'codeName');
                }}
              >
                <CheckBox
                  checkedIcon={
                    <Image
                      source={require('../../assets/images/iconTick.png')}
                      style={{width: 14, height: 14}}
                      resizeMode="contain"
                    />
                  }
                  uncheckedIcon={
                    <Image
                      source={require('../../assets/images/iconUnChecked.png')}
                      style={{width: 14, height: 14}}
                      resizeMode="contain"
                    />
                  }
                  checked={val.checked}
                  onPress={() => {
                    props.action(props.data, val.id, props.setData);
                    props.footer();
                  }}
                />
              </TouchableOpacity>
              <View style={{justifyContent: 'center'}}>
                <Image source={val.image} />
              </View>
              <TouchableOpacity
                style={{justifyContent: 'center'}}
                onPress={() => {
                  props.action(props.data, val.id, props.setData);
                  props?.onChange(val.nameBanking, 'nameBank');
                  props?.onChange(val.codeBank, 'codeName');
                  // props.actionStatus(props.data, val.id, props.setData);
                  props.footer();
                }}
              >
                <Text numberOfLines={1}
style={styles.name}>
                  {val.codeBank}
                </Text>
              </TouchableOpacity>
            </View>
            {val?.checked ? (
              <View style={{marginLeft: 60}}>
                <InputForm
                  name="numberIdentification"
                  label="Nhập số tài khoản"
                  required={true}
                  msgError={props?.form?.numberIdentification?.msgError}
                  value={props?.form.numberIdentification.value}
                  actions={props?.onChange}
                  number={'numeric'}
                  //  icon={true}
                />
                <InputForm
                  name="fullName"
                  label="Nhập tên tài khoản"
                  required={true}
                  autoCapitalize={true}
                  msgError={props?.form.fullName.msgError}
                  value={props?.form.fullName.value}
                  actions={props?.onChange}
                  //  icon={true}
                />
              </View>
            ) : null}
          </View>
        );
      })}
    </BoxShadow>
  );
};
const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    paddingVertical: 5,
    elevation: 10,
    backgroundColor: Colors.whiteColor,
    shadowOffset: {width: 5, height: 5},
    textShadowColor: '#00000029',
    shadowOpacity: 0.5,
    textShadowRadius: 0.9,
    marginTop: 5,
    flexDirection: 'column',
    marginHorizontal: 14,
    marginVertical: 20,
    flex: 1,
  },
  name: {
    fontSize: ConfigStyle.font16,
    color: Colors.black4,
    ...MainStyles.textBold,
    marginLeft: 18,
  },
});
export default Card;
