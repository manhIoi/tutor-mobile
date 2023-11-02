import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
// import {RTCView} from 'react-native-webrtc';
import {useSelector, useDispatch} from 'react-redux';
import GroupAction from '../../components/Call/GroupAction';
import CallHeader from '../../components/Call/CallHeader';
import {stopCall, updateOnCallView} from '../../lib/slices/callSlice';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const Calling = (props) => {
  const localStream = useSelector((state) => state.calling.localStream);
  const remoteStream = useSelector((state) => state.calling.remoteStream);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateOnCallView(true));
    return () => {
      dispatch(updateOnCallView(false));
    };
  }, []);

  return (
    <View></View>
    // <View style={styles.videoContainer}>
    //   <CallHeader navigation={props.navigation} />
    //   {remoteStream ? (
    //     <RTCView
    //       objectFit="cover"
    //       streamURL={remoteStream}
    //       style={styles.localVideo}
    //     />
    //   ) : null}
    //   <GroupAction navigation={props.navigation} />
    // </View>
  );
};

export default Calling;
const styles = StyleSheet.create({
  videoContainer: {
    position: 'relative',
  },
  localVideo: {
    width: width,
    height: height,
  },
});
