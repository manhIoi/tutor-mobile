import React, {useEffect, useState} from 'react';
import {Text} from 'react-native-elements';
import {View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import Toast from 'react-native-toast-message';
import Statusbar from '../../components/common/StatusBar';
import ConfigStyle from '../../theme/ConfigStyle';
import Container from '../../components/common/ContainerAnimated';
import Styles from '../../theme/MainStyles';
import BoxShadow from '../../components/common/BoxShadow';
import BackgroundGradient from '../../components/common/BackgroudGradient';
import SelectMany from '../../components/Hobby/Form';
import {gettopics} from '../../api/topic';
import {getSubjects} from '../../api/subject';
import {getTypeClassAPI} from '../../api/class';
import ButtonCustom from '../../components/common/ButtonFooterCustom';

const INITIAL_FORM = {
  topics: {
    selected: [],
    msgError: '',
  },
  subjects: {
    selected: [],
    msgError: '',
  },
  class: {
    selected: [],
    msgError: '',
  },
  teachingType: {
    value: [
      {
        _id: 0,
        name: 'Online',
      },
      {
        _id: 1,
        name: 'Offline',
      },
    ],
    selected: [],
    msgError: '',
  },
};
const BecomeExpertStepTwo = (props) => {
  const [data, setData] = useState(INITIAL_FORM);
  const [showBox, setShowBox] = useState(null);
  const [topics, setTopics] = useState([]);
  const [classData, setClassData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
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

    if (!currentData.class?.selected?.length) {
      currentData.class.msgError = 'Vui lòng chọn ít nhất 1 lựa chọn';
      valid = false;
    }

    if (!currentData.teachingType?.selected?.length) {
      currentData.teachingType.msgError = 'Vui lòng chọn ít nhất 1 lựa chọn';
      valid = false;
    }
    setData(currentData);
    return valid;
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

  async function getTypeClass(page = 1, limit = 40, loadMore = false) {
    try {
      const response = await getTypeClassAPI(1, 50);
      if (response) {
        if (!loadMore) {
          setClassData(response);
        } else {
          setClassData(classData.concat(response));
        }
      }
    } catch (error) {
      console.log('getTypeClass ==>', error);
      throw error;
    }
  }

  function handleSubmitRequest() {
    if (!validateForm()) {
      Toast.show({
        ...ConfigStyle.toastDefault,
        type: 'error',
        text1: 'Vui lòng điền đầy đủ thông tin',
      });
      return;
    }
    const infoUser = {
      ...props.route?.params?.infoUser,
      topics: data.topics?.selected,
      subjects: data.subjects?.selected,
      class: data.class?.selected,
      teachingType: data.teachingType?.selected,
    };
    props.navigation.navigate('BecomeExpertStepThree', {
      infoUser,
    });
  }
  function handleSetShowBox(index, focus) {
    if (focus === false) {
      setShowBox(null);
    } else {
      setShowBox(index);
    }
  }
  const footer = (
    <BoxShadow style={styles.wrapFooter}>
      <View style={{width: '50%'}}>
        <ButtonCustom
          style={{width: '100%'}}
          disabled={disabled}
          text={'Tiếp'}
          onPress={handleSubmitRequest}
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
    >
      <SelectMany
        title={'Chủ đề'}
        data={topics || []}
        number={topics?.length}
        selected={data.topics?.selected}
        showBox={showBox === 1}
        isBusy={disabled}
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
        isBusy={disabled}
        handleChange={(value) => handleChangeData('subjects', value)}
        setShowBox={(value) => handleSetShowBox(2, value)}
      />
      {data?.subjects?.msgError ? (
        <Text style={{...Styles.textError, marginLeft: 20}}>
          {data?.subjects?.msgError}
        </Text>
      ) : null}
      <SelectMany
        title={'Lớp học'}
        data={classData || []}
        number={classData?.length}
        selected={data.class?.selected}
        showBox={showBox === 3}
        isBusy={disabled}
        handleChange={(value) => handleChangeData('class', value)}
        setShowBox={(value) => handleSetShowBox(3, value)}
      />
      {data?.class?.msgError ? (
        <Text style={{...Styles.textError, marginLeft: 20}}>
          {data?.class?.msgError}
        </Text>
      ) : null}

      <SelectMany
        title={'Hình thức dạy'}
        data={data?.teachingType?.value || []}
        number={data?.teachingType?.value?.length}
        selected={data.teachingType?.selected}
        showBox={showBox === 4}
        isBusy={disabled}
        handleChange={(value) => handleChangeData('teachingType', value)}
        setShowBox={(value) => handleSetShowBox(4, value)}
      />
      {data?.teachingType?.msgError ? (
        <Text style={{...Styles.textError, marginLeft: 20}}>
          {data?.teachingType?.msgError}
        </Text>
      ) : null}
    </Container>
  );
};

export default BecomeExpertStepTwo;

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
