import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import {Text, CheckBox} from 'react-native-elements';
import ConfigStyle from '../../theme/ConfigStyle';
import InputSearch from '../common/InputSearch';
import SelectBox from '../Home/SelectBox';
import IconLocation from '../../assets/images/svg/location.svg';
import IconWorld from '../../assets/images/svg/world.svg';
import IconEmployee from '../../assets/images/svg/employee.svg';
import IconLecture from '../../assets/images/svg/lecture.svg';
import IconBook from '../../assets/images/svg/open-magazine.svg';
import IconNotes from '../../assets/images/svg/notes.svg';
import IconBoard from '../../assets/images/svg/board.svg';
import BackgroundGradient from '../common/BackgroudGradient';
import Styles from '../../theme/MainStyles';
import IconFill from '../../assets/images/svg/icon-fill.svg';
import IconChecked from '../../assets/images/svg/iconRadio2.svg';
import IconUnChecked from '../../assets/images/svg/iconRadio.svg';
import Constants from '../../../constants/Values';
import {getStatusBarHeight} from '../../utils/ScaleAdaptor';

const ModalFilter = (props) => {
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const [status, setStatus] = useState(props?.status);
  const [textString, setTextString] = useState(props?.textSearch);
  // const [data, setData] = useState({})
  const [list, setList] = useState({});
  useEffect(() => {
    setList(props?.data);
  }, [props?.data]);
  function handleChangeChecked(index, value = '') {
    list.map((item) => {
      item.id === index
        ? setList([...list], (list[item.id].checked = true))
        : (list[item.id].checked = false);
    });
    setStatus(value);
  }
  function handleText(val) {
    console.log(val);
    setTextString(val);
    props?.action(status, val);
  }
  const Item = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{flexDirection: 'row'}}
        key={item.id.toString()}
        onPress={() => {
          handleChangeChecked(index, item.value);
        }}
      >
        <CheckBox
          size={16}
          containerStyle={{marginTop: -8}}
          checkedIcon={<IconChecked width={'16'}
height={'16'} />}
          uncheckedIcon={<IconUnChecked width={'16'}
height={'16'} />}
          checked={item.value === status}
          disabled={true}
        />
        <Text style={{fontSize: 14}}>{item.status}</Text>
      </TouchableOpacity>
    );
  };
  const iconRight = (
    <TouchableOpacity style={styles.wrapIconRight}>
      <View style={styles.iconFilter}>
        <IconFill width={12.6}
height={18} />
      </View>
    </TouchableOpacity>
  );
  useEffect(() => {
    if (props.show) {
      StatusBar.setBackgroundColor('rgba(0,0,0,0.5)');
    } else {
      StatusBar.setBackgroundColor('rgba(255,0,0,0)');
    }
    return () => {
      StatusBar.setBackgroundColor('rgba(255,0,0,0)');
    };
  }, [props.show]);
  useEffect(() => {
    if (Platform.OS === 'android') {
      // setStatusBarHeight(StatusBar.currentHeight);
    } else {
      setStatusBarHeight(getStatusBarHeight(true));
    }
  }, []);
  return (
    <Modal
      isVisible={props.show}
      onBackdropPress={props.hideModalFilter}
      backdropOpacity={ConfigStyle.backdropOpacity}
      style={styles.modal}
    >
      <View
        style={{
          ...styles.container,
          marginTop: statusBarHeight,
        }}
      >
        <View style={styles.searchBar}>
          <View style={styles.controlGroup}>
            <Text
              style={{
                ...Styles.title1RS,
              }}
            >
              {' '}
            </Text>
            <InputSearch
              iconRight={iconRight}
              onSearch={props.onSearch}
              textSearch={props?.textSearch}
              Search={handleText}
              isSearch={true}
            />
          </View>
        </View>
        <View style={styles.filterGroup}>
          <View>
            <View style={{flexDirection: 'row'}}>
              <View style={{...styles.wrapInput, top: -5}}>
                <IconLocation width={'20%'}
height={'80%'} />
                <Text style={{fontSize: 14, marginHorizontal: 10}}>
                  Tình trạng
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'flex-start',
                  marginHorizontal: 20,
                  flexDirection: 'column',
                }}
              >
                <FlatList
                  data={list}
                  renderItem={({item, index}) => (
                    <Item item={item}
index={index} />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>
          </View>
          <View style={styles.wrapBtn}>
            <TouchableOpacity
              onPress={() => {
                props.action(status, textString);
                props.hideModalFilter();
              }}
            >
              <BackgroundGradient style={{...Styles.wrapBtn, height: 26}}>
                <Text style={[Styles.textWhite, styles.textBtn]}>OK</Text>
              </BackgroundGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#fff',
    width: '98%',
  },
  modal: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
  controlGroup: {
    width: '83%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterGroup: {
    backgroundColor: '#fff',
    marginTop: 12,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    height: 30,
    width: 100,
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
  iconFilter: {
    width: 12,
    height: 18,
    marginRight: 15,
  },
});
export default ModalFilter;
