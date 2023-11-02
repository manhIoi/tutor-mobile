import React, {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  PermissionsAndroid,
  ToastAndroid,
  Platform,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';
import PropsTypes from 'prop-types';
import Toast from 'react-native-toast-message';
import RNFetchBlob from 'rn-fetch-blob';
import Colors from '../../theme/Colors';
import CloseButton from '../../assets/images/svg/close.svg';
import IconDownload from '../../assets/images/svg/download-image.svg';
import ConfigStyle from '../../theme/ConfigStyle';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const CustomFastImage = (props) => {
  const [loading, setLoading] = useState(true);
  const [showView, setShowView] = useState(false);
  const [arrayImages, setArrayImages] = useState([]);
  const [index, setIndex] = useState(1);
  useEffect(() => {
    if (!props.arraySource) {
      setArrayImages([{url: props?.source?.uri}]);
    } else {
      const arr = [];
      props.arraySource?.map((item) => {
        arr.push({url: item.uri});
      });
      if (props.index !== undefined && props.index !== null) {
        setIndex(props.index);
      }
      setArrayImages(arr);
    }
  }, []);
  useEffect(() => {
    if (!props.arraySource) {
      setArrayImages([{url: props?.source?.uri}]);
    } else {
      const arr = [];
      props.arraySource?.map((item) => {
        arr.push({url: item.uri});
      });
      setArrayImages(arr);
    }
  }, [props.arraySource, props?.source, props?.source?.uri]);

  async function handleDownloadImage(url) {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );

    if (granted) {
      await downloadFile(url);
    } else {
      await requestStoragePermission(url);
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
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };
  async function downloadFile(url) {
    try {
      const arr = url.split('/');
      const fileName = arr?.[arr?.length - 1];
      const {config, fs} = RNFetchBlob;
      const path =
        Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
      RNFetchBlob.config({
        fileCache: true,
        path: `${path}/${fileName}`,
      })
        .fetch('GET', url, {
          // some headers ..
        })
        .then((res) => {
          if (Platform.OS === 'android') {
            ToastAndroid.show('Tải hình ảnh thành công', ToastAndroid.SHORT);
          } else {
            Toast.show({
              ...ConfigStyle.toastDefault,
              type: 'error',
              text1: 'Lỗi trong quá trình tải hình ảnh',
            });
          }
        })
        .catch((error) => {
          if (Platform.OS === 'android') {
            ToastAndroid.show('Tải hình ảnh xảy ra lỗi', ToastAndroid.SHORT);
          } else {
            Toast.show({
              ...ConfigStyle.toastDefault,
              text1: 'Tải hình ảnh xảy ra lỗi',
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

  function handleDownload() {
    if (arrayImages?.length === 1) {
      handleDownloadImage(arrayImages?.[0]?.url);
    } else if (arrayImages?.length > 1) {
      handleDownloadImage(arrayImages?.[index]?.url);
    }
  }
  const iconExit = (
    <SafeAreaView style={styles.wrapHeader}>
      <TouchableOpacity
        onPress={handleDownload}
        style={{...styles.wrapIconExit, marginRight: 30}}
      >
        <IconDownload width={28}
height={40} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setShowView(false);
        }}
        style={{...styles.wrapIconExit, marginTop: 5, height: 60, width: 30}}
      >
        <CloseButton width={20}
height={30} />
      </TouchableOpacity>
    </SafeAreaView>
  );
  return (
    <TouchableWithoutFeedback
      disabled={!props.zoomView}
      onPress={() => {
        setShowView(true);
      }}
    >
      <View style={{...styles.container, ...props.style}}>
        <FastImage
          source={props.sourceTemp || props.source}
          resizeMode={props.resizeMode || FastImage.resizeMode.cover}
          style={styles.image}
          onLoadStart={() => {
            setLoading(true);
          }}
          onLoad={() => {
            setLoading(false);
          }}
          onError={() => {
            setLoading(false);
          }}
        />
        {loading && !props.hideLoad ? (
          <View style={styles.loading}>
            <ActivityIndicator color={Colors.orange} />
          </View>
        ) : null}
        {showView ? (
          <Modal isVisible={showView}>
            <ImageViewer
              imageUrls={arrayImages}
              enableSwipeDown={true}
              onCancel={() => setShowView(false)}
              index={props.index}
              saveToLocalByLongPress={false}
              loadingRender={() => (
                <ActivityIndicator color={Colors.orange}
size={'large'} />
              )}
              onChange={(index) => setIndex(index)}
              enablePreload={true}
            />
          </Modal>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
};
CustomFastImage.prototype = {
  source: PropsTypes.string,
  style: PropsTypes.object,
  resizeMode: PropsTypes.string,
  zoomView: PropsTypes.bool,
  arraySource: PropsTypes.array,
  index: PropsTypes.number,
};
export default CustomFastImage;
const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loading: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  wrapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 5,
    position: 'absolute',
    flex: 1,
    right: 0,
  },
  wrapIconExit: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    zIndex: 999999999,
  },
});
