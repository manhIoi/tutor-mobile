import * as React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import {useState} from 'react';
import {Text} from 'react-native-elements';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import ConfigStyle from '../../theme/ConfigStyle';
import CustomPicker from '../common/CustomPicker';
import Styles from '../../theme/MainStyles';
import ModalGooglePlace from '../common/ModalGooglePlace';
import BoxShadow from '../common/BoxShadow';
import Colors from '../../theme/Colors';
import ButtonCustom from '../common/ButtonFooterCustom';
import ViString from '../../theme/ViString';
import {createWithDraw} from '../../api/payment';
import PurchaseHistory from '../../screens/ClassManager/PurchaseHistory';
import IconEmpty from '../../assets/images/svg/empty-list.svg';

const width = Dimensions.get('window').width;
const INITIAL_FORM = {
  numberCard: {
    value: '',
    msgError: '',
  },
  nameBank: {
    value: '',
    msgError: '',
  },
  codeName: {
    value: '',
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
};

const TextForm = (props) => {
  React.useEffect(() => {}, [props]);
  const [form, setForm] = React.useState(INITIAL_FORM);
  const dispatch = useDispatch();
  const balance = useSelector((state) => state.auth.balance);
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
  function validateForm() {
    let validate = true;
    const formData = {...form};
    if (!formData.codeName.value) {
      formData.codeName.msgError = ViString.fieldIsRequired;
      validate = false;
    }
    if (!formData.numberCard.value) {
      formData.numberCard.msgError = ViString.fieldIsRequired;
      validate = false;
    }
    if (!formData.nameBank.value) {
      formData.nameBank.msgError = ViString.fieldIsRequired;
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
    if (formData.total.value > balance) {
      formData.total.msgError = 'Số tiền vượt quá số dư tài khoản';
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
        total: data?.total?.value,
        info: {
          numberIdentification: data?.numberCard?.value,
          nameBank: data?.nameBank?.value,
          codeName: data?.codeName?.value,
          fullName: data?.fullName?.value,
        },
        method: 'banking',
      };
      setBusy(true);
      const create = await createWithDraw(info);
      if (create) {
        setBusy(false);
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Yêu cầu rút tiền thành công',
        });
        props?.onRefresh(false);
      }
    } catch (error) {
      setBusy(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Lỗi hệ thống!',
      });

      console.log(error);
    }
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView>
        <BoxShadow style={styles.shapeContainer}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                flex: 2,
                fontSize: ConfigStyle.font16,
                ...Styles.textBold,
              }}
            >
              Số dư hiện tại
            </Text>
            <Text style={{flex: 2, fontSize: ConfigStyle.font16}}>
              {balance?.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
              })}
            </Text>
          </View>
          {/* <View style={styles.boxShadow}> */}
          {/* <Text style={{fontSize: 16}}>Vui lòng điền thông tin:</Text> */}
          {/* <View> */}
          {/*  <TextInput */}
          {/*    autoCapitalize={'characters'} */}
          {/*    style={styles.textInput} */}
          {/*    placeholder={'Họ và tên'} */}
          {/*    value={form?.fullName?.value} */}
          {/*    onChangeText={(text) => handleChange(text, 'fullName')} */}
          {/*  /> */}
          {/*  {form?.fullName?.msgError ? ( */}
          {/*    <Text style={{...Styles.textError}}> */}
          {/*      {form?.fullName?.msgError} */}
          {/*    </Text> */}
          {/*  ) : null} */}
          {/*  <TextInput */}
          {/*    style={styles.textInput} */}
          {/*    placeholder={'Tên ngân hàng'} */}
          {/*    autoCapitalize={'characters'} */}
          {/*    value={form?.nameBank?.value} */}
          {/*    onChangeText={(text) => handleChange(text, 'nameBank')} */}
          {/*  /> */}
          {/*  {form?.nameBank?.msgError ? ( */}
          {/*    <Text style={{...Styles.textError}}> */}
          {/*      {form?.nameBank?.msgError} */}
          {/*    </Text> */}
          {/*  ) : null} */}
          {/*  <TextInput */}
          {/*    style={styles.textInput} */}
          {/*    placeholder={'Mã ngân hàng'} */}
          {/*    autoCapitalize={'characters'} */}
          {/*    onChangeText={(text) => handleChange(text, 'codeName')} */}
          {/*    value={form?.codeName?.value} */}
          {/*  /> */}
          {/*  {form?.codeName?.msgError ? ( */}
          {/*    <Text style={{...Styles.textError}}> */}
          {/*      {form?.codeName?.msgError} */}
          {/*    </Text> */}
          {/*  ) : null} */}
          {/*  <TextInput */}
          {/*    style={styles.textInput} */}
          {/*    keyboardType={'numeric'} */}
          {/*    placeholder={'Số tài khoản ngân hàng'} */}
          {/*    onChangeText={(text) => handleChange(text, 'numberCard')} */}
          {/*    value={form?.numberCard?.value} */}
          {/*    // onChangeText={(text)=>setBalance(text)} */}
          {/*  /> */}
          {/*  {form?.numberCard?.msgError ? ( */}
          {/*    <Text style={{...Styles.textError}}> */}
          {/*      {form?.numberCard?.msgError} */}
          {/*    </Text> */}
          {/*  ) : null} */}
          {/*  <TextInput */}
          {/*    style={styles.textInput} */}
          {/*    keyboardType={'numeric'} */}
          {/*    placeholder={'Nhập số tiền muốn rút'} */}
          {/*    onChangeText={(text) => handleChange(text, 'total')} */}
          {/*    value={form?.total?.value} */}
          {/*    // onChangeText={(text)=>setBalance(text)} */}
          {/*  /> */}
          {/*  {form?.total?.msgError ? ( */}
          {/*    <Text style={{...Styles.textError}}> */}
          {/*      {form?.total?.msgError} */}
          {/*    </Text> */}
          {/*  ) : null} */}
          {/* </View> */}
          {/* </View> */}

          <View
            style={{
              ...styles.groupBtn,
              justifyContent: 'flex-end',
            }}
          >
            {/* <ButtonCustom */}
            {/*  style={styles.btnAction} */}
            {/*  disabled={ */}
            {/*    new Date(props?.data?.startAt).getTime() < new Date().getTime() */}
            {/*  } */}
            {/*  text={'XEM THÊM'} */}
            {/*  onPress={() => { */}
            {/*    setShow(true); */}
            {/*  }} */}
            {/*  outline={true} */}
            {/* /> */}
            <ButtonCustom
              style={styles.btnAction}
              isBusy={isBusy}
              //
              text={'RÚT TIỀN'}
              onPress={() => {
                props?.navigation?.navigate('Payment');
                // handleSubmit(form);
              }}
            />
          </View>
        </BoxShadow>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  textInput: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    paddingHorizontal: 0,
  },
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
  shapeContainer: {
    paddingVertical: 15,
    shadowColor: '#C0C0C0',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 5,
    backgroundColor: Colors.whiteColor,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginHorizontal: 15,
  },
  btnAction: {
    width: '45%',
    borderRadius: 20,
  },
  groupBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 15,
  },
  boxShadow: {
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginVertical: 10,
    width: '100%',
    backgroundColor: Colors.whiteColor,
    borderColor: '#C0C0C0',
    borderStyle: 'dotted',
    borderRadius: 1,
    position: 'relative',
    fontSize: 12,
  },
});
export default TextForm;
