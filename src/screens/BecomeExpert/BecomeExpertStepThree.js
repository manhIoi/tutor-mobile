import React, {useEffect, useState} from 'react';
import {Text} from 'react-native-elements';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-toast-message';
import ImagePicker from 'react-native-image-crop-picker';
import ConfigStyle from '../../theme/ConfigStyle';
import Container from '../../components/common/ContainerAnimated';
import Styles from '../../theme/MainStyles';
import BoxShadow from '../../components/common/BoxShadow';
import IconAddImage from '../../assets/images/svg/iconAddImage.svg';
import Colors from '../../theme/Colors';
import {uploadImage} from '../../api/uploadImage';
import {addTeacherInfo, updateTeacherInfo} from '../../api/users';
import ButtonCustom from '../../components/common/ButtonFooterCustom';
import CustomActionSheet from '../../components/common/CustomActionSheet';
import config from '../../../config/config';

const INITIAL_FORM = {
  signal: {
    value: {},
    msgError: '',
  },
  identityCardFront: {
    value: {},
    msgError: '',
  },
  identityCardBack: {
    value: {},
    msgError: '',
  },
  degree: {
    value: [],
    msgError: '',
  },
};
const BecomeExpertStepTwo = (props) => {
  const [data, setData] = useState(INITIAL_FORM);
  const [typeAdd, setTypeAdd] = useState({});
  const [isBusy, setBusy] = useState(false);
  const [showPickImage, setShowPickerImage] = useState(false);

  function handleActionSheetOnPress(index) {
    switch (index) {
      case 0:
        ImagePicker.openCamera({
          width: 300,
          height: 400,
          // cropping: true,
        }).then((images) => {
          // props.sendMessage({images});
          handleChangeData(images);
        });
        break;
      case 1: {
        ImagePicker.openPicker({
          multiple: false,
          cropping: false,
        }).then((images) => {
          handleChangeData(images);
        });
        break;
      }
      default:
        break;
    }
  }
  useEffect(() => {
    if (props.route?.params?._id) {
      const teacherInfo = props.route?.params?.teacherInfo || {};
      setData({
        signal: {
          value: teacherInfo?.signature?.[0] || {},
          msgError: '',
        },
        identityCardFront: {
          value: teacherInfo?.identityCard?.[0] || {},
          msgError: '',
        },
        identityCardBack: {
          value: teacherInfo?.identityCard?.[0] || {},
          msgError: '',
        },
        degree: {
          value: teacherInfo?.certificate || [],
          msgError: '',
        },
      });
    }
  }, []);
  function handleChangeData(value) {
    const currentData = JSON.parse(JSON.stringify(data));
    if (typeAdd.index !== null) {
      currentData[typeAdd?.field].value[typeAdd.index] = value;
    } else {
      if (typeAdd.field === 'degree') {
        currentData[typeAdd?.field].value?.push(value);
      } else {
        currentData[typeAdd?.field].value = value;
      }
    }
    currentData[typeAdd?.field].msgError = '';
    setData(currentData);
  }

  function validateForm() {
    const currentData = JSON.parse(JSON.stringify(data));
    let valid = true;
    if (!(data?.signal?.value?.path || data?.signal?.value?.medium)) {
      currentData.signal.msgError = 'Vui lòng chọn ảnh';
      valid = false;
    }
    if (
      !(
        data?.identityCardFront?.value?.path ||
        data?.identityCardFront?.value?.medium
      )
    ) {
      currentData.identityCardFront.msgError = 'Vui lòng chọn ảnh';
      valid = false;
    }
    if (
      !(
        data?.identityCardBack?.value?.path ||
        data?.identityCardBack?.value?.medium
      )
    ) {
      currentData.identityCardBack.msgError = 'Vui lòng chọn ảnh';
      valid = false;
    }
    if (!(data?.degree?.value?.[0]?.path || data?.degree?.value?.[0]?.medium)) {
      currentData.degree.msgError = 'Vui lòng chọn ảnh';
      valid = false;
    }
    setData(currentData);
    return valid;
  }

  async function handleUploadImage(image) {
    try {
      const formData = new FormData();
      formData.append('file', {
        name: `${new Date()}.jpg`,
        type: image.mime,
        uri: image.path,
      });
      const upload = await uploadImage(formData);
      return upload?.data?.images[0] || {};
    } catch (error) {
      console.log(error);
    }
  }
  async function handleSubmitRequest() {
    if (!validateForm()) {
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Vui lòng điền đầy đủ thông tin',
      });
      return;
    }

    setBusy(true);
    const promise = [
      data.signal?.value?.medium
        ? data.signal?.value
        : await handleUploadImage(data.signal?.value),
      data.identityCardBack?.value?.medium
        ? data.identityCardBack?.value
        : await handleUploadImage(data.identityCardBack?.value),
      data.identityCardBack?.value?.medium
        ? data.identityCardBack?.value
        : await handleUploadImage(data.identityCardBack?.value),
    ];
    const promise2 = data.degree.value?.map(async (item) =>
      item?.medium ? item : await handleUploadImage(item),
    );
    const dataResult = await Promise.all(promise);
    const dataResult2 = await Promise.all(promise2);
    if (dataResult && dataResult2) {
      const dataForm = props.route?.params?.infoUser;
      const dataPost = {
        fullName: dataForm.fullName,
        about: dataForm.description,
        topic: dataForm.topics,
        subject: dataForm.subjects,
        typeOfTeacher: dataForm.tutorType,
        dob: new Date(dataForm.yearBirth, 5).toISOString(),
        email: dataForm.email,
        address: dataForm.address,
        isOnline: true,
        typeClass: dataForm.class,
        university: dataForm.university,
        gender: dataForm.gender,
        anotherCertificate: dataForm.otherDegree,
        dayPerWeek: dataForm.dayStudy,
        city: dataForm.province,
        signature: dataResult[0],
        identityCard: [dataResult[1], dataResult[2]],
        certificate: dataResult2,
        trainingForm: dataForm.teachingType,
        lng: dataForm.lng,
        lat: dataForm.lat,
      };
      if (props.route?.params?._id) {
        await handleUpdateTeacherInfo(dataPost);
      } else {
        await handleRequestTeacher(dataPost);
      }
    } else {
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Upload hình ảnh xảy ra lỗi',
      });
    }
    setBusy(true);
  }

  async function handleRequestTeacher(data) {
    try {
      setBusy(true);
      const response = await addTeacherInfo(data);
      setBusy(false);
      if (response) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Cập nhật thông tin giáo viên thành công',
        });
        // props.navigation.push('Payment');
        // props.navigation.reset({
        //   index: 0,
        //   routes: [{name: 'Profile'}],
        // });
        // props.navigation.push('Payment');
        props.navigation.reset({
          index: 0,
          routes: [{name: 'Profile'}],
        });
      }
    } catch (error) {
      setBusy(false);
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

  async function handleUpdateTeacherInfo(data) {
    try {
      setBusy(true);
      const response = await updateTeacherInfo(data);
      setBusy(false);
      if (response) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Cập nhật thông tin giáo viên thành công',
        });
        props.navigation.reset({
          index: 0,
          routes: [{name: 'Profile'}],
        });
      }
    } catch (error) {
      setBusy(false);
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

  function handleAddImage(field, type, index) {
    if (!isBusy) {
      setTypeAdd({field, type, index});
      setShowPickerImage(true);
      setTimeout(() => {
        setShowPickerImage(false);
      }, 200);
    }
  }

  const footer = (
    <BoxShadow style={styles.wrapFooter}>
      <View style={{width: '50%'}}>
        <ButtonCustom
          style={{width: '100%'}}
          isBusy={isBusy}
          text={props.route?.params?._id ? 'Chỉnh sửa' : 'Xong'}
          onPress={handleSubmitRequest}
        />
      </View>
    </BoxShadow>
  );

  const iconAddImage = (text, field, type = 'add', index = null) => (
    <TouchableOpacity
      onPress={() => handleAddImage(field, type, index)}
      style={styles.wrapIconAdd}
    >
      <View style={{alignItems: 'center'}}>
        {type === 'add' ? <IconAddImage width={44}
height={31} /> : null}

        {text && type === 'add' ? (
          <Text style={Styles.textBlack3}>{text}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
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
    >
      <View
        style={{
          ...styles.container,
          paddingTop: 0,
        }}
      >
        <Text style={[Styles.title2RS, styles.title, Styles.textNormal]}>
          Chữ ký
        </Text>
        <View>
          {data.signal?.value?.path || data.signal?.value?.medium ? (
            <BoxShadow style={styles.wrapImageSignal}>
              <FastImage
                source={{
                  uri:
                    data.signal?.value?.path ||
                    `${config.IMAGE_MD_URL}${data?.signal?.value?.medium}`,
                }}
                style={styles.imageStyle}
              />
              {iconAddImage('', 'signal', 'replace')}
            </BoxShadow>
          ) : (
            <View style={[styles.wrapImageSignal, styles.wrapEmptyImage]}>
              {iconAddImage('', 'signal')}
            </View>
          )}
          {data.signal?.msgError ? (
            <Text style={{...Styles.textError, marginLeft: 10}}>
              {data.signal?.msgError}
            </Text>
          ) : null}
        </View>
        <Text style={[Styles.title2RS, styles.title, Styles.textNormal]}>
          Chứng minh nhân dân
        </Text>
        <View>
          {data.identityCardFront?.value?.path ||
          data.identityCardFront?.value?.medium ? (
            <BoxShadow style={styles.wrapImageUserID}>
              <FastImage
                source={{
                  uri:
                    data.identityCardFront?.value?.path ||
                    `${config.IMAGE_MD_URL}${data?.identityCardFront?.value?.medium}`,
                }}
                style={styles.imageStyle}
              />
              {iconAddImage('Mặt trước', 'identityCardFront', 'replace')}
            </BoxShadow>
          ) : (
            <View style={[styles.wrapImageUserID, styles.wrapEmptyImage]}>
              {iconAddImage('Mặt trước', 'identityCardFront')}
            </View>
          )}
          {data.identityCardFront?.msgError ? (
            <Text
              style={{...Styles.textError, marginLeft: 10, marginBottom: 10}}
            >
              {data.identityCardFront?.msgError}
            </Text>
          ) : null}
        </View>
        <View>
          {data.identityCardBack?.value?.path ||
          data.identityCardBack?.value?.medium ? (
            <BoxShadow style={styles.wrapImageUserID}>
              <FastImage
                source={{
                  uri:
                    data.identityCardBack?.value?.path ||
                    `${config.IMAGE_MD_URL}${data?.identityCardBack?.value?.medium}`,
                }}
                style={styles.imageStyle}
              />
              {iconAddImage('Mặt sau', 'identityCardBack', 'replace')}
            </BoxShadow>
          ) : (
            <View style={[styles.wrapImageUserID, styles.wrapEmptyImage]}>
              {iconAddImage('Mặt sau', 'identityCardBack')}
            </View>
          )}
          {data.identityCardBack?.msgError ? (
            <Text style={{...Styles.textError, marginLeft: 10}}>
              {data.identityCardBack?.msgError}
            </Text>
          ) : null}
        </View>
        <Text
          style={[
            Styles.title2RS,
            styles.title,
            Styles.textNormal,
            {marginBottom: 0},
          ]}
        >
          Hình ảnh bằng cấp
        </Text>
        <View style={[Styles.flexRow, {marginLeft: 15}]}>
          <Text style={Styles.textBold}>( bằng tốt nghiệp </Text>
          <Text>hoặc</Text>
          <Text style={Styles.textBold}> thẻ sinh viên )</Text>
          <Text style={{marginLeft: 5}}>
            {data.degree?.value?.length || 0}/5
          </Text>
        </View>
        {data.degree?.value?.map((item, index) => (
          <BoxShadow
            key={index}
            style={[styles.wrapImageUserID, styles.wrapEmptyImage]}
          >
            <FastImage
              source={{
                uri: item?.path
                  ? item?.path
                  : item?.medium
                  ? `${config.IMAGE_MD_URL}${item?.medium}`
                  : '',
              }}
              style={[styles.imageStyle, {height: 100}]}
            />
            {iconAddImage('', 'degree', 'replace', index)}
          </BoxShadow>
        ))}
        {!(data.degree?.value?.length === 5) ? (
          <View
            style={[
              styles.wrapImageDegree,
              styles.wrapEmptyImage,
              {marginTop: 10},
            ]}
          >
            {iconAddImage('', 'degree')}
          </View>
        ) : null}
        {data.degree?.msgError ? (
          <Text style={{...Styles.textError, marginLeft: 10}}>
            {data.degree?.msgError}
          </Text>
        ) : null}
        <CustomActionSheet
          title={'Chọn hình ảnh từ ?'}
          arrayActions={['Máy ảnh', 'Thư viện hình ảnh', 'Hủy']}
          actionSheetOnPress={handleActionSheetOnPress}
          shouldShow={showPickImage}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
        />
      </View>
    </Container>
  );
};

export default BecomeExpertStepTwo;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
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
  wrapImageSignal: {
    flex: 1,
    height: 120,
  },
  wrapImageUserID: {
    flex: 1,
    height: 140,
  },
  wrapImageDegree: {
    flex: 1,
    height: 100,
  },
  wrapIconAdd: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapEmptyImage: {
    backgroundColor: Colors.grey2,
    marginBottom: 5,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});
