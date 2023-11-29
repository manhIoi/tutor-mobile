import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {View, StyleSheet, StatusBar} from 'react-native';
import PropsTypes from 'prop-types';
import ConfigStyle from '../../theme/ConfigStyle';
import {getStatusBarHeight} from '../../utils/ScaleAdaptor';
import ModalFilter from './ModalFilter';
import ModalSearch from './ModalSearch';
import {useSelector} from "react-redux";

const statusBarHeight = 0;
const Filter = (props) => {

  return (
    <Modal
      isVisible={props.showFilter || props.showSearch}
      onBackdropPress={props.hideModalFilter}
      backdropOpacity={ConfigStyle.backdropOpacity}
      style={styles.modal}
    >
      <View style={{...styles.container, marginTop: statusBarHeight}}>
        {props.showSearch && !props.showFilter ? (
          <ModalSearch
            autoFocus={props.autoFocus}
            hideModalSearch={props.hideModalSearch}
            iconRight={props.iconRight}
            handleSubmitSearch={(value) => {
              props.handleFilter({ subject: value })
            }}
          />
        ) : null}
        {props.showFilter ? (
          <ModalFilter
            hideModalFilter={props.hideModalFilter}
            onSearch={(e) => props.onSearch(e.nativeEvent.text)}
            iconRight={props.iconRight}
            textSearch={props?.dataFilter?.text}
            dataFill={props.dataFilter}
            handleChangeForm={props.handleChangeForm}
            handleFilter={props.handleFilter}
          />
        ) : null}
      </View>
    </Modal>
  );
};

Filter.prototype = {
  show: PropsTypes.bool.isRequired,
  hideModalFilter: PropsTypes.func,
};
export default Filter;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#fff',
  },
  modal: {
    justifyContent: 'flex-start',
    marginTop: 2,
  },
});
