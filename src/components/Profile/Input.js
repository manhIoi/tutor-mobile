import * as React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TextInput,
  Keyboard,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import {useState} from 'react';
import ConfigStyle from '../../theme/ConfigStyle';
import CustomPicker from '../common/CustomPicker';
import Styles from '../../theme/MainStyles';
import ModalGooglePlace from '../common/ModalGooglePlace';

const width = Dimensions.get('window').width;
const TextForm = (props) => {
  React.useEffect(() => {}, [props]);
  const [showModalGG, setShowModalGG] = useState(false);

  function handleHideModalGG() {
    setShowModalGG(false);
  }

  function handleFocusInput() {
    if (props.useGGPlaces) {
      Keyboard.dismiss();
      setShowModalGG(true);
    }
  }

  return (
    <View style={styles.viewText}>
      <View style={styles.image}>{props.src}</View>
      {props.gender ? (
        <CustomPicker
          disabled={props.editable === false}
          items={[
            {_id: 1, name: 'Nam', dial_code: 'Nam'},
            {_id: 2, name: 'Nữ', dial_code: 'Nữ'},
            {_id: 0, name: 'Khác', dial_code: 'Khác'},
          ]}
          value={parseInt(props?.value)}
          title={props.placeholder}
          onChange={(value) => props.actions(value, props?.name)}
          wrapStyle={{
            flex: 1,
            marginLeft: 17,
            marginBottom: 12,
            marginTop: 10,
          }}
          textStyle={Styles.textLight}
        />
      ) : (
        <View style={styles.viewTitle}>
          <TextInput
            value={props.value}
            editable={props.editable}
            keyboardType={props.keyboardType ? props.keyboardType : null}
            style={
              !props?.isDisabled && props?.editable
                ? {
                    ...styles.text,
                    paddingTop: Platform.OS === 'ios' ? 15 : 10,
                    paddingBottom: Platform.OS === 'ios' ? 10 : 12,
                  }
                : {
                    ...styles.text,
                    paddingTop: Platform.OS === 'ios' ? 15 : 10,
                    paddingBottom: Platform.OS === 'ios' ? 10 : 12,
                    opacity: 0.5,
                  }
            }
            autoCompleteType={'off'}
            placeholder={props.placeholder}
            placeholderTextColor={'#C0C0C0'}
            onChangeText={(value) => props.actions(value, props.name)}
            onFocus={handleFocusInput}
          />
        </View>
      )}

      {showModalGG ? (
        <ModalGooglePlace
          visible={showModalGG}
          text={props.value}
          setAddress={(value) => props.actions(value, props.name)}
          onHideModal={handleHideModalGG}
        />
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  viewText: {
    flexDirection: 'row',
    marginHorizontal: 15,
    borderBottomColor: '#C0C0C0',
    borderBottomWidth: 1,
    marginVertical: 5,
    // backgroundColor:'gray'
  },
  image: {
    width: 20,
    height: 20,
    alignSelf: 'center',
  },
  viewTitle: {justifyContent: 'center'},
  text: {
    fontSize: ConfigStyle.customTitle2,
    width: width - 80,
    flex: 1,
    paddingRight: 20,
    alignSelf: 'center',
    marginLeft: 13,
    color: '#333333',
  },
});
export default TextForm;
