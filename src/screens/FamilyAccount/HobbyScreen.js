import React, {useEffect, useState} from 'react';
import {Text} from 'react-native-elements';
import {View, StyleSheet} from 'react-native';
import Toast from 'react-native-toast-message';
import Statusbar from '../../components/common/StatusBar';
import ConfigStyle from '../../theme/ConfigStyle';
import Container from '../../components/common/ContainerAnimated';
import Styles from '../../theme/MainStyles';
import SelectMany from '../../components/Hobby/Form';
import {gettopics} from '../../api/topic';
import {getSubjects} from '../../api/subject';
import Teacher from '../../components/Hobby/Teacher';
import ButtonCustomize from '../../components/Tools/ButtonCustomize';
import {updateProfile} from '../../api/users';
import {addFamilyProfile} from '../../api/familyProfile';

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
const INIT_TYPE_OF_TEACHER = {
  teachers: {
    selected: 0,
    msgError: '',
    isBusy: true,
  },
};
const HobbyForm = (props) => {
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
  console.log(props?.route?.params);
  useEffect(() => {
    // getListTopics();
    // getListSubjects();
    handleMountComponent();
  }, []);
  async function handleMountComponent() {
    const promise = [getListTopics(), getListSubjects()];
    await Promise.all(promise);
    if (props.route?.params?._id) {
      const teacherInfo = props.route?.params?.data || {};
      console.log(teacherInfo);
      setData({
        topics: {
          selected: teacherInfo?.topic || [],
          msgError: '',
        },
        subjects: {
          selected: teacherInfo?.subject || [],
          msgError: '',
        },
      });
    }
  }

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

  function validateForm() {
    const currentData = JSON.parse(JSON.stringify(data));
    let valid = true;

    if (!currentData.topics?.selected?.length) {
      currentData.topics.msgError = 'Vui lòng chọn ít nhất 1 lựa chọn';
      valid = false;
    }

    if (!currentData.subjects?.selected?.length) {
      currentData.subjects.msgError = 'Vui lòng chọn ít nhất 1 lựa chọn';
      valid = false;
    }
    setData(currentData);
    return valid;
  }
  async function handleAddFamilyProfile() {
    if (!validateForm()) {
      console.log('validate fail');
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Vui lòng điền đầy đủ thông tin',
      });
      return;
    }
    const dataUpdate = {
      topic: data.topics.selected,
      subject: data.subjects.selected,
      typeOfTeacher: kindOfTeacher.teachers.selected,
    };
    try {
      const dataUpdate = {
        topicId: data.topics.selected,
        subjectId: data.subjects.selected,
        typeOfTeacher: kindOfTeacher.teachers.selected,
      };
      setBusy(true);
      console.log({
        ...params.dataInfo,
        ...dataUpdate,
      });
      const create = await addFamilyProfile({
        ...params.dataInfo,
        ...dataUpdate,
      });
      setBusy(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'success',
        text1: 'Cập nhật thành công ',
      });
      props.navigation.replace('FamilyProfile');
      props.navigation.reset({
        index: 1,
        routes: [{name: 'Profile'}, {name: 'FamilyProfile'}],
      });
    } catch (error) {
      setBusy(false);
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Cập nhật không thành công.',
      });
    }
  }
  async function handleTopic() {
    try {
      const dataUpdate = {
        topic: data.topics.selected,
        subject: data.subjects.selected,
        typeOfTeacher: kindOfTeacher.teachers.selected,
      };
      const update = await updateProfile(dataUpdate);
      if (update) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Cập nhật thành công.',
        });
        props.navigation.reset({
          index: 1,
          routes: [{name: 'Profile'}],
        });
      }
    } catch (error) {
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: ' Lỗi hệ thống',
      });
      console.log(error);
    }
  }
  async function getListTopics(page = 1, limit = 40, loadMore = false) {
    try {
      const response = await gettopics(page, limit);
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
      const response = await getSubjects(page, limit);
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
    >
      <View style={{marginTop: 30}}>
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
          action={(val) => handleChange('teachers', val)}
        />
        {/* {data?.subjects?.msgError ? ( */}
        {/*  <Text style={{...Styles.textError, marginLeft: 20}}> */}
        {/*    {data?.subjects?.msgError} */}
        {/*  </Text> */}
        {/* ) : null} */}
        <View style={styles.viewButton}>
          <ButtonCustomize
            name="Tiếp"
            iconName="arrowright"
            isBusy={isBusy}
            onPress={
              props?.route?.params?._id ? handleTopic : handleAddFamilyProfile
            }
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
