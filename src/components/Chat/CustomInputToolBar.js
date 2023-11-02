import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import PropsTypes, {func} from 'prop-types';
import {Text} from 'react-native-elements';
import ConfigStyle from '../../theme/ConfigStyle';
import Styles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';
import IconCamera from '../../assets/images/svg/photo-camera (3).svg';
import IconLink from '../../assets/images/svg/link (1).svg';
import IconPaper from '../../assets/images/svg/paper-plane.svg';
import CustomActionSheet from '../common/CustomActionSheet';

const deviceWidth = Dimensions.get('window').width;
const CustomInputToolBar = (props) => {
  const inputRef = React.useRef();
  const [text, setText] = useState('');
  const [showPickImage, setShowPickerImage] = useState(false);

  function handleClickCamera() {
    Keyboard.dismiss();
    setShowPickerImage(true);
    setTimeout(() => {
      setShowPickerImage(false);
    }, 200);
  }

  function handleActionSheetOnPress(index) {
    switch (index) {
      case 0:
        ImagePicker.openCamera({
          width: 300,
          height: 400,
          // cropping: true,
        }).then((images) => {
          props.sendMessage({images});
        });
        break;
      case 1: {
        ImagePicker.openPicker({
          multiple: true,
          cropping: true,
        }).then((images) => {
          props.sendMessage({images});
        });
        break;
      }
      default:
        break;
    }
  }

  async function handleAttachFile() {
    Keyboard.dismiss();
    try {
      const files = [];
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      for (const res of results) {
        files.push({
          url: res.uri,
          type: res.type, // mime type
          name: res.name,
          size: res.size,
        });
      }
      props.sendMessage({files});
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  function handleSend() {
    if (text?.trim()) {
      setText('');
      props.sendMessage({text: text.trim()});
    }
  }

  return (
    <View style={styles.container}>
      {!props.groupChat?.blockInfo?._id ? (
        <>
          <View style={styles.wrapMedia}>
            <TouchableOpacity
              style={{paddingHorizontal: 2, paddingVertical: 2}}
              onPress={handleClickCamera}
            >
              <IconCamera width={26}
height={21} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginLeft: 15, paddingHorizontal: 2, paddingVertical: 2}}
              onPress={handleAttachFile}
            >
              <IconLink width={17.4}
height={17.4} />
            </TouchableOpacity>
          </View>
          {/* <View style={styles.wrapInput}> */}
          <TextInput
            multiline
            style={{
              ...styles.inputText,
              ...Styles.textNormal,
              fontSize: 13,
              paddingTop: Platform.OS === 'ios' ? 10 : 4,
              paddingBottom: Platform.OS === 'ios' ? 10 : 4,
            }}
            placeholder={'Viết tin nhắn'}
            value={text}
            scrollEnabled={true}
            ref={inputRef}
            onChangeText={(text) => setText(text)}
          />
          {/* </View> */}

          <TouchableOpacity
            style={{
              paddingHorizontal: 0,
              paddingVertical: 0,
              paddingRight: 4,
              paddingLeft: 2,
            }}
            onPress={handleSend}
          >
            <IconPaper />
          </TouchableOpacity>
        </>
      ) : (
        <View style={{flex: 1}}>
          <Text style={{textAlign: 'center'}}>
            Bạn không thể chat với người này
          </Text>
        </View>
      )}

      <CustomActionSheet
        title={'Chọn hình ảnh từ ?'}
        arrayActions={['Máy ảnh', 'Thư viện hình ảnh', 'Hủy']}
        actionSheetOnPress={handleActionSheetOnPress}
        shouldShow={showPickImage}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
      />
    </View>
  );
};
CustomInputToolBar.prototype = {
  sendMessage: PropsTypes.func,
};
export default CustomInputToolBar;

const styles = StyleSheet.create({
  container: {
    minHeight: ConfigStyle.inputToolBarHeight,
    width: '100%',
    borderTopWidth: 1,
    borderColor: 'rgba(104,104,104,0.28)',
    paddingHorizontal: 13,
    paddingVertical: 13,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: Colors.whiteColor,
    borderWidth: 1,
  },
  wrapMedia: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
  },
  iconCamera: {
    width: 26,
    height: 21,
  },
  iconAttachLink: {
    width: 17.5,
    height: 17.5,
  },
  inputText: {
    marginLeft: 14,
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 4,
    paddingLeft: 15,
    backgroundColor: '#F3F3F3',
    borderRadius: 18,
    // transform: [{translateY: 3}],
    fontSize: 13,
    maxHeight: 100,
  },
  wrapInput: {
    borderRadius: 18,
    flex: 1,
  },
  iconPaperPlane: {
    width: 32,
    height: 20,
  },
});
