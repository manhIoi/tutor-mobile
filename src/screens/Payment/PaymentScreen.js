import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {Text} from 'react-native-elements';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import Container from '../../components/common/ContainerAnimated';
import MainStyles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';
import BackgroundGradient from '../../components/common/BackgroudGradient';
import Card from '../../components/Payment/Card';
import CardHeader from '../../components/Payment/CardHeader';
import ViString from '../../theme/ViString';
import Styles from '../../theme/MainStyles';

import BoxShadow from '../../components/common/BoxShadow';
import {createWithDraw} from '../../api/payment';

const INITIAL_FORM = {
  numberIdentification: {
    value: '',
    msgError: '',
  },
  nameBank: {
    value: 'Ngân hàng Ngoại thương (Vietcombank)',
    msgError: '',
  },
  codeName: {
    value: 'VIETCOMBANK',
    msgError: '',
  },
  fullName: {
    value: '',
    msgError: '',
  },
  total: {
    value: 0,
    msgError: '',
  },
  method: {
    value: 'banking',
    msgError: '',
  },
};
const data2 = [
  {
    id: 0,
    image: require('../../assets/images/Payments/vietcombank/vietcombank-vector-logo.png'),
    codeBank: 'VIETCOMBANK',
    nameBanking: 'Ngân hàng Ngoại thương (Vietcombank)',
    checked: true,
  },
  {
    id: 1,
    image: require('../../assets/images/Payments/viettinbank/Logo_của_Vietinbank.png'),
    codeBank: 'VIETINBANK',
    nameBanking: 'Ngân hàng Công thương (Vietinbank)',
    checked: false,
  },
  {
    id: 2,
    image: require('../../assets/images/Payments/bidv/BIDV-logo-200x200.png'),
    codeBank: 'BIDV',
    nameBanking: 'Ngân hàng đầu tư và phát triển Việt Nam (BIDV)',
    checked: false,
  },
  {
    id: 3,
    image: require('../../assets/images/Payments/techcombank/Techcombank_logo.png'),
    codeBank: 'Techcombank',
    nameBanking: 'Ngân hàng Kỹ thương Việt Nam (TechcomBank)',
    checked: false,
  },
  {
    id: 4,
    image: require('../../assets/images/Payments/saccombank/logo-ngan-hang-sacombank.png'),
    codeBank: 'SACOMBANK',
    nameBanking: 'Ngân hàng TMCP Sài Gòn Thương Tín (SacomBank)',
    checked: false,
  },
  {
    id: 5,
    image: require('../../assets/images/Payments/acb/ACB_Logo.png'),
    codeBank: 'ACB',
    nameBanking: 'Ngân hàng ACB',
    checked: false,
  },
];
const PaymentScreen = (props) => {
  const balance = useSelector((state) => state.auth.balance);
  const {navigation} = props;
  const {goBack} = navigation;
  const [isFooter, setIsFooter] = useState(false);
  const [debit, setDebit] = useState(data2);
  const [clickDebit, setClickDebit] = useState(false);
  const [form, setForm] = React.useState(INITIAL_FORM);
  const [isBusy, setBusy] = useState(false);

  function handleChange(value, name) {
    setForm({
      ...form,
      [name]: {
        ...form[name],
        value: value,
        msgError: '',
      },
    });
  }
  function handleChecked(list, itemId, setList) {
    list.map((item) =>
      item.id === itemId
        ? setList([...list], (list[item.id].checked = true))
        : (list[item.id].checked = false),
    );
  }
  function HandleClick(val, setValue) {
    setValue(!val);
  }
  function handleFooter() {
    setIsFooter(true);
  }
  function validateForm() {
    let validate = true;
    const formData = {...form};
    // if (!formData.codeName.value) {
    //   formData.codeName.msgError = ViString.fieldIsRequired;
    //   validate = false;
    // }
    if (!formData.numberIdentification.value) {
      formData.numberIdentification.msgError = ViString.fieldIsRequired;
      validate = false;
    }
    if (!formData.nameBank.value) {
      formData.nameBank.msgError = ViString.fieldIsRequired;
      validate = false;
    }
    if (parseInt(formData.total.value) > balance) {
      formData.total.msgError = 'Số tiền vượt quá số dư tài khoản';
      validate = false;
    }
    if (!formData.fullName.value) {
      formData.fullName.msgError = ViString.fieldIsRequired;
      validate = false;
    }
    if (!formData.total.value) {
      formData.total.msgError = ViString.fieldIsRequired;
      validate = false;
    }

    setForm(formData);
    return validate;
  }
  async function handleSubmit(data) {
    if (!validateForm()) {
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Vui lòng điền đầy đủ thông tin',
      });
      return;
    }
    try {
      // console.log(data);
      const info = {
        total: form?.total?.value,
        info: {
          numberIdentification: form?.numberIdentification?.value,
          nameBank: form?.nameBank?.value,
          codeName: form?.codeName?.value,
          fullName: form?.fullName?.value,
        },
        method: form?.method?.value,
      };
      setBusy(true);
      const create = await createWithDraw(info);
      console.log(create);
      if (create) {
        setBusy(false);
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Yêu cầu rút tiền thành công',
        });
        props.navigation.goBack();
        // props?.onRefresh(false);
      }
    } catch (error) {
      console.log(error);
      setBusy(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Lỗi hệ thống!',
      });

      console.log(error);
    }
  }

  const footer = (
    <TouchableOpacity
      style={styles.btnNext}
      disabled={isBusy}
      onPress={() => {
        // console.log(form)
        handleSubmit();
      }}
    >
      <BackgroundGradient style={{borderRadius: 30}}>
        <Text style={styles.btnNextContent}>Tiếp</Text>
      </BackgroundGradient>
    </TouchableOpacity>
  );

  return (
    <Container
      title="Tài khoản nhận tiền"
      contentBarStyles={{justifyContent: 'space-between'}}
      navigation={props.navigation}
      hideBackground={false}
      arrowBack={true}
      headerHeight={ConfigStyle.statusBarHomeHeightTutor}
      footer={footer}
    >
      <View style={styles.viewContainer}>
        <View style={styles.viewAccording}>
          <Text style={styles.textError}>
            *Trong trường hợp có phát sinh thu nhập hoặc giao dịch bị hủy
          </Text>
          <View style={{marginHorizontal: 14}}>
            <TextInput
              style={styles.textInput}
              placeholder={'Nhập số tiền'}
              keyboardType={'numeric'}
              value={form?.total?.value}
              onChangeText={(text) => handleChange(text, 'total')}
            />
            {form?.total?.msgError ? (
              <Text style={{...Styles.textError}}>{form?.total?.msgError}</Text>
            ) : null}
          </View>
          <View style={{marginTop: 17}}>
            <CardHeader
              title="Ngân hàng nội địa"
              click={clickDebit}
              setClick={setClickDebit}
              action={HandleClick}
              type={'banking'}
              onChange={handleChange}
            />
            {!clickDebit ? (
              <Card
                footer={handleFooter}
                data={debit}
                action={handleChecked}
                setData={setDebit}
                // actionStatus={handleCheckStatus}
                type={'banking'}
                onChange={handleChange}
                form={form}
              />
            ) : null}
          </View>
        </View>
      </View>
    </Container>
  );
};
const styles = StyleSheet.create({
  btnNextContent: {
    color: Colors.whiteColor,
    paddingHorizontal: 8,
    paddingVertical: 8,
    textAlign: 'center',
  },
  btnNext: {
    justifyContent: 'center',
    alignSelf: 'flex-end',
    width: 180,
    marginTop: 10,
    marginRight: 16,
    marginVertical: 10,
  },
  btnOke: {
    color: Colors.whiteColor,
    backgroundColor: Colors.orange,
    fontSize: ConfigStyle.title3,
    paddingHorizontal: 5,
    paddingVertical: 5,
    width: 180,
    textAlign: 'center',
    borderRadius: 20,
  },
  viewContainer: {
    flex: 1,
  },
  viewAccording: {
    backgroundColor: Colors.whiteColor,
    marginTop: ConfigStyle.marginTop1,
  },
  textError: {
    marginVertical: ConfigStyle.btnMarginHorizontal,
    color: '#F14336',
    fontSize: ConfigStyle.title4,
    alignSelf: 'center',
  },
  accordion: {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    marginBottom: 15,
  },
  footer: {
    // position: "absolute",
    marginVertical: 10,
    bottom: 0,
    right: 10,
    width: '100%',
    alignItems: 'flex-end',
    // backgroundColor: 'red'
  },
  card: {
    borderRadius: 5,
    paddingVertical: 15,
    elevation: 20,
    backgroundColor: Colors.whiteColor,
    shadowOffset: {width: 1, height: 1},
    textShadowColor: Colors.black4,
    shadowOpacity: 0.5,
    textShadowRadius: 0.5,
    marginTop: 5,
    flexDirection: 'column',
    marginHorizontal: 14,
    marginVertical: 20,
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.orange,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: ConfigStyle.title5,
    color: Colors.black4,
  },

  subTitle: {
    alignItems: 'center',
    marginBottom: 59,
  },
  subTitleText: {
    color: Colors.black3,
  },
  accordingHeader: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  topicView: {
    flexDirection: 'row',
  },
  topic: {
    color: Colors.black4,
    fontSize: ConfigStyle.font16,
    paddingRight: ConfigStyle.btnPaddingHorizontal,
    ...MainStyles.textBold,
  },
  textInput: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    paddingHorizontal: 0,
  },
});
export default PaymentScreen;
