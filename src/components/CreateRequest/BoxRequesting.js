import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import Styles from '../../theme/MainStyles';
import BoxShadow from '../common/BoxShadow';
import SelectBox from '../Home/SelectBox';
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

const TIME_CLASS = [
  {
    _id: 1,
    name: '45p',
  },
  {
    _id: 2,
    name: '1h30p',
  },
  {
    _id: 3,
    name: '2h15p',
  },
  {
    _id: 4,
    name: '3h',
  },
  {
    _id: 5,
    name: '3h45p',
  },
  {
    _id: 6,
    name: '4h30p',
  },
];
const BoxRequesting = (props) => {
  const [dateStart, setDateState] = useState(new Date());
  const [time, setTime] = useState(new Date());
  return (
    <BoxShadow style={styles.container}>
      {props.data?.province?.msgError ? (
        <Text style={Styles.textError}>{props.data.province.msgError}</Text>
      ) : null}
      <SelectBox
        label={'Địa chỉ'}
        placeholder={'Địa chỉ cụ thể'}
        disabled={props.isBusy}
        noPicker={true}
        svg={<IconHome width={16.5}
height={14.9} />}
        value={props.data?.address?.value?.desc}
        handleChange={(value) => {
            props.handleChangeData('address', value)
        }}

      />
      {props.data?.address?.msgError ? (
        <Text style={Styles.textError}>{props.data.address.msgError}</Text>
      ) : null}
      <SelectBox
        placeholder={'Ngày bắt đầu học'}
        svg={<IconScheduling width={15.85}
height={14.1} />}
        disabled={props.isBusy}
        noPicker={true}
        date={dateStart}
        setDate={setDateState}
        mode={'date'}
        notBefore={true}
        value={props.data?.dateStart?.value}
        handleChange={(value) => props.handleChangeData('dateStart', value)}
      />
      {props.data?.dateStart?.msgError ? (
        <Text style={Styles.textError}>{props.data.dateStart.msgError}</Text>
      ) : null}
      {props.type === 0 ? (
        <View>
          <SelectBox
            label={'Liên hệ'}
            placeholder={'Số điện thoại'}
            disabled={props.isBusy}
            noPicker={true}
            keyboardType={'phone-pad'}
            svg={<IconContact width={16}
height={16} />}
            value={props.data?.phoneNumber?.value}
            handleChange={(value) =>
              props.handleChangeData('phoneNumber', value)
            }
          />
          {props.data?.phoneNumber?.msgError ? (
            <Text style={Styles.textError}>
              {props.data.phoneNumber.msgError}
            </Text>
          ) : null}
        </View>
      ) : null}

      <SelectBox
        placeholder={'Hình thức dạy'}
        svg={<IconLecture width={18.27}
height={18.27} />}
        disabled={props.isBusy}
        value={props.data?.teachingType?.value}
        data={props.dataSelect?.teachingType}
        handleChange={(value) => props.handleChangeData('teachingType', value)}
      />
      {props.data?.teachingType?.msgError ? (
        <Text style={Styles.textError}>{props.data.teachingType.msgError}</Text>
      ) : null}
      <SelectBox
        placeholder={'Môn học'}
        svg={<IconBook width={18.45}
height={15.1} />}
        disabled={props.isBusy}
        value={props.data?.subject?.value}
        data={props.dataSelect?.subjects}
        handleChange={(value) => props.handleChangeData('subject', value)}
      />
      {props.data?.subject?.msgError ? (
        <Text style={Styles.textError}>{props.data.subject.msgError}</Text>
      ) : null}
      <SelectBox
        placeholder={'Thời gian mỗi buổi học'}
        svg={<IconClock width={16.8}
height={16.8} />}
        disabled={props.isBusy}
        date={time}
        data={TIME_CLASS}
        value={props.data?.time?.value}
        handleChange={(value) => props.handleChangeData('time', value)}
      />
      {props.data?.time?.msgError ? (
        <Text style={Styles.textError}>{props.data.time.msgError}</Text>
      ) : null}
        <SelectBox
            placeholder={'Số học viên tối đa'}
            noPicker={true}
            isInput={true}
            keyboardType={'numeric'}
            disabled={props.isBusy}
            svg={<IconEmployee width={11.3}
                               height={16.75} />}
            date={time}
            value={props.data?.maxStudent?.value}
            handleChange={(value) =>
                props.handleChangeData('maxStudent', value)
            }
        />
        {props.data?.maxStudent?.msgError ? (
            <Text style={Styles.textError}>
                {props.data?.maxStudent?.msgError}
            </Text>
        ) : null}
      <SelectBox
        placeholder={'Học phí mỗi buổi học'}
        noPicker={true}
        isInput={true}
        keyboardType={'numeric'}
        disabled={props.isBusy}
        svg={<IconWallet width={16.2}
height={16.2} />}
        date={time}
        value={props.data?.price?.value}
        handleChange={(value) => props.handleChangeData('price', value)}
      />
      {props.data?.price?.msgError ? (
        <Text style={Styles.textError}>{props.data?.price?.msgError}</Text>
      ) : null}
    </BoxShadow>
  );
};

export default BoxRequesting;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 10,
  },
});
