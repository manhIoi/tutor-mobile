import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import {Text} from 'react-native-elements';
import Toast from 'react-native-toast-message';
import ConfigStyle from '../../theme/ConfigStyle';
import Container from '../../components/common/ContainerAnimated';
import Styles from '../../theme/MainStyles';
import BoxShadow from '../../components/common/BoxShadow';
import ChoiceNumberDate from '../../components/CreateRequest/ChoiceNumberDay';
import ChoiceSpecificDay from '../../components/CreateRequest/ChoiceSpecificDay';
import FormInfo from '../../components/BecomeExpert/FormInfo';
import ButtonCustom from '../../components/common/ButtonFooterCustom';
import Loading from '../../components/common/Loading';
import {useDispatch, useSelector} from "react-redux";
import {updateTeacherInfo} from "../../api/users";
import {updateProfile} from "../../lib/slices/authSlice";

const UserCreateRequest = (props) => {
  const user = useSelector(state => state.auth.user)
  const [data, setData] = useState({
    fullName: {
      value: user?.fullName,
    },
    phoneNumber: {
      value: user?.phone,
    },
    gender: {
      value: user?.metaData?.gender || 0,
      msgError: '',
    },
    email: {
      value: user?.metaData?.email ||'',
      msgError: '',
    },
    address: {
      value: user?.address,
      msgError: '',
    },
    yearBirth: {
      value: user?.dob,
      msgError: '',
    },
    university: {
      value: user?.metaData?.university,
      msgError: '',
    },
    description: {
      value: user?.metaData?.description,
      msgError: '',
    },
    subjects: {
      value: user?.subjects,
      msgError: '',
    }
  });
  const [disabled, setDisabled] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
  }, []);

  useEffect(() => {
  }, []);
  function handleChangeData(name, value) {
    const currentData = JSON.parse(JSON.stringify(data));
    currentData[name].value = value;
    currentData[name].msgError = '';
    setData(currentData);
  }

  function validateForm() {
    const form = JSON.parse(JSON.stringify(data));
    let valid = true;
    
    if (!form.subjects?.value?.length) {
      form.subjects.msgError = "Chọn ít nhất một môn học"
      valid =  false
    }

    if (!form.fullName?.value) {
      form.fullName.msgError = 'Trường này là bắt buộc';
      valid = false;
    }

    if (!form.email?.value) {
      form.email.msgError = 'Trường này là bắt buộc';
      valid = false;
    }
    if (
      form.email?.value &&
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        form.email.value,
      )
    ) {
      form.email.msgError = 'Email không hợp lệ';
      valid = false;
    }
    if (!form.address?.value) {
      form.address.msgError = 'Trường này là bắt buộc';
      valid = false;
    }

    if (!form.yearBirth?.value) {
      form.yearBirth.msgError = 'Trường này là bắt buộc';
      valid = false;
    }

    if (!form.university?.value) {
      form.university.msgError = 'Trường này là bắt buộc';
      valid = false;
    }

    if (!form.description?.value) {
      form.description.msgError = 'Trường này là bắt buộc';
      valid = false;
    }

    console.info(`LOG_IT:: form`, form);
    setData(form);
    return valid;
  }
  async function handleNext() {
    try {
      if (!validateForm()) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'error',
          text1: 'Vui lòng điền đầy đủ thông tin',
        });
        return;
      }
      const infoUser = {
        ...user,
        fullName: data.fullName?.value,
        address: data.address?.value,
        dob: data.yearBirth?.value,
        phone: data.phoneNumber?.value,
        subjects: data.subjects?.value,
        metaData: {
          ...user?.medataData,
          gender: data.gender?.value,
          email: data.email?.value,
          university: data.university?.value,
          description: data.description?.value,
        }
      };
      console.info(`LOG_IT:: infoUser`, infoUser);
      // TODO: handle submit
      if (props?.route?.params?.isRequestTeacher || user?.role === 'teacher') {
        props.navigation.navigate('BecomeExpertStepThree', {
          infoUser
        })
      } else {
        const response = await updateTeacherInfo(infoUser?._id, infoUser);
        dispatch(updateProfile(response))
        props.navigation?.popToTop();
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Update thông tin thành công !',
        });
      }
    } catch (e) {
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Update thông tin thất bại !',
      });
    }
  }
  const footer = (
    <BoxShadow style={styles.wrapFooter}>
      <View style={{width: '50%'}}>
        <ButtonCustom
          style={{width: '100%'}}
          // isBusy={isBusy}
          disabled={disabled}
          text={'Tiếp'}
          onPress={handleNext}
        />
      </View>
    </BoxShadow>
  );
  return (
    <Container
      title={'Hồ sơ'}
      arrowBack={true}
      contentBarStyles={{justifyContent: 'space-between'}}
      navigation={props.navigation}
      headerHeight={ConfigStyle.statusBarHeight}
      hideBackground={true}
      footer={footer}
      keyboardShouldPersistTaps={true}
    >
      {loading ? <Loading /> : null}
      <View
        style={{
          ...styles.container,
          paddingTop: 0,
        }}
      >
        <Text style={[Styles.title2RS, styles.title, Styles.textNormal]}>
          Yêu cầu
        </Text>
        <FormInfo data={data}
handleChangeData={handleChangeData} />
      </View>
      <View
        style={{
          ...styles.container,
          marginHorizontal: 10,
          paddingTop: 0,
        }}
      >
        <Text
          style={[
            Styles.title2RS,
            styles.title,
            Styles.textNormal,
            {
              paddingVertical: 5,
            },
          ]}
        >
          Giới thiệu bản thân
        </Text>
        <BoxShadow style={styles.wrapDesc}>
          <Text
            style={{
              ...Styles.textBlack3,
              ...Styles.textLight,
              ...styles.textCounter,
            }}
          >
            {data?.description?.value?.length || 0}/300
          </Text>
          <TextInput
            placeholder={'Nhập giới thiệu tối thiểu 300 ký tự...'}
            style={styles.textDescription}
            multiline
            value={data?.description?.value || ''}
            onChangeText={(value) => handleChangeData('description', value)}
          />
        </BoxShadow>
        {data?.description?.msgError ? (
          <Text style={{...Styles.textError, marginLeft: 10}}>
            {data?.description?.msgError}
          </Text>
        ) : null}
      </View>
    </Container>
  );
};

export default UserCreateRequest;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    paddingTop: 15,
    flex: 1,
  },
  input: {
    height: 43,
    marginHorizontal: 20,
    fontSize: 14,
  },
  wrapInputTitle: {
    borderRadius: 25,
    marginBottom: 5,
  },
  title: {
    marginLeft: 15,
    marginVertical: 10,
  },
  textDescription: {
    marginVertical: 13,
    marginHorizontal: 23,
    marginBottom: 18,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  wrapDesc: {
    minHeight: 120,
    maxHeight: 220,
    position: 'relative',
  },
  textCounter: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    marginRight: 10,
    marginBottom: 7,
  },
  wrapFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 0,
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    borderBottomWidth: 0,
    paddingVertical: 9,
  },
  textBtn: {
    fontSize: 14,
    paddingHorizontal: 55,
    paddingVertical: 4,
  },
  wrapBtn: {
    borderRadius: 15,
  },
  textFooter: {
    fontSize: 12,
  },
});
