import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {View, StyleSheet, StatusBar} from 'react-native';
import PropsTypes from 'prop-types';
import ConfigStyle from '../../theme/ConfigStyle';
import {getStatusBarHeight} from '../../utils/ScaleAdaptor';
import ModalFilter from './ModalFilter';
import ModalSearch from './ModalSearch';

const Filter = (props) => {
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const [tab, setTab] = useState(0);
  useEffect(() => {
    setTab(props.tab);
    if (Platform.OS === 'android') {
      // setStatusBarHeight(StatusBar.currentHeight);
    } else {
      setStatusBarHeight(getStatusBarHeight(true));
    }
    StatusBar.setBackgroundColor('rgba(0,0,0,0.5)');
    return () => {
      StatusBar.setBackgroundColor('transparent');
    };
  }, []);

  function changeTab(value) {
    setTab(value);
  }
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
            // show={showModalSearch}
            autoFocus={props.autoFocus}
            shouldSearch={props.shouldSearch}
            hideModalSearch={props.hideModalSearch}
            onSearch={(e) => props.onSearch(e.nativeEvent.text)}
            iconRight={props.iconRight}
            tab={tab}
            dataFilter={props.dataFilter}
            changeTab={changeTab}
            textSearch={props?.dataFilter?.text}
            navigation={props.navigation}
          />
        ) : null}
        {props.showFilter ? (
          <ModalFilter
            // show={showFilter}
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
