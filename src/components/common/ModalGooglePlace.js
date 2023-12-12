import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Modal from 'react-native-modal';
import {Text} from 'react-native-elements';
import Styles from '../../theme/MainStyles';
import ConfigStyle from '../../theme/ConfigStyle';
import Colors from '../../theme/Colors';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ModalGooglePlace = (props) => {
  const ref = React.useRef();
  useEffect(() => {
    ref.current?.setAddressText(props.text || '');
    StatusBar.setBackgroundColor('rgba(0,0,0,0.3)');
    return () => {
      StatusBar.setBackgroundColor('transparent');
    };
  });
  return (
    <Modal
      isVisible={props.visible}
      backdropOpacity={0.3}
      onBackdropPress={props.onHideModal}
      style={styles.modal}
    >
      <SafeAreaView style={styles.container}>
        <Text
          style={{
            ...Styles.title4RS,
            ...Styles.textBold,
            ...styles.title,
          }}
        >
          Tìm kiếm địa chỉ
        </Text>
      </SafeAreaView>
    </Modal>
  );
};

export default ModalGooglePlace;

const styles = StyleSheet.create({
  modal: {
    zIndex: 999,
  },
  container: {
    width: '100%',
    height: '95%',
    maxHeight: 0.6 * height,
    borderWidth: 1,
    borderColor: Colors.borderThin,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    zIndex: 999,
  },
  title: {
    marginBottom: 5,
  },
});
