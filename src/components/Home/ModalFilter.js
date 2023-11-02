import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {Text} from 'react-native-elements';
import PropsTypes from 'prop-types';
import InputSearch from '../common/InputSearch';
import IconCustom from '../common/IconCustom';
import ImagesUtil from '../../utils/images.util';
import Styles from '../../theme/MainStyles';
import SelectBox from './SelectBox';
import BackgroundGradient from '../common/BackgroudGradient';
import ConfigStyle from '../../theme/ConfigStyle';
import ConstantValue from '../../constants';
import {getProvinces, getTypeClassAPI} from '../../api/class';
import {getSubjects} from '../../api/subject';
import {gettopics} from '../../api/topic';
import {getTeacherInfo} from '../../api/teacherInformation';
import {getStatusBarHeight} from '../../utils/ScaleAdaptor';
import IconLocation from '../../assets/images/svg/location.svg';
import IconContact from '../../assets/images/svg/iconPhone.svg';
import IconHome from '../../assets/images/svg/simple-house-thin.svg';
import IconScheduling from '../../assets/images/svg/scheduling.svg';
import IconEmployee from '../../assets/images/svg/employee.svg';
import IconLecture from '../../assets/images/svg/lecture.svg';
import IconNotes from '../../assets/images/svg/notes.svg';
import IconBook from '../../assets/images/svg/open-magazine.svg';
import IconBoard from '../../assets/images/svg/board.svg';
import IconClock from '../../assets/images/svg/clock.svg';
import IconMortar from '../../assets/images/svg/mortarboard.svg';
import IconUniversity from '../../assets/images/svg/university.svg';
import IconWallet from '../../assets/images/svg/wallet.svg';
import IconWorld from '../../assets/images/svg/world.svg';

const ModalFilter = (props) => {
  const [provinces, setProvinces] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classData, setClassData] = useState([]);
  const [typeTeacher, setTypeTeacher] = useState([]);
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const teachingType = ConstantValue.teachingType;
  useEffect(() => {
    getProvince();
    getSubject();
    getTopics();
    getTypeClass();
    getTypeTeacher();
  }, []);
  async function getProvince() {
    try {
      const response = await getProvinces(1, 20);
      setProvinces(response);
    } catch (error) {
      console.log('getProvince ==>', error);
      throw error;
    }
  }
  async function getSubject() {
    try {
      const response = await getSubjects(1, 50);
      setSubjects(response);
    } catch (error) {
      console.log('getSubject ==>', error);
      throw error;
    }
  }
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
  async function getTypeTeacher() {
    try {
      const response = await getTeacherInfo(1, 50);
      if (response) {
        const arr = [];
        Object.keys(response)?.map((item, index) => {
          arr.push({
            _id: Object.values(response)[index],
            name:
              item === 'STUDENT'
                ? 'SINH VIÊN/HỌC SINH'
                : item === 'TEACHER'
                ? 'GIÁO VIÊN/GIẢNG VIÊN'
                : item === 'WORKING'
                ? 'ĐANG ĐI LÀM'
                : null,
          });
        });
        setTypeTeacher(arr);
      }
    } catch (error) {
      console.log('getTypeTeacher ==>', error);
      throw error;
    }
  }
  return (
    <View>
      <View style={{...styles.searchBar, ...props.searchBar}}>
        <View style={{...styles.controlGroup, ...props.controlGroup}}>
          <InputSearch
            iconRight={props.iconRight}
            onSearch={props.onSearch}
            textSearch={props.textSearch}
          />
        </View>
        <View style={styles.iconNoti}></View>
      </View>
      <View style={styles.filterGroup}>
        <View>
          <SelectBox
            placeholder={'Tỉnh thành'}
            data={provinces}
            svg={<IconLocation width={16.27}
height={16} />}
            value={props.dataFill.city}
            handleChange={(value) => props.handleChangeForm('city', value)}
          />
          <View style={{flexDirection: 'row'}}>
            <View
              style={[
                styles.wrapInput,
                Platform.OS === 'ios' ? {marginTop: 5} : {},
              ]}
            >
              <IconWorld width={18.43}
height={18.43} />
              <TextInput
                placeholder={'Phạm vi. . .'}
                style={{
                  ...styles.input,
                  marginBottom: Platform.OS === 'ios' ? 5 : 0,
                }}
                keyboardType={'numeric'}
                value={props.dataFill.duration}
                onChangeText={(value) =>
                  props.handleChangeForm('duration', value)
                }
              />
              <Text>(km)</Text>
            </View>
          </View>

          <SelectBox
            placeholder={'Loại gia sư'}
            data={typeTeacher}
            svg={<IconEmployee width={11.3}
height={16.75} />}
            containerStyle={{marginTop: 0}}
            value={props.dataFill.typeTeacher}
            handleChange={(value) =>
              props.handleChangeForm('typeTeacher', value)
            }
          />
          <SelectBox
            placeholder={'Hình thức dạy'}
            svg={<IconLecture width={18.27}
height={18.27} />}
            data={teachingType}
            value={props.dataFill.teachingType}
            handleChange={(value) =>
              props.handleChangeForm('teachingType', value)
            }
          />
          <SelectBox
            placeholder={'Chủ đề'}
            data={topics}
            svg={<IconBook width={18.45}
height={15.1} />}
            value={props.dataFill.topic}
            handleChange={(value) => props.handleChangeForm('topic', value)}
          />
          <SelectBox
            placeholder={'Môn học'}
            data={subjects}
            svg={<IconNotes width={18.1}
height={18.1} />}
            value={props.dataFill.subject}
            handleChange={(value) => props.handleChangeForm('subject', value)}
          />
          <SelectBox
            placeholder={'Lớp'}
            data={classData}
            svg={<IconBoard width={16}
height={16.31} />}
            value={props.dataFill.class}
            handleChange={(value) => props.handleChangeForm('class', value)}
          />
        </View>
        <View style={styles.wrapBtn}>
          <TouchableOpacity onPress={props.handleFilter}>
            <BackgroundGradient style={{...Styles.wrapBtn, height: 26}}>
              <Text style={[Styles.textWhite, styles.textBtn]}>OK</Text>
            </BackgroundGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

ModalFilter.prototype = {
  show: PropsTypes.bool.isRequired,
  hideModalFilter: PropsTypes.func,
};
export default ModalFilter;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#fff',
  },
  modal: {
    justifyContent: 'flex-start',
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  controlGroup: {
    width: '84%',
  },
  filterGroup: {
    backgroundColor: '#fff',
    marginTop: 8,
    borderRadius: 8,
    paddingHorizontal: 27,
    paddingVertical: 27,
  },
  wrapBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 25,
  },
  textBtn: {
    fontSize: 15,
    paddingHorizontal: 27,
    paddingVertical: 5,
  },
  btn: {
    // height: 30
  },
  wrapInput: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    borderBottomColor: '#C0C0C0',
    borderBottomWidth: 1,
    marginBottom: 15,
    height: 35,
  },
  imageWorld: {
    width: 18.4,
    height: 18.4,
    // position: 'absolute',
  },
  input: {
    marginLeft: 20,
    width: 100,
    height: 40,
    paddingTop: 10,
    marginTop: 5,
  },
});
