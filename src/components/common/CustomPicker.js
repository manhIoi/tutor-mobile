import React, {useEffect, useMemo, useState} from 'react';
import {
  Platform,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Modal, Pressable,
  Dimensions,
  FlatList, TextInput
} from 'react-native';
import {Text} from 'react-native-elements';
import PropsTypes from 'prop-types';
import Colors from '../../theme/Colors';
import ArrowGrey from '../../assets/images/svg/arrow-grey.svg';
import Styles from '../../theme/MainStyles';
import isEqual from 'lodash/isEqual'
import ButtonCustom from './ButtonFooterCustom';
import {searchStringCaseInsensitive} from "../../utils/string.util";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CustomPicker = (props) => {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    if (props.value) {
      const elementPos = props.items
        ?.map(function (x) {
          return x._id || x.dial_code;
        })
        .indexOf(props.value);
      const objectFound = props.items?.[elementPos];
      setSelected(objectFound);
    }
  }, []);

  useEffect(() => {
    if (props.value) {
      const elementPos = props.items
        ?.map(function (x) {
          return x._id || x.dial_code;
        })
        .indexOf(props.value);
      const objectFound = props.items?.[elementPos];
      setSelected(objectFound);
    }
  }, [props.items]);

  useEffect(() => {
    if (props.value !== '') {
      const elementPos = props.items
        ?.map(function (x) {
          return x._id !== undefined ? x._id : x.dial_code || '';
        })
        .indexOf(props.value);
      const objectFound = props.items?.[elementPos];
      setSelected(objectFound);
    }
  }, [props.value]);
  function handleShowModal() {
    setShow(true);
  }
  function handleHideModal() {
    setShow(false);
  }
  function onChange(item) {
    setSelected(item);
    props.onChange(item._id !== undefined ? item._id : item.value);
  }

  return (
    <View style={{...props.wrapStyle}}>
      <TouchableOpacity
        disabled={props.disabled}
        onPress={() => handleShowModal()}
        style={{...styles.containerStyle, ...props.containerStyle}}
      >
        <Text
          style={
            !props?.disabled
              ? {
                  ...styles.textStyle,
                  ...props.textStyle,
                }
              : {
                  ...styles.textStyle,
                  ...props.textStyle,
                  opacity: 0.5,
                }
          }
        >
          {selected?.dial_code || selected?.name || props?.title}
        </Text>
        <ArrowGrey />
      </TouchableOpacity>
      <ModalPicker
          searchable={props?.searchable}
          searchKey={props?.searchKey}
          items={props?.items}
          show={show}
          hideModal={handleHideModal}
          onChange={onChange}
          title={props.title}
      />
    </View>
  );
};

CustomPicker.prototype = {
  items: PropsTypes.array,
  value: PropsTypes.string,
  onChange: PropsTypes.func,
  placeholder: PropsTypes.string,
  wrapStyle: PropsTypes.object,
  containerStyle: PropsTypes.object,
  showArrow: PropsTypes.bool,
  textStyle: PropsTypes.object,
  title: PropsTypes.string,
};
export default CustomPicker;

const ModalPicker = (props) => {
  const { isMultiSelect = false, selectedItems = [], searchable, searchKey, items = [] } = props || {}
  const [searchValue, setSearchValue] = useState('');
  const [selectedIds, setSelectedIds] = useState(selectedItems);

  const _data = useMemo(() => {
    if (!searchable || !searchKey) return items;
    return items?.filter?.(item => searchStringCaseInsensitive(item?.[searchKey], searchValue))
  }, [items, searchable, searchKey, searchValue])

  const _onPress = (item) => {
    if (!isMultiSelect) {
      props.hideModal();
      props.onChange(item);
    } else {
      const indexToRemove = selectedIds.findIndex(_item => isEqual(item,_item));
      if (indexToRemove !== -1) {
        const newList = selectedIds?.filter?.((_item, index) => {
          return index !== indexToRemove;
        })
        setSelectedIds(newList)
      } else {
        setSelectedIds([...selectedIds, item]);
      }
    }
  }
  const renderHeader = () => {
    if (!props.title) return null;
    return (
      <View>
        <Text style={styles.modalText}>{props?.title}</Text>
      </View>
    )
  }

  const renderSearch = () => {
    if (!props?.searchable || !props?.searchKey) return null;
    return (
        <TextInput
            placeholder={"Tìm kiếm"}
            value={searchValue}
            onChangeText={setSearchValue}
            style={{ borderWidth:2, borderColor: Colors.orange2, paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4, }}
        />
    )
  }

  const _renderItem = ({item, index}) => {
    const isSelected = selectedIds?.some?.(_item => isEqual(item, _item));
    if (!isSelected) {
      return (
        <View style={styles.wrapItem}>
          <TouchableOpacity
              style={styles.wrapText}
              onPress={() => {
                _onPress(item)
              }}
          >
            <Text numberOfLines={1}
                  style={styles.text}>
              {item.dial_code || item.name}
            </Text>
          </TouchableOpacity>
      </View>
      )
    }

    return (
      <View style={[styles.wrapItem, { borderRadius: 4, overflow: 'hidden' }]}>
          <TouchableOpacity
              style={[styles.wrapText, { backgroundColor: Colors.orange2 }]}
              onPress={() => {
                _onPress(item)
              }}
          >
            <Text numberOfLines={1}
                  style={[styles.text, { color: Colors.whiteColor }]}>
              {item.dial_code || item.name}
            </Text>
          </TouchableOpacity>
      </View>
    )

  }

  const renderBodyModal = () => {
    return (
      <FlatList
        data={_data}
        renderItem={_renderItem}
        ListEmptyComponent={() => (
          <Text
              numberOfLines={1}
              style={{textAlign: 'center', marginVertical: 20}}
          >
            Không có dữ liệu
          </Text>
        )}
      />
    )
  }

  const renderFooterModal = () => {
    if (!isMultiSelect) return;
    return (
      <View>
        <ButtonCustom text="Xác nhận" onPress={() => {
          props.onChange(selectedIds)
          props.hideModal();
        }}  />
      </View>
    )
  }
  return (
      <View style={styles.centeredView}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.show}
            onRequestClose={props.hideModal}>
          <Pressable style={{ flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' }} onPress={props.hideModal} >
            <View style={styles.modalView}>
              {renderHeader()}
              {renderSearch()}
              {renderBodyModal()}
              {renderFooterModal()}
            </View>
          </Pressable>
        </Modal>
      </View>
  );
};

export { ModalPicker }
const styles = StyleSheet.create({
  containerModal: {
    backgroundColor: Colors.whiteColor,
    height: 300,
    width: 300,
  },
  modal: {},
  wrapText: {
    paddingVertical: 10,
  },
  wrapItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderThin,
  },
  text: {
    fontSize: 12,
    marginHorizontal: 10,
  },

  containerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleModal: {
    textAlign: 'center',
    fontSize: 15,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.black3,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: windowWidth * 0.8,
    maxHeight: windowHeight * 0.6,
    backgroundColor: Colors.whiteColor,
    borderRadius: 4,
    overflow: 'hidden',
    padding:10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    fontSize: 15,
  },
  modalText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    padding: 8,
  },
});
