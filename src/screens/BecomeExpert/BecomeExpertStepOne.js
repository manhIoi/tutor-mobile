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
import {getTeacherById, teacherGetInfo} from '../../api/users';

const INITIAL_FORM = {
  fullName: {
    value: '',
    msgError: '',
  },
  gender: {
    value: 0,
    msgError: '',
  },
  email: {
    value: '',
    msgError: '',
  },
  address: {
    value: {},
    msgError: '',
  },
  yearBirth: {
    value: '',
    msgError: '',
  },
  university: {
    value: '',
    msgError: '',
  },
  tutorType: {
    value: '',
    msgError: '',
  },
  otherDegree: {
    value: '',
    msgError: '',
  },
  description: {
    value: '',
    msgError: '',
  },
  numberLesson: {
    value: '',
    msgError: '',
  },
  dayStudy: {
    value: [],
    msgError: '',
  },
  province: {
    value: '',
    msgError: '',
  },
};
const UserCreateRequest = (props) => {
  const [data, setData] = useState(INITIAL_FORM);
  const [disabled, setDisabled] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (props.route?.params?._id) {
      getTeacherInfo(props.route.params._id);
    }
  }, []);

  useEffect(() => {
    if (data.numberLesson?.value < data.dayStudy?.value?.length) {
      const currentData = JSON.parse(JSON.stringify(data));
      currentData.dayStudy.value = [];
      setData(currentData);
    }
  }, [data.numberLesson?.value]);
  function handleChangeData(name, value) {
    const currentData = JSON.parse(JSON.stringify(data));
    currentData[name].value = value;
    currentData[name].msgError = '';
    setData(currentData);
  }

  async function getTeacherInfo(id) {
    try {
      setDisabled(true);
      setLoading(true);
      const response = await teacherGetInfo();
      setLoading(false);
      if (response) {
        setTeacherInfo(response);
        setDisabled(false);
        setData({
          fullName: {
            value: response?.fullName,
            msgError: '',
          },
          gender: {
            value: response?.gender,
            msgError: '',
          },
          email: {
            value: response.email,
            msgError: '',
          },
          address: {
            value: {
              desc: response?.address,
              lng: parseFloat(response?.loc?.coordinates?.[0]?.toFixed(6)),
              lat: parseFloat(response?.loc?.coordinates?.[1]?.toFixed(6)),
            },
            msgError: '',
          },
          yearBirth: {
            value: response?.dob
              ? new Date(response.dob)?.getFullYear()?.toString()
              : '',
            msgError: '',
          },
          university: {
            value: response?.university,
            msgError: '',
          },
          tutorType: {
            value: response?.typeOfTeacher,
            msgError: '',
          },
          otherDegree: {
            value: response?.anotherCertificate,
            msgError: '',
          },
          description: {
            value: response?.about,
            msgError: '',
          },
          numberLesson: {
            value: response?.dayPerWeek?.length,
            msgError: '',
          },
          dayStudy: {
            value: response?.dayPerWeek || [],
            msgError: '',
          },
          province: {
            value: response?.city?.id,
            msgError: '',
          },
        });
      }
    } catch (error) {
      console.log('getTeacherInfo ==> ', error);
    }
  }

  function validateForm() {
    const form = JSON.parse(JSON.stringify(data));
    let valid = true;
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
    if (!form.address?.value?.desc) {
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

    if (form.tutorType?.value === '') {
      form.tutorType.msgError = 'Trường này là bắt buộc';
      valid = false;
    }

    if (!form.otherDegree?.value) {
      form.otherDegree.msgError = 'Trường này là bắt buộc';
      valid = false;
    }

    if (!form.description?.value) {
      form.description.msgError = 'Trường này là bắt buộc';
      valid = false;
    }

    if (!form.numberLesson?.value) {
      form.numberLesson.msgError = 'Trường này là bắt buộc';
      valid = false;
    }

    if (!form.province?.value) {
      form.province.msgError = 'Trường này là bắt buộc';
      valid = false;
    }

    if (!form.dayStudy?.value?.length) {
      form.dayStudy.msgError = 'Trường này là bắt buộc';
      valid = false;
    }

    setData(form);
    return valid;
  }
  function handleNext() {
    if (!validateForm()) {
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Vui lòng điền đầy đủ thông tin',
      });
      return;
    }
    const infoUser = {
      fullName: data.fullName?.value,
      gender: data.gender?.value,
      email: data.email?.value,
      address: data.address?.value?.desc,
      yearBirth: data.yearBirth?.value,
      university: data.university?.value,
      tutorType: data.tutorType?.value,
      otherDegree: data.otherDegree?.value,
      description: data.description?.value,
      numberLesson: data.numberLesson?.value,
      dayStudy: data.dayStudy?.value,
      province: data.province?.value,
      lng: parseFloat(data.address?.value?.lng?.toFixed(6)),
      lat: parseFloat(data.address?.value?.lat?.toFixed(6)),
    };
    props.navigation.navigate('BecomeExpertStepTwo', {
      infoUser,
      _id: props.route?.params?._id || '',
      teacherInfo: props.route?.params?._id
        ? {
            topic: teacherInfo?.topic?.map?.((item) => item?._id) || [],
            subject: teacherInfo?.subject?.map?.((item) => item?._id) || [],
            classData: teacherInfo?.typeClass?.map?.((item) => item?.id) || [],
            trainingForm: teacherInfo?.trainingForm || [],
            certificate: teacherInfo?.certificate || [],
            signature: teacherInfo?.signature || [],
            identityCard: teacherInfo?.identityCard || [],
          }
        : {},
    });
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
      title={'Thông tin gia sư'}
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
      <View
        style={{
          ...styles.container,
          marginHorizontal: 10,
          paddingTop: 0,
          marginBottom: 10,
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
          Số buổi học dự kiến
        </Text>
        <ChoiceNumberDate
          value={data.numberLesson?.value}
          handleChange={(value) => handleChangeData('numberLesson', value)}
        />
        {data?.numberLesson?.msgError ? (
          <Text style={{...Styles.textError, marginLeft: 10}}>
            {data?.numberLesson?.msgError}
          </Text>
        ) : null}
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
          Thêm lịch học dự kiến
        </Text>
        <ChoiceSpecificDay
          numberDay={data.numberLesson?.value}
          dayStudy={data.dayStudy?.value}
          handleChange={(value) => handleChangeData('dayStudy', value)}
        />
        {data?.dayStudy?.msgError ? (
          <Text style={{...Styles.textError, marginLeft: 10}}>
            {data?.dayStudy?.msgError}
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
