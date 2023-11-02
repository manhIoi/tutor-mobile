import React from 'react';
import {View, StyleSheet} from 'react-native';
import {TypingAnimation} from 'react-native-typing-animation';
import Avatar from '../common/Avatar';
import Colors from '../../theme/Colors';

const Typing = (props) => {
  return (
    <View style={styles.container}>
      <Avatar source={{uri: props.avatar?.small}}
size={34} />
      <View style={styles.wrapTyping}>
        <TypingAnimation
          dotColor={Colors.greyText}
          dotMargin={5}
          dotAmplitude={3}
          dotSpeed={0.55}
          dotRadius={3}
          dotX={15}
          dotY={4}
          style={styles.typing}
        />
      </View>
    </View>
  );
};

export default Typing;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typing: {
    // marginBottom: 5,
    position: 'absolute',
    top: 8,
    left: 5,
  },
  wrapTyping: {
    marginLeft: 12,
    width: 50,
    height: 28,
    borderRadius: 15,
    backgroundColor: Colors.inboxReceive,
  },
});
