import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { Text } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';
import FastImageCustom from '../../components/common/FastImage';
import ConfigStyle from '../../theme/ConfigStyle';
import Container from '../../components/common/ContainerAnimated';
import Styles from '../../theme/MainStyles';
import BoxShadow from '../../components/common/BoxShadow';
import BoxRequesting from '../../components/CreateRequest/BoxRequesting';
import ChoiceNumberDate from '../../components/CreateRequest/ChoiceNumberDay';
import ChoiceSpecificDay from '../../components/CreateRequest/ChoiceSpecificDay';
import ButtonCustom from '../../components/common/ButtonFooterCustom';
import Loading from '../../components/common/Loading';
import {
  getTypeClassAPI,
  requestCreateClass,
  userRequestClass,
  teacherEditClass,
  studentGetClassById,
  getRequestById,
  userEditRequest,
} from '../../api/class';
import { getTeacherInfo } from '../../api/teacherInformation';
import { gettopics } from '../../api/topic';
import ConstantValue from '../../constants';
import Colors from '../../theme/Colors';
import IconAddImage from '../../assets/images/svg/iconAddImage.svg';
import { handleUploadImage } from '../../api/uploadImage';
import CustomActionSheet from '../../components/common/CustomActionSheet';
import { getListTeacher, getSubjectWithTopic } from '../../api/users';
import config from '../../../config/config';



