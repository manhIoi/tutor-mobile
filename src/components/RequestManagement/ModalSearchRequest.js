import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {View, StyleSheet, ScrollView, FlatList, StatusBar} from 'react-native';
import PropsTypes from 'prop-types';
import InputSearch from '../common/InputSearch';
import IconCustom from '../common/IconCustom';
import ImagesUtil from '../../utils/images.util';
import ConfigStyle from '../../theme/ConfigStyle';
import {getStatusBarHeight} from '../../utils/ScaleAdaptor';
import ItemCourseRequest from './ItemCourseRequest';

const ModalSearchRequest = (props) => {
  const [statusBarHeight, setStatusBarHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS === 'android') {
      // setStatusBarHeight(StatusBar.currentHeight);
    } else {
      setStatusBarHeight(getStatusBarHeight(true));
    }
    StatusBar.setBackgroundColor('rgba(0,0,0,0.5)');
    return () => {
      StatusBar.setBackgroundColor('rgba(255,0,0,0)');
    };
  }, []);

  return (
    <Modal
      isVisible={props.show}
      onBackdropPress={props.hideModalSearch}
      backdropOpacity={ConfigStyle.backdropOpacity}
      style={styles.modal}
    >
      <View style={{...styles.container, marginTop: statusBarHeight}}>
        <View style={styles.searchBar}>
          <View style={styles.controlGroup}>
            <InputSearch
              iconRight={props.iconRight}
              onSearch={props.onSearch}
              textSearch={props.textSearch}
              autoFocus={props.autoFocus}
            />
          </View>
        </View>
        <ScrollView style={styles.results}>
          <FlatList
            data={[1, 2, 3, 4]}
            renderItem={({item, index}) => <ItemCourseRequest data={item} />}
            keyExtractor={(item) => item.toString}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};

ModalSearchRequest.prototype = {
  show: PropsTypes.bool.isRequired,
  hideModalSearch: PropsTypes.func,
};
export default ModalSearchRequest;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#fff',
  },
  modal: {
    justifyContent: 'flex-start',
    marginTop: 50,
  },
  searchBar: {
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
  controlGroup: {
    width: '84%',
  },
  results: {
    marginTop: 10,
    marginBottom: 100,
  },
});
