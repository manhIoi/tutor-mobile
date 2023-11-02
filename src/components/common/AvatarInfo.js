import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {Text} from 'react-native-elements';
import PropTypes from 'prop-types';
import AvatarStatus from './Avatar';
import RateStar from './RateStar';
import Styles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';

const AvatarInfo = (props) => {
  return (
    <View style={{...styles.container, ...props.containerStyle}}>
      <TouchableWithoutFeedback
        disabled={!props.onLeftPress}
        onPress={
          typeof props.onLeftPress === 'function' ? props.onLeftPress : null
        }
      >
        <View style={Styles.flexRowCenterVertical}>
          <AvatarStatus
            source={props.source}
            size={props.size}
            showStatus={props.showStatus}
            online={props.data?.isOnline}
          />
          <View style={styles.userInfo}>
            <View style={styles.contentLeft}>
              <Text
                style={{
                  ...Styles.title4RS,
                  ...styles.nameUser,
                  ...props.titleStyle,
                }}
                numberOfLines={1}
              >
                {props.data?.fullName}
              </Text>
              {props.showStar ? (
                <RateStar star={props.data?.rate || 0}
size={7} />
              ) : null}
              {props.phone ? (
                <Text style={{color: '#666666', fontSize: 12}}>
                  {props?.phone}
                </Text>
              ) : null}
              {props.content ? (
                <View>
                  <Text
                    style={{
                      ...Styles.textOrange,
                      ...styles.content,
                      ...props.contentStyles,
                      overflow: 'hidden',
                    }}
                    numberOfLines={1}
                  >
                    {props.content || ''}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          {props.contentRight ? <View>{props.contentRight || ''}</View> : null}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
AvatarStatus.prototype = {
  source: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  size: PropTypes.number,
  showStatus: PropTypes.bool,
  data: PropTypes.object,
  titleStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  showStar: PropTypes.bool,
  content: PropTypes.string,
  contentStyles: PropTypes.object,
  contentRight: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
export default AvatarInfo;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  nameUser: {
    marginBottom: 5,
  },
  userInfo: {
    marginLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
  },
  content: {
    fontSize: 12,
    marginTop: 0,
  },
});