const UserCreateRequest = (props) => {
  const inputDesc = React.useRef();
  const subjects = useSelector(state => state.subject.value);
  const isHasTeacher = !!props.route?.params?.teacher?._id
  const subjectsOfTeacher = isHasTeacher && props.route?.params?.teacher?.subjects || []

  const animationRotate = new Animated.Value(-90);
  const [data, setData] = useState({
    title: {
      value: '',
      msgError: '',
    },
    address: {
      value: {},
      msgError: '',
    },
    dateStart: {
      value: '',
      msgError: '',
    },
    tutorType: {
      value: '',
      msgError: '',
    },
    phoneNumber: {
      value: '',
      msgError: '',
    },
    teachingType: {
      value: '',
      msgError: '',
    },
    topic: {
      value: '',
      msgError: '',
    },
    subject: {
      value: '',
      msgError: '',
    },
    class: {
      value: '',
      msgError: '',
    },
    time: {
      value: '',
      msgError: '',
    },
    description: {
      value: '',
      msgError: '',
    },
    numberLesson: {
      value: 0,
      msgError: '',
    },
    dayStudy: {
      value: [],
      msgError: '',
    },
    timeStart: {
      value: new Date(),
      msgError: '',
    },
    totalLesson: {
      value: '',
      msgError: '',
    },
    maxStudent: {
      value: '1',
      msgError: '',
    },
    price: {
      value: '',
      msgError: '',
    },
    avatar: {
      value: {},
      msgError: '',
    },
    location: {
      value: {},
      msgError: '',
    },
  });
  const [topics, setTopics] = useState([]);

  const [classData, setClassData] = useState([]);
  const [typeTeacher, setTypeTeacher] = useState([]);
  const [isBusy, setBusy] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);
  const [showPickImage, setShowPickerImage] = useState(false);
  const [scrollEnd, setScrollEnd] = useState('');
  const [loading, setLoading] = useState(false);

  function handleActionSheetOnPress(index) {
    switch (index) {
      case 0:
        ImagePicker.openCamera({
          width: 300,
          height: 400,
          // cropping: true,
        }).then((images) => {
          // props.sendMessage({images});
          handleChangeData('avatar', images);
        });
        break;
      case 1: {
        ImagePicker.openPicker({
          multiple: false,
          cropping: false,
        }).then((images) => {
          handleChangeData('avatar', images);
        });
        break;
      }
      default:
        break;
    }
  }
  const user = useSelector((state) => state.auth.user);
  const type = user.role === 'teacher' ? 1 : 0; // 0: user create request , 1: teacher create class
  useEffect(() => {
    componentWillMount();
  }, []);
  async function componentWillMount() {
    // setLoading(true);
    const promise = [
      // getProvince(),
      // getTopics(),
      // getTypeClass(),
      // getTypeTeacher(),
      // getTeacher(),
      // props.route?.params?._id ? initDataClass(props.route.params._id) : null,
    ];
    await Promise.all(promise)
    // if (props.route?.params?._id) {
    //   await initDataClass(props.route.params._id);
    // }
    setLoading(false);
  }

  useEffect(() => {
    if (showSuggest) {
      Animated.timing(animationRotate, {
        toValue: 0,
        duration: 200,
      }).start();
    } else {
      Animated.timing(animationRotate, {
        toValue: -90,
        duration: 200,
      }).start();
    }
  }, [showSuggest]);
  const RotateData = animationRotate.interpolate({
    inputRange: [-90, 0],
    outputRange: ['-90deg', '0deg'],
  });
  useEffect(() => {
    setData({
      ...data,
      dayStudy: {
        ...data.dayStudy,
        msgError: '',
      },
    });
    if (data.numberLesson?.value < data.dayStudy?.value?.length) {
      setData({
        ...data,
        dayStudy: {
          value: [],
          msgError: '',
        },
      });
    }
  }, [data.numberLesson?.value]);

  useEffect(() => {
    // setData({
    //   ...data,
    //   numberLesson: {
    //     ...data.numberLesson,
    //     msgError: '',
    //   },
    // });
    // if (data.numberLesson?.value > data.totalLesson?.value) {
    //   setData({
    //     ...data,
    //     numberLesson: {
    //       value: 0,
    //       msgError: '',
    //     },
    //   });
    // }
  }, [data.numberLesson?.value]);
  async function getTopics() {
    try {
      const response = await gettopics(1, 50);
      setTopics(response);
    } catch (error) {
      console.log('getTopics ==>', error);
      throw error;
    }
  }
  async function getTypeClass() {
    try {
      const response = await getTypeClassAPI(1, 50);
      setClassData(response);
    } catch (error) {
      console.log('getTypeClass ==>', error);
      throw error;
    }
  }

  function handleChangeData(name, value) {
    console.info("LOGGER:: name,value", name, value);
    setData({
      ...data,
      [name]: {
        value: value,
        msgError: '',
      },
    });
  }
  function validateForm() {
    const form = JSON.parse(JSON.stringify(data));
    let valid = true;
    if (!form.title?.value) {
      form.title.msgError = 'Trường này là bắt buộc';
      valid = false;
    }
    if (!form.address?.value) {
      form.address.msgError = 'Trường này là bắt buộc';
      valid = false;
    }
    if (!form.dateStart?.value) {
      form.dateStart.msgError = 'Trường này là bắt buộc';
      valid = false;
    }
    if (!form.phoneNumber?.value && type !== 1) {
      form.phoneNumber.msgError = 'Trường này là bắt buộc';
      valid = false;
    }
    if (form.teachingType?.value === '') {
      form.teachingType.msgError = 'Trường này là bắt buộc';
      valid = false;
    }
    if (!form.subject?.value) {
      form.subject.msgError = 'Trường này là bắt buộc';
      valid = false;
    }
    if (!form.time?.value) {
      form.time.msgError = 'Trường này là bắt buộc';
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
    if (!form.dayStudy?.value?.length) {
      form.dayStudy.msgError = 'Trường này là bắt buộc';
      valid = false;
    }
    if (
      form.dayStudy?.value?.length &&
      form.dayStudy?.value?.length < form.numberLesson?.value
    ) {
      form.dayStudy.msgError = `Vui lòng chọn đầy đủ ${form.numberLesson?.value} buổi`;
      valid = false;
    }
    if (!form.timeStart?.value) {
      form.timeStart.msgError = 'Trường này là bắt buộc';
      valid = false;
    }
    if (!(form.maxStudent?.value > 0) && type === 1) {
      form.maxStudent.msgError = 'Trường này là bắt buộc';
      valid = false;
    }
    if (!(form.price?.value > 0)) {
      form.price.msgError = 'Trường này là bắt buộc';
      valid = false;
    }
    setData({
      ...data,
      title: {
        ...data.title,
        msgError: form.title?.msgError || '',
      },
      address: {
        ...data.address,
        msgError: form.address?.msgError || '',
      },
      dateStart: {
        ...data.dateStart,
        msgError: form.dateStart?.msgError || '',
      },
      tutorType: {
        ...data.tutorType,
        msgError: form.tutorType?.msgError || '',
      },
      phoneNumber: {
        ...data.phoneNumber,
        msgError: form.phoneNumber?.msgError || '',
      },
      teachingType: {
        ...data.teachingType,
        msgError: form.teachingType?.msgError || '',
      },
      topic: {
        ...data.topic,
        msgError: form.topic?.msgError || '',
      },
      subject: {
        ...data.subject,
        msgError: form.subject?.msgError || '',
      },
      class: {
        ...data.class,
        msgError: form.class?.msgError || '',
      },
      time: {
        ...data.time,
        msgError: form.time?.msgError || '',
      },
      description: {
        ...data.description,
        msgError: form.description?.msgError || '',
      },
      numberLesson: {
        ...data.numberLesson,
        msgError: form.numberLesson?.msgError || '',
      },
      dayStudy: {
        ...data.dayStudy,
        msgError: form.dayStudy?.msgError || '',
      },
      timeStart: {
        ...data.timeStart,
        msgError: form.timeStart?.msgError || '',
      },
      totalLesson: {
        ...data.totalLesson,
        msgError: form.totalLesson?.msgError || '',
      },
      maxStudent: {
        ...data.maxStudent,
        msgError: form.maxStudent?.msgError || '',
      },
      price: {
        ...data.price,
        msgError: form.price?.msgError || '',
      },
    });
    return valid;
  }

  async function handleCreateClass(data) {
    try {
      setBusy(true);
      const response = await requestCreateClass(data);
      setBusy(false);
      if (response) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Yêu cầu tạo lớp của bạn đã được ghi nhận',
        });
        props.navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    } catch (error) {
      console.log('handleCreateClass ==>', error);
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

  async function handleUserRequestClass(data, idTeacher) {
    try {
      setBusy(true);
      const response = await userRequestClass(data, idTeacher);
      console.info("LOGGER:: response", response);
      setBusy(false);
      if (response) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Yêu cầu lớp học của bạn đã được ghi nhận',
        });
        props.navigation.goBack();
      }
    } catch (error) {
      console.log('handleUserRequestClass ==>', error);
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

  async function handleUserEditRequest(data) {
    try {
      setBusy(true);
      const response = await userEditRequest(data, props.route?.params?._id);
      setBusy(false);
      if (response) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Chỉnh sửa yêu cầu thành công',
        });
        props.navigation.goBack();
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

  async function editClass(id, data) {
    try {
      setBusy(true);
      const response = await teacherEditClass(id, data);
      setBusy(false);
      if (response) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Chỉnh sửa lớp học thành công',
        });
        props.navigation.goBack();
      }
    } catch (error) {
      setBusy(false);
      console.log('teacherEditClass ==>', error);
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
          text1: 'Chỉnh sửa lớp học thất bại',
          text2: 'Lỗi máy chủ',
        });
      }
    }
  }

  async function handleSubmitRequest() {
    // TODO: implement
    if (!validateForm()) {
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Vui lòng điền đầy đủ thông tin',
      });
      return;
    }
    const day = data.dateStart?.value?.getDate();
    const month = data.dateStart?.value?.getMonth();
    const year = data.dateStart?.value?.getFullYear();

    const dayEnd = data.dateEnd?.value?.getDate();
    const monthEnd = data.dateEnd?.value?.getMonth();
    const yearEnd = data.dateEnd?.value?.getFullYear();
    setBusy(true);
    const formRequest = {
      title: data.title?.value,
      description: data.description?.value,
      content: 'string',
      address: data.address?.value,
      startAt: new Date(year, month, day),
      endAt: new Date(yearEnd, monthEnd, dayEnd),
      timeStart: data?.timeStart.value,
      timeline: data.time?.value * 45,
      numOfStudents: Number(data.maxStudent?.value),
      weekDays: data.dayStudy?.value,
      numberLesson: data.numberLesson.value,
      price: Number(data.price?.value),
      subjects: [{ _id: data.subject?.value }],
      typeClass: data.class?.value,
      trainingForm: [data.teachingType?.value],
      isOnline: !data.teachingType?.value,
      user: { _id: user._id },
      students: [{ _id: user?._id }],
      isTeacherApproved: false,
      status: isHasTeacher ? 1 : 0,
    };
    await handleUserRequestClass(formRequest, props.route?.params?.teacher?._id);
  }
  function handleAddImage() {
    setShowPickerImage(true);
    setTimeout(() => {
      setShowPickerImage(false);
    }, 200);
  }

  const footer = (
    <BoxShadow style={styles.wrapFooter}>
      <Text style={styles.textFooter}>
        {type === 1 ? '' : 'Đăng yêu cầu này ngay'}
      </Text>
      <ButtonCustom
        isBusy={isBusy}
        //TODO: disabled={disabled}
        text={"TẠO NGAY"}
        style={styles.btnAction}
        onPress={handleSubmitRequest}
      />
    </BoxShadow>
  );

  const iconAddImage = (showIcon = true) => (
    <TouchableOpacity
      onPress={() => handleAddImage()}
      disabled={isBusy}
      style={styles.wrapIconAdd}
    >
      <View style={{ alignItems: 'center' }}>
        {showIcon ? <IconAddImage width={44}
          height={31} /> : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <Container
      title={"Tạo yêu cầu"}
      arrowBack={true}
      contentBarStyles={{ justifyContent: 'space-between' }}
      navigation={props.navigation}
      headerHeight={ConfigStyle.statusBarHeight}
      hideBackground={false}
      footer={footer}
      scrollEnd={scrollEnd}
      keyboardShouldPersistTaps={true}
    >
      {loading ? <Loading /> : null}
      <View style={styles.container}>
        <BoxShadow>
          <Text style={[Styles.title2RS, styles.title]}>Tiêu đề</Text>
          <TextInput
            style={styles.input}
            placeholderStyle={Styles.textLight}
            placeholder={'VD : Tìm lớp Photoshop cơ bản'}
            editable={!isBusy}
            value={data?.title?.value || ''}
            onChangeText={(value) => handleChangeData('title', value)}
          />
        </BoxShadow>

        {data?.title?.msgError ? (
          <Text style={{ ...Styles.textError, marginLeft: 10 }}>
            {data?.title?.msgError}
          </Text>
        ) : null}
      </View>
      <View
        style={{
          ...styles.container,
          paddingTop: 0,
        }}
      >
        <Text style={[Styles.title2RS, styles.title]}>Yêu cầu</Text>
        <BoxRequesting
          data={data}
          isBusy={isBusy}
          isHasTeacher={isHasTeacher}
          dataSelect={{
            teachingType: ConstantValue.teachingType,
            subjects: isHasTeacher ? subjectsOfTeacher : subjects,
            classData,
            topics,
            typeTeacher,
          }}
          handleChangeData={handleChangeData}
          type={type}
        />
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
            {
              paddingVertical: 5,
            },
          ]}
        >
          Mô tả chi tiết
        </Text>
        <TouchableWithoutFeedback
          onPress={() => inputDesc?.current?.focus()}
          disabled={isBusy}
        >
          <View>
            <BoxShadow style={styles.wrapDesc}>
              <TextInput
                ref={inputDesc}
                placeholder={'Nhập mô tả'}
                style={styles.textDescription}
                placeholderStyle={Styles.textLight}
                multiline
                editable={!isBusy}
                scrollEnabled={false}
                value={data?.description?.value || ''}
                onChangeText={(value) => handleChangeData('description', value)}
              />
            </BoxShadow>
          </View>
        </TouchableWithoutFeedback>
        {data?.description?.msgError ? (
          <Text style={{ ...Styles.textError, marginLeft: 10 }}>
            {data?.description?.msgError}
          </Text>
        ) : null}
      </View>
      <View
        style={{
          ...styles.container,
          marginHorizontal: 10,
          paddingTop: 0,
          marginBottom: 0,
        }}
      >
        <Text
          style={[
            Styles.title2RS,
            styles.title,
            {
              paddingVertical: 5,
            },
          ]}
        >
          Số buổi học trong tuần
        </Text>
        <ChoiceNumberDate
          value={data.numberLesson?.value}
          disabled={isBusy}
          handleChange={(value) => handleChangeData('numberLesson', value)}
        />
        {data?.numberLesson?.msgError ? (
          <Text style={{ ...Styles.textError, marginLeft: 10 }}>
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
            {
              paddingBottom: 5,
              paddingTop: 0,
              marginTop: 15,
            },
          ]}
        >
          Thêm lịch học
        </Text>
        <ChoiceSpecificDay
          numberDay={data.numberLesson?.value}
          dayStudy={data.dayStudy?.value}
          disabled={isBusy}
          handleChange={(value) => handleChangeData('dayStudy', value)}
        />
        {data?.dayStudy?.msgError ? (
          <Text style={{ ...Styles.textError, marginLeft: 10 }}>
            {data?.dayStudy?.msgError}
          </Text>
        ) : null}
      </View>

      <CustomActionSheet
        title={'Chọn hình ảnh từ ?'}
        arrayActions={['Máy ảnh', 'Thư viện hình ảnh', 'Hủy']}
        actionSheetOnPress={handleActionSheetOnPress}
        shouldShow={showPickImage}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
      />
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
    borderTopWidth: 1,
    borderTopColor: Colors.grey,
  },
  wrapInputTitle: {
    borderRadius: 25,
    marginBottom: 5,
  },
  title: {
    marginLeft: 15,
    marginVertical: 10,
    marginTop: 20,
    color: Colors.orange2,
    fontWeight: "bold",
  },
  textDescription: {
    marginVertical: 13,
    marginHorizontal: 23,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  wrapDesc: {
    height: 136,
  },
  wrapFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    paddingHorizontal: 35,
    paddingVertical: 4,
  },
  wrapBtn: {
    borderRadius: 15,
  },
  wrapBtnLoading: {
    borderRadius: 15,
    backgroundColor: Colors.grey,
  },
  wrapSpinner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: 'rgba(192,192,192,0.11)',
  },
  textFooter: {
    fontSize: 12,
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
  wrapImageDegree: {
    flex: 1,
    height: 140,
  },
  wrapImageSignal: {
    flex: 1,
    height: 140,
  },
  btnAction: {
    width: '45%',
  },
});
