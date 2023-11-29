import React, {useEffect, useMemo, useState} from 'react';
import Modal from 'react-native-modal';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Text
} from 'react-native';
import PropsTypes from 'prop-types';
import InputSearch from '../common/InputSearch';
import IconCustom from '../common/IconCustom';
import ImagesUtil from '../../utils/images.util';
import Styles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';
import IconClose from '../../assets/images/svg/close.svg';
import {useSelector} from "react-redux";

const height = Dimensions.get('window').height;
const ModalSearch = (props) => {
  const subjects = useSelector(state => state.subject.value)
  const [ textSearch, setTextSearch ] = useState('')

  const subjectsSearch = useMemo(() => {
    if (textSearch === '') return subjects;
    return subjects.filter(s => {
      return s.name.toLowerCase().includes(textSearch.toLowerCase())
    });
  }, [subjects, textSearch])

  const onSearch = (e) => {
    setTextSearch(e.nativeEvent.text)
  }
  return (
    <View style={{height: 0.95 * height}}>
      <View style={styles.searchBar}>
        <View style={styles.controlGroup}>
          <InputSearch
            iconRight={props.iconRight}
            onSearch={onSearch}
            textSearch={textSearch}
            autoFocus={props.autoFocus}
          />
          <View style={styles.controlTab}>
            <IconCustom
              width={27}
              height={30}
              image={ImagesUtil.iconContact}
              containerStyle={{opacity: 0}}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={props.hideModalSearch}
          style={styles.iconClose}
        >
          <IconClose width={20}
height={20} />
        </TouchableOpacity>
      </View>
      <FlatList
          style={styles.results}
          keyboardShouldPersistTaps="handled"
          data={subjectsSearch}
          keyExtractor={(item) => item._id}
          renderItem={({item}) => <TouchableOpacity activeOpacity={0.95}  onPress={() => props.handleSubmitSearch(item)} style={{ padding: 10, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
            <Text>{item?.name || ''}</Text>
          </TouchableOpacity>}
          ItemSeparatorComponent={() => <View style={{ width:"100%", height: 0.5,  justifyContent: 'center',  backgroundColor: Colors.bluelight }} />}
          onEndReachedThreshold={0.2}
          ListHeaderComponent={<View style={Styles.paddingTop} />}
      />
    </View>
  );
};

ModalSearch.prototype = {
  show: PropsTypes.bool.isRequired,
  hideModalSearch: PropsTypes.func,
};
export default ModalSearch;

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
  controlTab: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    height: 45,
    alignItems: 'center',
  },
  results: {
    // marginBottom: 100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  countResult: {
    textAlign: 'center',
    color: Colors.whiteColor,
    fontSize: 13,
    fontStyle: 'italic',
  },
  iconClose: {
    justifyContent: 'flex-start',
    paddingHorizontal: 5,
    marginTop: 10,
  },
});
