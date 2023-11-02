import React, {useEffect, useState} from 'react';
import {
  Platform,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import {Text} from 'react-native-elements';
import PropsTypes from 'prop-types';
import Colors from '../../theme/Colors';
import ArrowGrey from '../../assets/images/svg/arrow-grey.svg';
import Styles from '../../theme/MainStyles';

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
      {show ? (
        <ModalPicker
          items={props.items}
          show={show}
          hideModal={handleHideModal}
          onChange={onChange}
          title={props.title}
        />
      ) : null}
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
  return (
    <Modal
      isVisible={props.show}
      onBackdropPress={props.hideModal}
      backdropOpacity={0.35}
      style={styles.modal}
      animationInTiming={50}
    >
      <View style={styles.containerModal}>
        {props.title ? (
          <Text style={{...Styles.textBold, ...styles.titleModal}}>
            {props.title}
          </Text>
        ) : null}
        <ScrollView>
          {props.items?.length > 0 ? (
            props.items?.map((item, index) => (
              <View style={styles.wrapItem}
key={index}>
                <TouchableOpacity
                  style={styles.wrapText}
                  onPress={() => {
                    props.hideModal();
                    props.onChange(item);
                  }}
                >
                  <Text numberOfLines={1}
style={styles.text}>
                    {item.dial_code || item.name}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text
              numberOfLines={1}
              style={{textAlign: 'center', marginVertical: 20}}
            >
              Không có dữ liệu
            </Text>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  containerModal: {
    backgroundColor: Colors.whiteColor,
    maxHeight: '75%',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: Colors.borderThin,
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
    fontSize: 15,
    marginHorizontal: 10,
  },
  textStyle: {
    fontSize: 15,
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
});
