import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import PropTypes from 'prop-types';
import {Text} from 'react-native-elements';
import Styles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';
import BackgroundGradient from './BackgroudGradient';

const SwitchTab = (props) => {
  return (
    <View style={styles.container}>
      {props?.tabLabels.map((tabLabel, index) => (
        <TouchableWithoutFeedback
          key={index}
          onPress={() => (props.tab !== index ? props.changeTab(index) : null)}
        >
          {props.tab === index ? (
            <BackgroundGradient style={styles.wrapLinear}>
              <View style={[styles.tab]}>
                <Text style={[styles.textTab, styles.textActive]}>
                  {tabLabel}
                </Text>
              </View>
            </BackgroundGradient>
          ) : (
            <View style={[styles.tab]}>
              <Text style={[styles.textTab, Styles.textGrey]}>{tabLabel}</Text>
            </View>
          )}
        </TouchableWithoutFeedback>
      ))}
    </View>
  );
};

SwitchTab.prototype = {
  tab: PropTypes.number,
  changeTab: PropTypes.func,
  tabLabels: PropTypes.array,
};
export default SwitchTab;

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 50,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 777,
  },
  tab: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 50,
  },
  wrapLinear: {
    borderRadius: 50,
  },
  textActive: {
    color: Colors.whiteColor,
  },
  textTab: {
    fontSize: 11,
  },
});
