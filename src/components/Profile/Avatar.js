import * as React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Keyboard,
} from 'react-native';
import IconFeather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import Toast from 'react-native-toast-message';
import {useState} from 'react';
import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';
import Styles from '../../theme/MainStyles';

import {uploadImage} from '../../api/uploadImage';
import {getprofile, updateAvatar} from '../../api/users';

import config from '../../../config/config';
import CustomActionSheet from '../common/CustomActionSheet';
import Container from '../common/ContainerAnimated';
import FastImage from '../common/FastImage';

const Avatar = (props) => {
  const [photo, setPhoto] = React.useState('');
  const [photoUpload, setphotoUpload] = React.useState('');
  const [photoLarge, setphotoLarge] = React.useState('');
  const [isBusy, setBusy] = React.useState(false);
  const [showPickImage, setShowPickerImage] = useState(false);
  function handleAddImage() {
    setShowPickerImage(true);
    setTimeout(() => {
      setShowPickerImage(false);
    }, 200);
  }
  React.useEffect(() => {
    setPhoto(props?.src);
  }, [props?.src]);
  const actionSheet = React.useRef();
  const ActionSheetButton = [
    <Text style={{fontSize: ConfigStyle.customeTitle1}}>Máy ảnh</Text>,
    <Text style={{fontSize: ConfigStyle.customeTitle1}}>
      Thư viện hình ảnh
    </Text>,
    <Text style={{fontSize: ConfigStyle.customeTitle1}}>Hủy</Text>,
  ];
  async function handleUploadImage(image) {
    try {
      const formData = new FormData();
      formData.append('file', {
        name: `${new Date()}.jpg`,
        type: image.mime,
        uri: image.path,
      });
      setBusy(true);
      const upload = await uploadImage(formData);
      if (props.role === 0) {
        const update = await updateAvatar({avatar: upload?.data?.images[0]});
        setBusy(false);
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Cập nhật thành công',
        });
        setphotoUpload(`${config.IMAGE_MD_URL}${update?.medium}`);
        setphotoLarge(`${config.IMAGE_LG_URL}${update?.large}`);
      }
      if (props.role === 2) {
        props.action({avatar: upload?.data?.images[0]});
        setphotoUpload(
          `${config.IMAGE_MD_URL}${upload?.data?.images[0]?.medium}`,
        );
      }
    } catch (error) {
      setBusy(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Cập nhật không thành công',
      });
    }
  }
  function handleClickCamera() {
    Keyboard.dismiss();
    actionSheet.current.show();
  }
  function handleActionSheetOnPress(index) {
    switch (index) {
      case 0:
        ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: true,
        })
          .then(async (image) => {
            const data = {
              uri: image.path,
              width: image.width,
              height: image.height,
              mime: image.mime,
            };
            await handleUploadImage(image);
          })
          .catch((err) => {
            console.log(err);
          });
        break;
      case 1: {
        ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: true,
        })
          .then((image) => {
            const data = {
              uri: image.path,
              width: image.width,
              height: image.height,
              mime: image.mime,
            };
            handleUploadImage(image);
          })
          .catch((err) => {
            console.log(err);
          });

        break;
      }
      default:
        break;
    }
  }
  return (
    <View style={{marginBottom: 16, marginTop: 10}}>
      <View style={styles.viewImage}>
        <FastImage
          style={styles.image}
          source={{uri: photoUpload || props?.src}}
          zoomView={true}
          arraySource={[{uri: photoLarge || props?.srcLg}]}
        />
        <TouchableOpacity style={styles.viewcamera}
onPress={handleAddImage}>
          <IconFeather style={styles.camera}
name="camera"
size={25} />
        </TouchableOpacity>
      </View>
      {props.title}
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
const styles = StyleSheet.create({
  btnClose: {position: 'absolute', top: 10, right: 20},
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'lightgray',
    height: 180,
    backgroundColor: 'white',
  },
  name: {
    fontSize: ConfigStyle.title2,
    textAlign: 'center',
    color: Colors.black4,
  },
  title: {
    fontSize: ConfigStyle.customTitle2,
    color: Colors.black4,
    textAlign: 'center',
  },
  viewtext: {
    marginTop: 10,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  camera: {
    color: '#FFB02C',
    alignSelf: 'center',
  },
  viewcamera: {
    position: 'absolute',
    justifyContent: 'center',
    right: 10,
    zIndex: 1,
    color: Colors.orange,
    bottom: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 25,
    width: 50,
    height: 50,
    elevation: 7,
    backgroundColor: Colors.whiteColor,
    shadowOffset: {width: 1, height: 1},
    textShadowColor: Colors.black4,
    shadowOpacity: 0.5,
  },
  viewImage: {
    marginHorizontal: 15,
    justifyContent: 'center',
    alignSelf: 'center',
    width: 180,
    height: 180,
    borderRadius: 90,
    elevation: 6,
    backgroundColor: Colors.whiteColor,
    shadowOffset: {width: 1, height: 1},
    textShadowColor: Colors.black4,
    shadowOpacity: 0.5,
    textShadowRadius: 0.5,
    borderWidth: 0.8,
    borderColor: Colors.borderThin,
  },
  image: {
    marginHorizontal: 10,
    marginVertical: 10,
    width: 159,
    height: 159,
    borderRadius: 80,
    backgroundColor: '#C0C0C0',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 35,
    paddingVertical: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
export default Avatar;
