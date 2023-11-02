import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {BoxShadow} from 'react-native-shadow';

import ConfigStyle from '../../theme/ConfigStyle';
import Colors from '../../theme/Colors';
import MainStyles from '../../theme/MainStyles';
// import Svg, { Circle, SvgUri, SvgCssUri } from 'react-native-svg';

const ButtonCustomize = (props) => {
  const handlePress = () => {
    props.onPress();
  };
  const shadowOpt = {
    width: 138,
    height: 50,
    color: props.color || Colors.btnLogin,
    border: 10,
    radius: 20,
    opacity: 0.1,
    x: 0,
    y: 0,
    style: {marginVertical: 0},
  };
  return (
    <View style={styles.wrap}>
      <BoxShadow setting={shadowOpt}>
        <TouchableOpacity
          onPress={handlePress}
          disabled={props.isBusy}
          style={
            props.isBusy ? [styles.viewButtonDisable] : [styles.viewButton]
          }
        >
          {props.isBusy ? (
            <ActivityIndicator
              style={{position: 'absolute', right: 60, zIndex: 99}}
              color={Colors.black2}
            />
          ) : null}
          {props.name && (
            <View style={styles.viewButtonView}>
              <Text
                style={[
                  styles.viewButtonText,
                  MainStyles.textBold,
                  {color: props.color || Colors.btnLogin},
                ]}
              >
                {props.name}
              </Text>
            </View>
          )}
          {props.iconName && (
            <Icon
              name={props.iconName}
              color={props.color || Colors.btnLogin}
              style={styles.viewButtonIcon}
            />
          )}
          {/* <Svg height="50%" width="50%" viewBox="0 0 100 100">
                        <Circle
                            cx="50"
                            cy="50"
                            r="45"
                            stroke="blue"
                            strokeWidth="2.5"
                            fill="green"
                        />
                    </Svg> */}
        </TouchableOpacity>
      </BoxShadow>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    marginBottom: 10,
  },
  viewButton: {
    flexDirection: 'row',
    height: 50,
    minWidth: 138,
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  viewButtonDisable: {
    flexDirection: 'row',
    height: 50,
    minWidth: 138,
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRadius: 50,
    backgroundColor: '#ECEBEB',
    justifyContent: 'center',
  },
  viewButtonView: {
    flex: 1,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: ConfigStyle.title4,
    textTransform: 'uppercase',
  },
  viewButtonIcon: {
    fontSize: ConfigStyle.title2,
    //  marginRight: 17,
  },
});

ButtonCustomize.propTypes = {
  onPress: PropTypes.func.isRequired,
  name: PropTypes.string,
  iconName: PropTypes.string,
  borderColor: PropTypes.string,
};

export default ButtonCustomize;
