import React, {useState, createRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {Text} from 'react-native-elements';
import PropsTypes from 'prop-types';
import Swipeable from 'react-native-swipeable';
import {useSelector} from 'react-redux';
import Avatar from '../common/Avatar';
import Styles from '../../theme/MainStyles';
import {formatHHMM} from '../../utils/string.util';
import ButtonDelete from '../../assets/images/svg/download-image.svg';
import IconDelete from '../../assets/images/svg/trash.svg';
import IconBlock from '../../assets/images/svg/icon-block.svg';
import Colors from '../../theme/Colors';

const width = Dimensions.get('window').width;
const ChatItem = (props) => {
  const user = useSelector((state) => state.auth.user);
  const userReceive = props?.data?.persons?.find?.(u => u?._id !== user?._id);
  const firstName = userReceive?.fullName.split(" ").pop();
  const isLastMessage = props?.data?.lastMessage?.userSend === user?._id;
  function onClickContent() {
    props.navigation.navigate('InboxChat', {
      userReceive: userReceive,
    });
  }

  const rightButtons = [
    <View style={{...styles.wrapBtnDelete, width: 60}}>
      <TouchableOpacity
        style={{width: 45, height: 45}}
        onPress={() => props.deleteInbox(props.data?._id)}
      >
        <IconDelete width={45}
height={45} />
        {/* <Image source={ImageUtil.iconDelete} style={{width: 45, height: 45}} /> */}
        <ButtonDelete width={30}
height={30} />
      </TouchableOpacity>
    </View>,
  ];

  return (
    <Swipeable rightButtons={rightButtons}
rightButtonWidth={60}>
      <View style={styles.wrapContainer}>
        <TouchableWithoutFeedback
          onPress={onClickContent}
          underlayColor="#dddddd80"
        >
          <View style={styles.container}>
            <View style={styles.wrapInfoLeft}>
              <Avatar
                size={64}
                source={{
                  uri: userReceive?.avatar || `https://ui-avatars.com/api/?background=random&name=${userReceive?.fullName}`,
                }}
                icon={
                  props.data?.blockInfo?.user === user?._id ? (
                    <IconBlock width={10}
height={10}
fill={Colors.orange} />
                  ) : null
                }
              />
              <View style={styles.content}>
                <Text numberOfLines={1}
style={Styles.title2RS}>
                  {userReceive?.fullName}
                </Text>
                <View>
                  <View style={Styles.flexRowCenterVertical}>
                    <Text
                      style={{
                        ...Styles.textGrey,
                        ...styles.textMessage,
                        fontWeight: props.data?.messageUnread
                          ? 'bold'
                          : 'normal',
                      }}
                      numberOfLines={1}
                    >
                      {isLastMessage ? 'Bạn' : firstName}: {props.data?.lastMessage?.content || ''}

                    </Text>
                    {props.data?.messageUnread > 0 ? (
                      <Text
                        style={{
                          ...Styles.textGrey,
                          ...styles.textMessage,
                          fontWeight: 'bold',
                          fontSize: 13,
                        }}
                        numberOfLines={1}
                      >
                        {' '}
                        ({props.data?.messageUnread})
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.wrapInfoRight}>
              <Text style={Styles.textGrey}>
                {formatHHMM(props.data?.lastAt)}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Swipeable>
  );
};
ChatItem.prototype = {
  selectInbox: PropsTypes.func,
  deleteInbox: PropsTypes.func,
};
export default ChatItem;
const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width,
  },
  wrapInfoLeft: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    marginLeft: 13,
    maxWidth: 0.55 * width,
  },
  wrapInfoRight: {
    marginRight: 17,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {},
  wrapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  wrapBtnDelete: {
    alignItems: 'center',
    overflow: 'hidden',
    height: '100%',
    justifyContent: 'center',
  },
  textMessage: {
    marginTop: 2,
  },
});
