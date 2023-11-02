import React, {useEffect, useState} from 'react';
import {View, StyleSheet, StatusBar, Platform} from 'react-native';
import {WebView} from 'react-native-webview';
import Toast from 'react-native-toast-message';
import {Text} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {createPayment} from '../../api/payment';
import ConfigStyle from '../../theme/ConfigStyle';
import {getStatusBarHeight} from '../../utils/ScaleAdaptor';
import Loading from '../../components/common/Loading';
import {IP_ADDRESS} from '../../utils/auth.util';
import Colors from '../../theme/Colors';
import {updatePayment} from '../../lib/slices/notificationSlice';

const statusBarHeight =
  Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;
const WebViewPayment = (props) => {
  const [isBusy, setBusy] = useState(true);
  const [url, setUrl] = useState(props?.route?.params?.url);
  const paymentResult = useSelector(
    (state) => state.notification.paymentResult,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    // requestUrlPayment();
    // setUrl(props?.route?.params?.url)
    return () => {
      dispatch(updatePayment({}));
    };
  }, []);

  useEffect(() => {
    if (paymentResult.type === 'PAYMENT_SUCCESS') {
      Toast.show({
        ...ConfigStyle.toastDefault,
        text1: 'Thanh toán thành công',
        type: 'success',
      });
      props.navigation.goBack();
    }
    if (paymentResult.type === 'PAYMENT_FAILED') {
      Toast.show({
        ...ConfigStyle.toastDefault,
        text1: 'Thanh toán thất bại',
        type: 'error',
      });
      props.navigation.goBack();
    }
  }, [paymentResult]);

  async function requestUrlPayment() {
    try {
      const ipAddress = await IP_ADDRESS.get();
      console.log(`ipAddress :${ipAddress}`);
      const data = {
        typePayment: 'payment',
        amount: 10000,
        ipAddress,
      };
      setBusy(true);
      const response = await createPayment(data);
      setUrl(response);
      setBusy(false);
    } catch (error) {
      setBusy(false);
      console.log('requestUrlPayment ==>', error);
      if (error?.response?.data?.errors) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'error',
          text1:
            error?.response?.data?.errors[0].message ||
            error?.response?.data?.errors[0].param,
        });
      } else {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'error',
          text1: 'Lỗi máy chủ',
        });
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header} />
      {url ? (
        <WebView
          source={{uri: url}}
          style={styles.containerWebView}
          onNavigationStateChange={(event) => {}}
        />
      ) : (
        <View style={styles.loadingText}>
          <Text>Yêu cầu thất bại</Text>
        </View>
      )}
    </View>
  );
};

export default WebViewPayment;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: statusBarHeight,
    width: '100%',
    backgroundColor: Colors.blue2,
  },
  loadingText: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
