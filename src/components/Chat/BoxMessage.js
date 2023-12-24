import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import PropsTypes from 'prop-types';
import {Text} from 'react-native-elements';
import Message from './Message';
import Avatar from '../common/Avatar';
import {formatDateTime, formatHHMM} from '../../utils/string.util';
import Styles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';
import MessageSending from './MessageSending';

const BoxMessage = (props) => {
  const scrollBar = React.useRef();
  useEffect(() => {
    setTimeout(() => {
      showScrollToEnd();
    }, 150);
  }, [props.showScroll]);

  useEffect(() => {
    Keyboard?.addListener?.('keyboardDidShow', _keyboardDidShow);
    return () => {
      Keyboard?.removeListener?.('keyboardDidShow', _keyboardDidShow);
    };
  }, []);

  const _keyboardDidShow = () => {
    showScrollToEnd();
  };

  function showScrollToEnd() {
    scrollBar?.current?.scrollToOffset({offset: 0, animated: true});
  }

  return (
    <View>
      <FlatList
        ref={scrollBar}
        threshold={20}
        inverted={true}
        style={styles.customScroll}
        data={props.messages}
        onEndReachedThreshold={0.4}
        onEndReached={props.handleLoadMore}
        renderItem={({item, index}) => (
          <View>
            {props.messages?.length && !props.messages?.[index + 1]?._id ? (
              <Text style={styles.textTimeDuration}>
                {formatDateTime(item.createdAt)}
              </Text>
            ) : null}

            {new Date(item.createdAt).getTime() -
              new Date(props.messages?.[index + 1]?.createdAt).getTime() >
            3 * 60 * 1000 ? (
              <Text
                style={{
                  ...styles.textTimeDuration,
                  ...styles.textDurationMinute,
                }}
              >
                {formatHHMM(item.createdAt)}
              </Text>
            ) : null}
            <View
              style={[
                styles.wrapMessage,
                item.receive ? styles.messageReceive : styles.messageSend,
              ]}
            >
              {item.receive &&
              (!props.messages[index + 1]?.receive ||
                (props.messages?.[index - 1]?._id &&
                  (new Date(item?.createdAt).getTime() -
                    new Date(
                      props.messages?.[index - 1]?.createdAt,
                    ).getTime()) /
                    (60 * 1000) >
                    10)) ? (
                <Avatar
                  source={{uri: item?.from?.avatar}}
                  size={34}
                  hideLoad={true}
                />
              ) : null}

              <Message
                preMessage={props.messages[index - 1] || {}}
                message={item}
                nextMessage={props.messages[index + 1] || {}}
                isSlice={
                  item.receive &&
                  (!props.messages[index - 1]?.receive ||
                    (props.messages?.[index - 1]?._id &&
                      (new Date(item?.createdAt).getTime() -
                        new Date(
                          props.messages?.[index - 1]?.createdAt,
                        ).getTime()) /
                        (60 * 1000) >
                        10))
                }
                handleDeleteMessage={props.handleDeleteMessage}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

BoxMessage.prototype = {
  messages: PropsTypes.array,
};
export default BoxMessage;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    marginBottom: 10,
    marginTop: 10,
  },
  customScroll: {
    marginBottom: 10,
  },
  wrapMessage: {
    flexDirection: 'row',
    paddingHorizontal: 13,
  },
  messageReceive: {
    justifyContent: 'flex-start',
  },
  messageSend: {
    justifyContent: 'flex-end',
  },
  textTimeDuration: {
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 11,
    marginHorizontal: 5,
  },
  textDurationMinute: {
    marginTop: 5,
  },
});
