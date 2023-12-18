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
import IconEmail from '../../assets/images/svg/contact.svg';


const FormInfo = (props) => {
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
        inputProps={{
            // editable: false
        }}
      />
      {props.data?.fullName?.msgError ? (
        <Text style={Styles.textError}>{props.data.fullName.msgError}</Text>
      ) : null}
      <View style={{...Styles.flexRow, alignItems: 'center', marginTop: 3}}>
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
            placeholder={'Số điện thoại'}
            noPicker={true}
            isInput={true}
            autoCapitalize={'none'}
            keyboardType={'numeric'}
            svg={<IconNotes width={18.1}
                            height={18.1} />}
            value={props.data.phoneNumber.value}
            handleChange={(value) => props.handleChangeData('phoneNumber', value)}
            inputProps={{
                // editable: false
            }}
        />
      <SelectBox
        containerStyle={{marginTop: 5}}
        placeholder={'Email'}
        noPicker={true}
        isInput={true}
        autoCapitalize={'none'}
        keyboardType={'email-address'}
        svg={<IconEmail width={18.1}
height={18.1} />}
        value={props.data.email.value}
        handleChange={(value) => props.handleChangeData('email', value)}
      />
      {props.data?.email?.msgError ? (
        <Text style={Styles.textError}>{props.data.email.msgError}</Text>
      ) : null}
        <SelectBox
            containerStyle={{marginTop: 5}}
            placeholder={'Địa chỉ'}
            noPicker={true}
            isInput={true}
            autoCapitalize={'none'}
            svg={<IconLocation width={18.1}
                            height={18.1} />}
            value={props.data.address.value}
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
      {props.data?.tutorType?.msgError ? (
        <Text style={Styles.textError}>{props.data.tutorType.msgError}</Text>
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
