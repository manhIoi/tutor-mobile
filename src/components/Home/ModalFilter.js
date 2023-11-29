import React, {useEffect, useMemo, useState} from 'react';
import Modal from 'react-native-modal';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {Text} from 'react-native-elements';
import PropsTypes from 'prop-types';
import InputSearch from '../common/InputSearch';
import Styles from '../../theme/MainStyles';
import SelectBox from './SelectBox';
import BackgroundGradient from '../common/BackgroudGradient';
import IconLocation from '../../assets/images/svg/location.svg';

const ModalFilter = (props) => {
  const listDob = useMemo(() => {
    let arr = [];
    for (let i = 1945; i <= 2023; i++) {
      arr.push({ name: `Năm ${i}`, value: i.toString() });
    }
    return arr;
  }, [])

  return (
    <View>
      <View style={{...styles.searchBar, ...props.searchBar}}>
        <View style={{...styles.controlGroup, ...props.controlGroup}}>
          <InputSearch
            iconRight={props.iconRight}
            onSearch={props.onSearch}
            textSearch={props.textSearch}
          />
        </View>
        <View style={styles.iconNoti}></View>
      </View>
      <View style={styles.filterGroup}>
        <View>
          <SelectBox
            placeholder={'Năm sinh'}
            data={listDob}
            svg={<IconLocation width={16.27}
height={16} />}
            value={props.dataFill.dob.value}
            handleChange={(value) => {
              props.handleChangeForm('dob', value)
            }}
          />
        </View>
        <View style={styles.wrapBtn}>
          <TouchableOpacity onPress={props.handleFilter}>
            <BackgroundGradient style={{...Styles.wrapBtn, height: 26}}>
              <Text style={[Styles.textWhite, styles.textBtn]}>OK</Text>
            </BackgroundGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

ModalFilter.prototype = {
  show: PropsTypes.bool.isRequired,
  hideModalFilter: PropsTypes.func,
};
export default ModalFilter;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#fff',
  },
  modal: {
    justifyContent: 'flex-start',
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  controlGroup: {
    width: '84%',
  },
  filterGroup: {
    backgroundColor: '#fff',
    marginTop: 8,
    borderRadius: 8,
    paddingHorizontal: 27,
    paddingVertical: 27,
  },
  wrapBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 25,
  },
  textBtn: {
    fontSize: 15,
    paddingHorizontal: 27,
    paddingVertical: 5,
  },
  btn: {
    // height: 30
  },
  wrapInput: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    borderBottomColor: '#C0C0C0',
    borderBottomWidth: 1,
    marginBottom: 15,
    height: 35,
  },
  imageWorld: {
    width: 18.4,
    height: 18.4,
    // position: 'absolute',
  },
  input: {
    marginLeft: 20,
    width: 100,
    height: 40,
    paddingTop: 10,
    marginTop: 5,
  },
});
