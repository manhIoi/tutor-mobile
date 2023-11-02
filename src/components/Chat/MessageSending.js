import React from 'react';
import {View, Animated, ActivityIndicator, StyleSheet} from 'react-native';
import Colors from '../../theme/Colors';
import Typing from './Typing';

const MessageSending = (props) => {
  return (
    <View style={styles.container}>
      <View>
        {/* <Typing */}
        {/*  avatar={props?.avatar} */}
        {/*  /> */}
      </View>
      <View>
        {props.sending ? (
          <View
            style={{
              ...styles.containerContent,
            }}
          >
            <View style={styles.wrapLoading}>
              <ActivityIndicator color={Colors.orange}
size={'small'} />
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default MessageSending;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: 13,
    marginBottom: 3,
  },
  wrapLoading: {
    transform: [
      {
        scale: 0.6,
      },
    ],
  },
  containerContent: {
    backgroundColor: Colors.inboxSend,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 15,
  },
});
