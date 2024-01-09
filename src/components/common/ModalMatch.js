import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Text } from 'react-native-elements';
import BoxShadow from './BoxShadow';
import ConfigStyle from '../../theme/ConfigStyle';
import Colors from '../../theme/Colors';
import Styles from '../../theme/MainStyles';
import BackgroudGradient from './BackgroudGradient';
import { useDispatch, useSelector } from 'react-redux';
import { hideApprovePopup } from '../../lib/slices/modalSlice';

const { width, height } = Dimensions.get('window');

const CardModal = (props) => {

  const { approvePopupData } = useSelector(state => state.modal)
  const { title, body, onPress } = approvePopupData || {}
  const dispatch = useDispatch()

  const _hidePopup = () => {
    dispatch(hideApprovePopup());
  }

  const Header = () => {
    return (
      <View>
        <Text style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 10 }} >{title}</Text>
        <BackgroudGradient style={{ height: 1, width: "100%" }} ><View></View></BackgroudGradient>
      </View>
    )
  }

  const Body = () => {
    return (
      <View style={{ paddingVertical: 10 }}>
        <Text style={{ fontSize: 12, marginBottom: 10 }} >{body}</Text>
      </View>
    )
  }

  const Footer = (props) => {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          zIndex: 1,
          marginHorizontal: 20,
          flexDirection: 'row',
        }}
      >
        {props.button1 ? (
          <TouchableOpacity
            style={{
              paddingVertical: 3,
              borderRadius: 20,
              flex: 1,
              marginHorizontal: 2,
              borderWidth: 1,
              borderColor: Colors.orange2,
              justifyContent: 'center',
            }}
            onPress={_hidePopup}
          >
            <Text
              style={{
                textAlign: 'center',
                color: Colors.orange2,
                fontSize: ConfigStyle.font14,
              }}
            >
              {props.title1}
            </Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={{ flex: 1, }}
          onPress={() => {
            _hidePopup();
            onPress?.();
          }}
        >
          <BackgroudGradient
            style={{
              paddingVertical: 6,
              borderRadius: 20,
              marginHorizontal: 2,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: Colors.whiteColor,
                fontSize: ConfigStyle.font14,
              }}
            >
              {props.title2}
            </Text>
          </BackgroudGradient>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ position: 'absolute', width, height, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.25)' }} >
      <View style={styles.viewModal}>
        <View>
          <BoxShadow style={{ ...styles.boxShadow }}>
            <Header />
            <Body />
            <Footer
              button1={true}
              button2={true}
              title1={'Đóng'}
              title2={'Đồng ý'}
            />
            <View></View>
          </BoxShadow>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  danger: {
    color: Colors.red,
    fontSize: ConfigStyle.font14,
  },
  success: {
    color: '#25A053',
    fontSize: ConfigStyle.font14,
    marginRight: 10,
  },
  normal: {
    ...Styles.textLight,
    ...Styles.textBlack3,
    fontSize: 12,
    marginTop: 2,
  },
  viewModal: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:"red"
  },
  boxShadow: {
    paddingHorizontal: 20,
    width: width - 40,
    paddingVertical: 16,
  },
});
export default CardModal;
