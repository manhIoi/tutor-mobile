import React from 'react';
import {Text} from 'react-native-elements';
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import BackgroundGradient from './BackgroudGradient';
import Styles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';

const ButtonCustom = (props) => {
  return (
    <View style={{borderRadius: 20, ...props.style}}>
      {!props.isBusy && !props.disabled ? (
        <TouchableOpacity
          onPress={props.onPress}
          style={{borderRadius: 20, width: '100%'}}
        >
          {!props.outline ? (
            <BackgroundGradient style={{...styles.wrapBtn, width: '100%'}}>
              <Text
                style={{
                  ...Styles.textWhite,
                  ...styles.textBtn,
                  ...props.textBtn,
                }}
              >
                {props.text}
              </Text>
            </BackgroundGradient>
          ) : (
            <View
              style={{...styles.btnOutline, width: '100%', borderRadius: 20}}
            >
              <Text
                style={{
                  ...styles.textOutline,
                  ...styles.textBtn,
                  ...props.textBtn,
                }}
              >
                {props.text}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <View style={[styles.wrapBtn, styles.wrapBtnLoading, {width: '100%'}]}>
          <Text
            style={{...Styles.textWhite, ...styles.textBtn, ...props.textBtn}}
          >
            {props.text}
          </Text>
          {!props.disabled || props.isBusy ? (
            <View style={styles.wrapSpinner}>
              <ActivityIndicator size="small"
color={Colors.grey2} />
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};

export default ButtonCustom;
const styles = StyleSheet.create({
  wrapFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 0,
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    borderBottomWidth: 0,
    paddingVertical: 9,
  },
  wrapBtn: {
    borderRadius: 15,
  },
  textBtn: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    textAlign: 'center',
  },
  wrapBtnLoading: {
    borderRadius: 15,
    backgroundColor: Colors.grey,
  },
  wrapSpinner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: 'rgba(192,192,192,0.11)',
  },
  textFooter: {
    fontSize: 12,
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: Colors.orange2,
  },
  textOutline: {
    color: Colors.orange2,
  },
});
