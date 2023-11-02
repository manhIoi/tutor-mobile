import React from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconIO from 'react-native-vector-icons/Ionicons';
import IconFE from 'react-native-vector-icons/Feather';
import Colors from '../../theme/Colors';
import {
  updateIsCalling,
  updateTypeCall,
  updateStateMute,
  updateCameraSide,
} from '../../lib/slices/callSlice';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const GroupAction = (props) => {
  const dispatch = useDispatch();
  const typeCall = useSelector((state) => state.calling.typeCall);
  const isMute = useSelector((state) => state.calling.isMute);
  const isFront = useSelector((state) => state.calling.isFront);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.wrapItemAction,
          typeCall.value === 'video' ? styles.btnActive : {},
        ]}
        onPress={() => {
          dispatch(
            updateTypeCall(typeCall.value === 'video' ? 'audio' : 'video'),
          );
        }}
      >
        {typeCall.value === 'video' ? (
          <IconFE
            name={'video'}
            style={styles.icon}
            size={0.065 * width}
            color={Colors.black}
          />
        ) : (
          <IconFE
            name={'video-off'}
            style={styles.icon}
            size={0.065 * width}
            color={Colors.whiteColor}
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.wrapItemAction, isFront.value ? styles.btnActive : {}]}
        onPress={() => {
          dispatch(updateCameraSide(!isFront.value));
        }}
      >
        <IconIO
          name={'camera-reverse-outline'}
          style={styles.icon}
          size={0.075 * width}
          color={isFront.value ? Colors.black : Colors.whiteColor}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.wrapItemAction, isMute.value ? styles.btnActive : {}]}
        onPress={() => {
          dispatch(updateStateMute(!isMute.value));
        }}
      >
        {isMute.value ? (
          <IconFA
            name={'microphone-slash'}
            style={styles.icon}
            size={0.06 * width}
            color={Colors.black}
          />
        ) : (
          <IconFA
            name={'microphone'}
            style={styles.icon}
            size={0.06 * width}
            color={Colors.whiteColor}
          />
        )}
      </TouchableOpacity>

      <View style={[styles.wrapItemAction, styles.hangupBtn]}>
        <IconMC
          name={'phone-hangup'}
          style={styles.icon}
          size={0.08 * width}
          color={Colors.whiteColor}
        />
      </View>
    </View>
  );
};

export default GroupAction;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: height * 0.05,
    left: 0,
    right: 0,
    flex: 1,
    flexDirection: 'row',
    zIndex: 9999,
    marginHorizontal: width * 0.05,
  },
  wrapItemAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: width * 0.03,
    borderRadius: 150,
    width: width * 0.165,
    height: width * 0.165,
    backgroundColor: Colors.black3,
    borderColor: Colors.borderThin,
  },
  icon: {},
  hangupBtn: {
    backgroundColor: Colors.red,
  },
  btnActive: {
    backgroundColor: Colors.whiteColor,
  },
});
