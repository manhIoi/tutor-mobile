import React, {useEffect, useState} from 'react';
import {Text} from 'react-native-elements';
import {View, StyleSheet} from 'react-native';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import Statusbar from '../../components/common/StatusBar';
import ConfigStyle from '../../theme/ConfigStyle';
import Container from '../../components/common/ContainerAnimated';
import Styles from '../../theme/MainStyles';
import SelectMany from '../../components/Hobby/Form';
import {gettopics, getTopicsWithToken} from '../../api/topic';
import {getSubjects, getSubjectsWithToken} from '../../api/subject';
import Teacher from '../../components/Hobby/Teacher';
import ButtonCustomize from '../../components/Tools/ButtonCustomize';
import {updatForm, upDateFormWithToken, updateProfile} from '../../api/users';
import {checkUser} from '../../lib/slices/authSlice';
import Address from '../../components/Hobby/Address';

const INITIAL_FORM = {
  topics: {
    selected: [],
    msgError: '',
    isBusy: true,
  },
  subjects: {
    selected: [],
    msgError: '',
    isBusy: true,
  },
};
const INIT_ADDRESS = {
  address: {
    value: {},
    msgError: '',
    isBusy: true,
  },
};
const INIT_TYPE_OF_TEACHER = {
  teachers: {
    selected: {},
    msgError: '',
    isBusy: true,
  },
};
const HobbyForm = (props) => {
  const dispatch = useDispatch();
  const {navigation, route} = props;
  const {params} = route;
  const [teacher, setTeacher] = React.useState(false);
  const [isBusy, setBusy] = React.useState(false);
  const [data, setData] = useState(INITIAL_FORM);
  const [showBox, setShowBox] = useState(null);
  const [topics, setTopics] = useState([]);
  const [classData, setClassData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [kindOfTeacher, setKindOfTeacher] = React.useState(
    INIT_TYPE_OF_TEACHER,
  );
  const [address, setAddress] = useState(INIT_ADDRESS);

  useEffect(() => {
    getListTopics();
    getListSubjects();
  }, []);
  function handleChangeData(name, value) {
    const currentData = JSON.parse(JSON.stringify(data));
    const index = currentData[name].selected.indexOf(value);
    if (index === -1) {
      currentData[name].selected?.push(value);
    } else {
      currentData[name].selected?.splice(index, 1);
    }
    currentData[name].msgError = '';
    setData(currentData);
  }
  const handleChange = (name, val) => {
    const currentData = JSON.parse(JSON.stringify(kindOfTeacher));
    currentData.teachers.selected = val;
    currentData.teachers.msgError = '';
    setKindOfTeacher(currentData);
  };
  const handleAddress = (name, val) => {
    const currentData = JSON.parse(JSON.stringify(address));
    currentData.address.value = val;
    currentData.address.msgError = '';
    setAddress(currentData);
  };
  function validateForm() {
    const currentData = JSON.parse(JSON.stringify(data));
    const currentAddress = JSON.parse(JSON.stringify(address));
    let valid = true;

    if (!currentData.topics?.selected?.length) {
      currentData.topics.msgError = 'Vui lòng chọn ít nhất 1 lựa chọn';
      valid = false;
    }

    if (!currentData.subjects?.selected?.length) {
      currentData.subjects.msgError = 'Vui lòng chọn ít nhất 1 lựa chọn';
      valid = false;
    }
    if (!currentAddress.address.value?.desc) {
      currentAddress.address.msgError = 'Vui lòng chọn ít nhất 1 lựa chọn';
      valid = false;
    }
    setData(currentData);
    setAddress(currentAddress);
    if (currentAddress.address.msgError)
      console.log(currentAddress.address.msgError);
    return valid;
  }

  async function handleUpdateProfile() {
    try {
      const data = {
        address: address.address.value?.desc,
        lng: address.address.value?.lng,
        lat: address.address.value?.lat,
      };
      const update = await updateProfile(data);
      if (update) {
        await dispatch(checkUser());
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleAddFamilyProfile() {
    if (!validateForm()) {
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Vui lòng điền đầy đủ thông tin',
      });
      return;
    }
    try {
      const dataUpdate = {
        topic: data.topics.selected,
        subject: data.subjects.selected,
        typeOfTeacher: kindOfTeacher.teachers.selected,
      };
      setBusy(true);
      const promise = [handleUpdateProfile(), updatForm(dataUpdate)];
      await Promise.all(promise);

      // }
      setBusy(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'success',
        text1: 'Cập nhật thành công ',
      });
      if (props.route?.params?.isUpdate) {
        if (props.route?.params?.hasAddress) {
          props.navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          });
        } else {
          await dispatch(checkUser());
          props.navigation.replace('Profile', {screen: 'Account'});
        }
      } else {
        // props.navigation.reset({
        //   index: 0,
        //   routes: [{name: 'Login'}],
        // });
        props.navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      }
    } catch (error) {
      setBusy(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Cập nhật không thành công.',
      });
    }
  }

  async function getListTopics(page = 1, limit = 40, loadMore = false) {
    try {
      let response = null;
      // if (props.route?.params?.token) {
      //   response = await getTopicsWithToken(
      //     page,
      //     limit,
      //     props.route.params.token,
      //   );
      // } else {
      response = await gettopics(page, limit);
      // }
      if (response) {
        if (!loadMore) {
          setTopics(response);
        } else {
          setTopics(topics.concat(response));
        }
      }
    } catch (error) {
      console.log('getListTopics ==>', error);
      throw error;
    }
  }
  async function getListSubjects(page = 1, limit = 40, loadMore = false) {
    try {
      let response = null;
      // if (props.route?.params?.token) {
      //   response = await getSubjectsWithToken(
      //     page,
      //     limit,
      //     props.route.params.token,
      //   );
      // } else {
      response = await getSubjects(page, limit);
      // }
      if (response) {
        if (!loadMore) {
          setSubjects(response);
        } else {
          setSubjects(subjects.concat(response));
        }
      }
    } catch (error) {
      console.log('getListSubjects ==>', error);
      throw error;
    }
  }
  function handleSetShowBox(index, focus) {
    if (focus === false) {
      setShowBox(null);
    } else {
      setShowBox(index);
    }
  }
  return (
    <Container
      title={'Form sở thích'}
      arrowBack={true}
      contentBarStyles={{justifyContent: 'space-between'}}
      navigation={props.navigation}
      headerHeight={ConfigStyle.statusBarHeight}
      keyboardShouldPersistTaps={true}
    >
      <View style={{marginVertical: 30}}>
        <SelectMany
          title={'Chủ đề'}
          data={topics || []}
          number={topics?.length}
          selected={data.topics?.selected}
          showBox={showBox === 1}
          handleChange={(value) => handleChangeData('topics', value)}
          setShowBox={(value) => handleSetShowBox(1, value)}
        />
        {data?.topics?.msgError ? (
          <Text style={{...Styles.textError, marginLeft: 20}}>
            {data?.topics?.msgError}
          </Text>
        ) : null}
        <SelectMany
          title={'Môn học'}
          data={subjects || []}
          number={subjects?.length}
          selected={data.subjects?.selected}
          showBox={showBox === 2}
          handleChange={(value) => handleChangeData('subjects', value)}
          setShowBox={(value) => handleSetShowBox(2, value)}
        />
        {data?.subjects?.msgError ? (
          <Text style={{...Styles.textError, marginLeft: 20}}>
            {data?.subjects?.msgError}
          </Text>
        ) : null}
        <Teacher
          isClicked={teacher}
          setIsClicked={setTeacher}
          token={props.route?.params?.token}
          action={(val) => handleChange('teachers', val)}
        />
        <Address title={'Địa chỉ'}
value={address}
action={handleAddress} />
        {address?.address?.msgError ? (
          <Text style={{...Styles.textError, marginLeft: 20}}>
            {address?.address?.msgError}
          </Text>
        ) : null}

        <View style={styles.viewButton}>
          <ButtonCustomize
            name="Tiếp"
            iconName="arrowright"
            isBusy={isBusy}
            onPress={handleAddFamilyProfile}
          />
        </View>
      </View>
    </Container>
  );
};

export default HobbyForm;

const styles = StyleSheet.create({
  viewButton: {
    marginHorizontal: ConfigStyle.marginHorizontal,
    alignItems: 'flex-end',
    height: 70,
    justifyContent: 'center',
    paddingRight: 10,
    marginVertical: 30,
  },
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
