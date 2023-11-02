import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, StatusBar, Platform} from 'react-native';
// import {RTCView} from 'react-native-webrtc';
import {useSelector, useDispatch} from 'react-redux';
import IconFA from 'react-native-vector-icons/FontAwesome';
import {getStatusBarHeight} from '../../utils/ScaleAdaptor';
import Colors from '../../theme/Colors';
// import CallManager from '../../utils/callManager';
import {
  updateRemoteStream,
  updateLocalStream,
} from '../../lib/slices/callSlice';

const width = Dimensions.get('window').width;
const statusBarHeight =
  Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;
const MiniCallStream = (props) => {
  const localStream = useSelector((state) => state.calling.localStream);
  const onCallView = useSelector((state) => state.calling.onCallView);
  const isFront = useSelector((state) => state.calling.isFront);
  const typeCall = useSelector((state) => state.calling.typeCall);
  const isMute = useSelector((state) => state.calling.isMute);
  const requestCall = useSelector((state) => state.calling.requestCall);
  // const [callManage, setCallManage] = useState(new CallManager());
  const dispatch = useDispatch();
  // useEffect(() => {
  //   // Get local stream
  //   initStream();
  //   return () => {
  //     callManage.endCall();
  //   };
  // }, []);

  // async function initStream(hasVideo = true, facingMode = 'user') {
  //   if (callManage) {
  //     callManage.endCall();
  //   }
  //   const localStream = await callManage.requestCall('', true, facingMode);
  //   dispatch(updateRemoteStream(localStream?.toURL()));
  //   dispatch(updateLocalStream(localStream?.toURL()));
  // }

  // useEffect(() => {
  //   if (isFront.update) {
  //     initStream(typeCall.value, isFront.value ? 'user' : 'environment');
  //   }
  // }, [isFront.update]);

  // useEffect(() => {
  //   if (isMute.update) {
  //     callManage.handleMuteMicro();
  //   }
  // }, [isMute.update]);

  return (
    <View></View>
    // <View style={styles.videoContainer}>
    //   {isMute?.value ? (
    //     <View style={styles.iconMute}>
    //       <IconFA
    //         name={'microphone-slash'}
    //         size={15}
    //         color={Colors.whiteColor}
    //       />
    //     </View>
    //   ) : null}
    //   {onCallView ? (
    //     <View>
    //       {localStream ? (
    //         <RTCView
    //           objectFit="cover"
    //           streamURL={localStream}
    //           style={styles.localVideo}
    //         />
    //       ) : null}
    //     </View>
    //   ) : (
    //     <View>
    //       {localStream ? (
    //         <RTCView
    //           objectFit="cover"
    //           streamURL={localStream}
    //           style={styles.videoTwoStream}
    //         />
    //       ) : null}
    //       {localStream ? (
    //         <RTCView
    //           objectFit="cover"
    //           streamURL={localStream}
    //           style={styles.videoTwoStream}
    //         />
    //       ) : null}
    //     </View>
    //   )}
    // </View>
  );
};

export default MiniCallStream;
const styles = StyleSheet.create({
  videoContainer: {
    position: 'absolute',
    top: statusBarHeight,
    right: width * 0.02,
    borderWidth: 1,
    borderColor: Colors.borderThin,
  },
  localVideo: {
    width: width * 0.3,
    height: width * 0.45,
  },
  videoTwoStream: {
    width: width * 0.3,
    height: (width * 0.45) / 2,
  },
  iconMute: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 999,
  },
});
