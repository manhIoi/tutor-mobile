import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
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

        <GooglePlacesAutocomplete
          ref={ref}
          placeholder="Tìm kiếm..."
          fetchDetails={true}
          minLength={4}
          autoFocus={true}
          keyboardShouldPersistTaps="always"
          listViewDisplayed={false}
          isRowScrollable={true}
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            props.setAddress({
              desc: details?.formatted_address,
              lng: details?.geometry?.location?.lng,
              lat: details?.geometry?.location?.lat,
            });
            props.onHideModal();
          }}
          debounce={700}
          query={{
            key: 'AIzaSyA31O17WozaFDjL982ZmUKu8PxmM64Bq1c',
            language: 'vi',
          }}
          enablePoweredByContainer={false}
          styles={{
            textInput: {
              height: 38,
              color: Colors.black4,
              fontSize: ConfigStyle.RF.text7,
              borderWidth: 1,
              borderColor: Colors.btnLogin,
            },
            separator: {
              height: 0.5,
              backgroundColor: Colors.borderThin,
            },
            description: {
              fontSize: ConfigStyle.RF.text7,
              ...Styles.textNormal,
              color: Colors.black4,
            },
            loader: {
              flexDirection: 'row',
              justifyContent: 'flex-end',
              height: 20,
            },
          }}
        />
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
