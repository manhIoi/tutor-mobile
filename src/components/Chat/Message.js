import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Platform,
  ToastAndroid,
  PermissionsAndroid,
} from 'react-native';
import {Text, Icon} from 'react-native-elements';
import PropsTypes from 'prop-types';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-toast-message';
import Colors from '../../theme/Colors';
import Styles from '../../theme/MainStyles';
import CustomActionSheet from '../common/CustomActionSheet';
import CustomFastImage from '../common/FastImage';
import ConfigStyle from '../../theme/ConfigStyle';
import {hideMessage} from '../../api/chat';

const Message = (props) => {
  const preReceive = props?.preMessage?.receive || false;
  const receive = props?.message?.receive || false;
  const nextReceive = props?.nextMessage?.receive || false;
  const text = props?.message?.content || '';
  const [showPickFile, setShowPickFile] = useState(false);
  const [showDelete1, setDelete1] = useState(false);
  const [showDelete2, setDelete2] = useState(false);
  const [fileSelected, setFileSelected] = useState({});
  const [listImages, setListImages] = useState([]);

  useEffect(() => {
    if (props.message.images?.length) {
      const arr = [];
      props.message.images.map((item) => {
        arr.push({
          uri: item.large,
        });
      });
      setListImages(arr);
    }
  }, []);

  useEffect(() => {
    if (props.message.images?.length) {
      const arr = [];
      props.message.images.map((item) => {
        arr.push({
          uri: item.large,
        });
      });
      setListImages(arr);
    }
  }, [props?.message?.images, props?.message?.images?.name]);

  function getTypeFile(name) {
    const index = name?.lastIndexOf('.');
    const type = name?.substring(index + 1, name.length);
    let nameIcon = '';
    switch (type?.toLowerCase()) {
      case 'png':
      case 'jpg':
      case 'jpeg':
        nameIcon = 'file-picture-o';
        break;
      case 'pdf':
        nameIcon = 'file-pdf-o';
        break;
      case 'doc':
      case 'docx':
      case 'docm':
        nameIcon = 'file-word-o';
        break;
      case 'xls':
      case 'xlsx':
        nameIcon = 'file-excel-o';
        break;
      case 'zip':
      case 'rar':
        nameIcon = 'file-zip-o';
        break;
      case 'htm':
      case 'html':
        nameIcon = 'file-code-o';
        break;
      case 'm4a':
      case 'mp3':
        nameIcon = 'file-sound-o';
        break;
      case 'mp4':
      case 'mov':
        nameIcon = 'file-movie-o';
        break;
      case 'txt':
        nameIcon = 'file-text-o';
        break;
      case 'pptx':
        nameIcon = 'file-powerpoint-o';
        break;
      default:
        nameIcon = 'file';
        break;
    }
    return nameIcon;
  }
  function getFileTypeText(name) {
    const index = name?.lastIndexOf('.');
    const type = name?.substring(index + 1, name.length);
    return type;
  }
  function getFileName(name, length = 6) {
    const index = name?.lastIndexOf('.');
    let text = name?.substring(0, index);
    if (text && text.length > 14) {
      text = `${text?.substring(0, length)}...${text?.substring(
        text.length - length,
        text.length,
      )}`;
    }
    return text;
  }

  function clickFile(file) {
    setFileSelected(file);
    Keyboard.dismiss();
    setShowPickFile(true);
    setTimeout(() => {
      setShowPickFile(false);
    }, 200);
  }
  function handleActionSheetOnPress(index) {
    if (index === 0) {
      handleDownloadFile();
    }
  }

  async function handleDownloadFile() {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );

    if (granted) {
      await downloadFile();
    } else {
      console.log('ACCESS_FINE_LOCATION permission denied');
      await requestStoragePermission();
    }
  }
  const requestStoragePermission = async (url) => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Request Permission Storage',
            message: 'We need Storage Permission',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          downloadFile(url);
        } else {
          console.log('Camera permission denied');
        }
      } else {
        downloadFile(url);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  function downloadFile() {
    try {
      const {config, fs} = RNFetchBlob;
      const path =
        Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
      RNFetchBlob.config({
        // add this option that makes response data to be stored as a file,
        // this is much more performant.
        fileCache: true,
        path: `${path}/${fileSelected.name}`,
        // path : fs.dirs.DownloadDir + `/${fileSelected.name}`,
      })
        .fetch('GET', fileSelected?.url, {
          // some headers ..
        })
        .then((res) => {
          // the temp file path
          if (Platform.OS === 'android') {
            ToastAndroid.show('Tải tập tin thành công', ToastAndroid.SHORT);
          } else {
            Toast.show({
              ...ConfigStyle.toastDefault,
              type: 'error',
              text1: 'Lỗi trong quá trình tải tập tin',
            });
          }
          // const base64Str = res.data;
          // RNFetchBlob.fs.writeFile(res.path(), base64Str, 'base64');
        })
        .catch((error) => {
          if (Platform.OS === 'android') {
            ToastAndroid.show('Tải tập tin xảy ra lỗi', ToastAndroid.SHORT);
          } else {
            Toast.show({
              ...ConfigStyle.toastDefault,
              text1: 'Tải tập tin xảy ra lỗi',
              type: 'error',
            });
          }
        });
    } catch (error) {
      console.log('downloadFile ==>', error);
      Toast.show({
        ...ConfigStyle.toastDefault,
        text1: 'Lỗi hệ thống',
        type: 'error',
      });
    }
  }

  function showModalDelete() {
    Keyboard.dismiss();
    if (receive) {
      setDelete1(true);
      setTimeout(() => {
        setDelete1(false);
      }, 200);
    } else {
      setDelete2(true);
      setTimeout(() => {
        setDelete2(false);
      }, 200);
    }
  }

  async function deleteMessage(onlyMe = false) {
    try {
      const data = {
        message: props.message?._id,
        onlyMe,
      };
      const response = await hideMessage(data);
      props.handleDeleteMessage(props.message?._id);
    } catch (error) {
      console.log('deleteMessage =>');
    }
  }

  async function handleDeleteOnPress(index) {
    switch (index) {
      case 0:
        if (receive) {
          await deleteMessage(true);
        } else {
          await deleteMessage();
        }
        break;
      case 1: {
        if (!receive) {
          await deleteMessage(true);
        }
        break;
      }
      default:
        break;
    }
  }
  /// // nextReceive > top
  /// preReceive => bottom
  return (
    <View
      style={[
        styles.wrapper,
        !(receive && !nextReceive) || (receive && nextReceive)
          ? styles.customMarginContainer
          : {},
        {justifyContent: receive ? 'flex-start' : 'flex-end'},
      ]}
    >
      <View
          style={[
            styles.container,
            text || props.message.files?.length ? styles.containerText : {},
            receive && !nextReceive ? styles.firstMessage : {},
            text || props.message.files?.length
                ? receive
                    ? styles.messageReceive
                    : styles.messageSend
                : {},
            receive && (preReceive || !props.isSlice)
                ? styles.customBorderBottomLeft
                : {}, // topleft
            receive && nextReceive ? styles.customBorderTopLeft : {}, // bottomLeft
            !receive && !nextReceive ? styles.customBorderTopRight : {}, // topright
            !receive && nextReceive === false
                ? styles.customBorderTopRight
                : {}, // bottomright
            !receive && !preReceive && props?.preMessage?._id
                ? styles.customBorderBottomRight
                : {}, // bottomright
            {
              flexWrap: 'wrap',
              justifyContent: !receive ? 'flex-end' : 'flex-start',
            },
            {
              borderWidth: 0,
              borderColor: 'transparent',
            },
          ]}
      >
        {text ? (
            <View style={{flexDirection: 'row'}}>
              <Text style={{...Styles.textLight, fontSize: 13}}>{text}</Text>
            </View>
        ) : null}
        {props.message.images ? (
            <View style={styles.wrapImage}>
              {props.message.images?.map((image, index) => {
                let imageStyles = styles.image1;
                const {images} = props.message;
                if (images.length > 1) {
                  if (images.length === 2) {
                    imageStyles = styles.image2;
                    if (index === 0) {
                      imageStyles = {...imageStyles, ...styles.imageTwoLeft};
                    } else {
                      imageStyles = {...imageStyles, ...styles.imageTwoRight};
                    }
                  }
                  if (images.length >= 3) {
                    imageStyles = {...imageStyles, ...styles.image2};
                    const isOdd = images.length % 2;
                    if (isOdd) {
                      if (
                          index % 2 === 0 &&
                          index < images.length - 1 &&
                          (index === 0 || index === 1)
                      ) {
                        imageStyles = {...imageStyles, ...styles.imageLeftTop};
                      } else if (
                          index % 2 === 0 &&
                          index === images.length - 1
                      ) {
                        imageStyles = {...imageStyles, ...styles.image1};
                        imageStyles = {
                          ...imageStyles,
                          ...styles.imageOneBottom,
                        };
                      } else if (
                          index % 2 === 1 &&
                          (index === 0 || index === 1)
                      ) {
                        imageStyles = {...imageStyles, ...styles.imageRightTop};
                      } else {
                        imageStyles = {...imageStyles, ...styles.imageMiddle};
                      }
                    } else {
                      if (
                          index % 2 === 0 &&
                          index < images.length - 2 &&
                          (index === 0 || index === 1)
                      ) {
                        imageStyles = {...imageStyles, ...styles.imageLeftTop};
                      } else if (
                          index % 2 === 0 &&
                          index === images.length - 2
                      ) {
                        imageStyles = {
                          ...imageStyles,
                          ...styles.imageLeftBottom,
                        };
                      } else if (
                          index % 2 === 1 &&
                          index < images.length - 1 &&
                          (index === 0 || index === 1)
                      ) {
                        imageStyles = {...imageStyles, ...styles.imageRightTop};
                      } else if (
                          index % 2 === 1 &&
                          index === images.length - 1
                      ) {
                        imageStyles = {
                          ...imageStyles,
                          ...styles.imageRightBottom,
                        };
                      } else {
                        imageStyles = {...imageStyles, ...styles.imageMiddle};
                      }
                    }
                  }
                }
                return (
                    <TouchableWithoutFeedback
                        key={index}
                        style={{backgroundColor: '#f000'}}
                    >
                      <View
                          style={{
                            ...imageStyles,
                            overflow: 'hidden',
                            borderWidth: 0.8,
                            borderColor: Colors.borderThin,
                          }}
                      >
                        <CustomFastImage
                            sourceTemp={{uri: image.medium}}
                            source={{uri: image.large}}
                            zoomView={true}
                            arraySource={listImages || []}
                            index={index}
                            hideLoad={true}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                );
              })}
            </View>
        ) : null}

        {props.message.files?.length ? (
            <View>
              {props.message.files.map((file, index) => (
                  <TouchableOpacity
                      style={{
                        ...styles.wrapFile,
                        justifyContent: receive ? 'flex-start' : 'flex-end',
                      }}
                      key={index}
                      onPress={() => clickFile(file)}
                  >
                    <Icon
                        type="font-awesome"
                        name={getTypeFile(file?.name)}
                        size={15}
                    />
                    <Text
                        style={{...styles.textFile, paddingLeft: 5}}
                        numberOfLines={1}
                    >
                      {getFileName(file.name)}
                      {/* {file.name} */}
                    </Text>
                    <Text style={styles.textFile}>
                      .{getFileTypeText(file.name)}
                    </Text>
                  </TouchableOpacity>
              ))}
            </View>
        ) : null}
      </View>

      {/*<CustomActionSheet*/}
      {/*  title={'Tải tập tin về máy ?'}*/}
      {/*  message={`${getFileName(fileSelected?.name, 10)}.${getFileTypeText(*/}
      {/*    fileSelected?.name,*/}
      {/*  )}`}*/}
      {/*  arrayActions={['Tải xuống', 'Hủy']}*/}
      {/*  actionSheetOnPress={handleActionSheetOnPress}*/}
      {/*  shouldShow={showPickFile}*/}
      {/*  cancelButtonIndex={1}*/}
      {/*  destructiveButtonIndex={0}*/}
      {/*/>*/}
      {/*<CustomActionSheet*/}
      {/*  title={'Xóa tin nhắn'}*/}
      {/*  arrayActions={['Xóa', 'Xóa ở phía bạn', 'Hủy']}*/}
      {/*  actionSheetOnPress={handleDeleteOnPress}*/}
      {/*  shouldShow={showDelete2}*/}
      {/*  cancelButtonIndex={receive ? 1 : 2}*/}
      {/*  destructiveButtonIndex={1}*/}
      {/*/>*/}
      {/*<CustomActionSheet*/}
      {/*  title={'Xóa tin nhắn'}*/}
      {/*  arrayActions={['Xóa', 'Hủy']}*/}
      {/*  actionSheetOnPress={handleDeleteOnPress}*/}
      {/*  shouldShow={showDelete1}*/}
      {/*  cancelButtonIndex={receive ? 1 : 2}*/}
      {/*  destructiveButtonIndex={1}*/}
      {/*/>*/}
    </View>
  );
};
Message.prototype = {
  preMessage: PropsTypes.object,
  message: PropsTypes.object,
  nextMessage: PropsTypes.object,
};
export default Message;

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: '65%',
    flexDirection: 'row',
  },
  container: {
    borderRadius: 20,
    marginBottom: 2,
    marginLeft: 12,
    // flexDirection: 'row',
  },
  customMarginContainer: {
    marginLeft: 34,
  },
  containerText: {
    paddingHorizontal: 13,
    paddingVertical: 5,
    paddingBottom: 2,
  },
  messageSend: {
    backgroundColor: Colors.inboxSend,
  },
  messageReceive: {
    backgroundColor: Colors.inboxReceive,
  },
  firstMessage: {
    marginTop: 10,
  },
  customBorderTopLeft: {
    borderTopLeftRadius: 5,
  },
  customBorderTopRight: {
    borderTopRightRadius: 5,
  },
  customBorderBottomLeft: {
    borderBottomLeftRadius: 5,
  },
  customBorderBottomRight: {
    borderBottomRightRadius: 5,
  },
  wrapImage: {
    width: '100%',
    flexDirection: 'row',
    marginVertical: 3,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  image1: {
    width: '100%',
    height: 100,
    borderRadius: 20,
    marginBottom: 2,
  },
  image2: {
    width: '49.5%',
    height: 100,
    borderRadius: 20,
    paddingBottom: 2,
    // marginRight: 2
  },
  imageLeftTop: {
    borderBottomLeftRadius: 2,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  imageRightTop: {
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  imageLeftBottom: {
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    borderTopLeftRadius: 2,
  },
  imageRightBottom: {
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  imageOneBottom: {
    borderTopRightRadius: 2,
    borderTopLeftRadius: 2,
  },
  imageMiddle: {
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  imageTwoLeft: {
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  imageTwoRight: {
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  wrapFile: {
    flexDirection: 'row',
    alignItems: 'center',
    // flexWrap: 'wrap',
    paddingBottom: 10,
    paddingTop: 0,
  },
  textFile: {
    textDecorationLine: 'underline',
  },
});
