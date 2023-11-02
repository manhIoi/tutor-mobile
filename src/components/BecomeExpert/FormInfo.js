import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {CheckBox, Text} from 'react-native-elements';
import Styles from '../../theme/MainStyles';
import BoxShadow from '../common/BoxShadow';
import SelectBox from '../Home/SelectBox';
import IconCheck from '../../assets/images/svg/icon-check.svg';
import IconUnCheck from '../../assets/images/svg/icon-uncheck.svg';
import {getTeacherInfo} from '../../api/teacherInformation';
import {getProvinces} from '../../api/class';
import IconLocation from '../../assets/images/svg/location.svg';
import IconHome from '../../assets/images/svg/simple-house-thin.svg';
import IconEmployee from '../../assets/images/svg/employee.svg';
import IconNotes from '../../assets/images/svg/notes.svg';
import IconMortar from '../../assets/images/svg/mortarboard.svg';
import IconUniversity from '../../assets/images/svg/university.svg';
import IconGender from '../../assets/images/svg/gender.svg';
import IconCalender from '../../assets/images/svg/XMLID_700_.svg';
import IconStudent from '../../assets/images/svg/student.svg';

const FormInfo = (props) => {
  const [provinces, setProvinces] = useState([]);
  const [typeTeacher, setTypeTeacher] = useState([]);
  useEffect(() => {
    getTypeTeacher();
    getProvince();
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
    <BoxShadow style={{...styles.container, paddingTop: 20}}>
      <SelectBox
        containerStyle={{marginTop: 0}}
        placeholder={'Họ và tên'}
        noPicker={true}
        isInput={true}
        autoCapitalize={'words'}
        svg={<IconEmployee width={11.3}
height={16.75} />}
        value={props.data.fullName.value}
        handleChange={(value) => props.handleChangeData('fullName', value)}
      />
      {props.data?.fullName?.msgError ? (
        <Text style={Styles.textError}>{props.data.fullName.msgError}</Text>
      ) : null}
      <View style={{...Styles.flexRow, alignItems: 'center', marginTop: 3}}>
        {/* <Image */}
        {/*  source={ImagesUtil.iconGender} */}
        {/*  style={{ */}
        {/*    width: 15.5, */}
        {/*    height: 18, */}
        {/*    marginRight: 18, */}
        {/*  }} */}
        {/* /> */}
        <View style={{marginRight: 18}}>
          <IconGender width={15.15}
height={17.82} />
        </View>

        <View>
          <Text style={{marginLeft: 10}}>Giới tính</Text>
          <View style={Styles.flexRow}>
            <CheckBox
              center
              title={'Nam'}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={props?.data?.gender?.value === 0}
              onPress
              size={18}
              containerStyle={{
                backgroundColor: '#fff',
                borderWidth: 0,
                paddingHorizontal: 0,
                paddingVertical: 0,
              }}
              textStyle={{
                fontSize: 12,
                fontWeight: 'normal',
              }}
              checkedIcon={<IconCheck width={16}
height={16} />}
              uncheckedIcon={<IconUnCheck width={16}
height={16} />}
              onPress={() => props.handleChangeData('gender', 0)}
            />
            <CheckBox
              center
              title={'Nữ'}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={props?.data?.gender?.value === 1}
              onPress
              size={18}
              containerStyle={{
                backgroundColor: '#fff',
                borderWidth: 0,
                paddingHorizontal: 0,
                paddingVertical: 0,
              }}
              textStyle={{
                fontSize: 12,
                fontWeight: 'normal',
              }}
              checkedIcon={<IconCheck width={16}
height={16} />}
              uncheckedIcon={<IconUnCheck width={16}
height={16} />}
              onPress={() => props.handleChangeData('gender', 1)}
            />
          </View>
        </View>
      </View>
      <SelectBox
        containerStyle={{marginTop: 5}}
        placeholder={'Email'}
        noPicker={true}
        isInput={true}
        autoCapitalize={'none'}
        keyboardType={'email-address'}
        svg={<IconNotes width={18.1}
height={18.1} />}
        value={props.data.email.value}
        handleChange={(value) => props.handleChangeData('email', value)}
      />
      {props.data?.email?.msgError ? (
        <Text style={Styles.textError}>{props.data.email.msgError}</Text>
      ) : null}
      <SelectBox
        placeholder={'Tỉnh thành'}
        data={provinces}
        svg={<IconLocation width={16.27}
height={16} />}
        value={props.data.province.value}
        handleChange={(value) => props.handleChangeData('province', value)}
      />
      {props.data?.province?.msgError ? (
        <Text style={Styles.textError}>{props.data.province.msgError}</Text>
      ) : null}
      <SelectBox
        placeholder={'Địa chỉ cụ thể'}
        noPicker={true}
        isInput={true}
        noInput={true}
        isView={true}
        useGGPlaces={true}
        svg={<IconHome width={16.5}
height={14.9} />}
        value={props.data.address.value?.desc}
        handleChange={(value) => props.handleChangeData('address', value)}
      />
      {props.data?.address?.msgError ? (
        <Text style={Styles.textError}>{props.data.address.msgError}</Text>
      ) : null}
      <SelectBox
        placeholder={'Năm sinh'}
        noPicker={true}
        isInput={true}
        svg={<IconCalender width={14.32}
height={14.32} />}
        keyboardType={'numeric'}
        value={props.data.yearBirth.value}
        handleChange={(value) => props.handleChangeData('yearBirth', value)}
      />
      {props.data?.yearBirth?.msgError ? (
        <Text style={Styles.textError}>{props.data.yearBirth.msgError}</Text>
      ) : null}
      <SelectBox
        placeholder={'Trường đã học'}
        noPicker={true}
        isInput={true}
        svg={<IconMortar width={20.5}
height={12.3} />}
        value={props.data.university.value}
        handleChange={(value) => props.handleChangeData('university', value)}
      />
      {props.data?.university?.msgError ? (
        <Text style={Styles.textError}>{props.data.university.msgError}</Text>
      ) : null}
      <SelectBox
        placeholder={'Loại gia sư'}
        svg={<IconStudent width={12.3}
height={14.7} />}
        value={props.data?.tutorType?.value}
        data={typeTeacher}
        handleChange={(value) => props.handleChangeData('tutorType', value)}
      />
      {props.data?.tutorType?.msgError ? (
        <Text style={Styles.textError}>{props.data.tutorType.msgError}</Text>
      ) : null}
      <SelectBox
        placeholder={'Các loại bằng cấp chứng chỉ khác'}
        noPicker={true}
        isInput={true}
        svg={<IconUniversity width={16.2}
height={16.2} />}
        value={props.data.otherDegree.value}
        handleChange={(value) => props.handleChangeData('otherDegree', value)}
      />
      {props.data?.otherDegree?.msgError ? (
        <Text style={Styles.textError}>{props.data.otherDegree.msgError}</Text>
      ) : null}
    </BoxShadow>
  );
};

export default FormInfo;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 12,
  },
});
