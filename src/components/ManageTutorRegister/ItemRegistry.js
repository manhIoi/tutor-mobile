import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import {Text} from 'react-native-elements';
import BoxShadow from '../common/BoxShadow';
import Styles from '../../theme/MainStyles';
import ChoiceSpecificDay from '../CreateRequest/ChoiceSpecificDay';
import Colors from '../../theme/Colors';
import BackgroundGradientHorizontal from '../common/BackgroundGradientHorizontal';
import LabelDuration from '../Tutor/LabelDuration';

const ItemRegistry = (props) => {
  const {data} = props;
  return (
    <BoxShadow style={styles.container}>
      <View style={[Styles.flexRow, {flex: 5, marginBottom: 5}]}>
        <View style={[{flex: 3}]}>
          <Text
            numberOfLines={1}
            style={[Styles.textLight, Styles.textBlack3, {fontSize: 12}]}
          >
            Tên lớp:{' '}
            <Text style={[{fontSize: 14}, Styles.textNormal]}>
              {data?.title}
            </Text>
          </Text>
        </View>
        <View style={[{flex: 2}]}>
          <Text
            numberOfLines={1}
            style={[Styles.textLight, Styles.textBlack3, {fontSize: 12}]}
          >
            Mã lớp:{' '}
            <Text style={[{fontSize: 14}, Styles.textNormal]}>
              {data?.classCode}
            </Text>
          </Text>
        </View>
        <TouchableOpacity>
          <Image
            source={require('../../assets/images/icon-Delete.png')}
            style={styles.iconDelete}
          />
        </TouchableOpacity>
      </View>
      <Text
        style={[
          Styles.textLight,
          Styles.textBlack3,
          styles.spaceVertical,
          {fontSize: 12},
        ]}
      >
        Trạng thái:{' '}
        <Text
          style={[Styles.textNormal, {fontSize: 14, color: Colors.greenBold}]}
        >
          {data.status}
        </Text>
        <Text
          style={[Styles.textNormal, {fontSize: 14}]}
        >{` ${data?.order}/${data?.quantity}`}</Text>
      </Text>
      <ChoiceSpecificDay
        containerStyle={{marginHorizontal: 0}}
        dayStudy={data?.weekDays}
        handleChange={null}
      />
      <LabelDuration
        startDate={data?.startAt}
        finishDate={data?.endAt}
        startTime={
          new Date(
            2020,
            5,
            14,
            data?.timeStartAt?.hour,
            data?.timeStartAt?.minute,
          )
        }
        finishTime={
          new Date(2020, 5, 14, data?.timeEndAt?.hour, data?.timeEndAt?.minute)
        }
        totalLesson={data?.totalLesson}
      />
      <Text
        style={[
          Styles.textLight,
          Styles.textBlack3,
          styles.spaceVertical,
          {fontSize: 12},
        ]}
      >
        Học phí:{' '}
        <Text style={[Styles.textNormal, Styles.textOrange, {fontSize: 14}]}>
          {data?.price.toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
          })}
        </Text>
      </Text>
      <Text
        style={[
          Styles.textLight,
          Styles.textBlack3,
          styles.spaceVertical,
          {fontSize: 12},
        ]}
      >
        Phí nhận lớp:{' '}
        <Text style={[Styles.textNormal, Styles.textOrange, {fontSize: 14}]}>
          {data?.fee.toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
          })}
        </Text>
      </Text>
      <View style={styles.groupBtn}>
        <TouchableOpacity style={[styles.btnAction, styles.btnCancel]}>
          <Text style={[styles.textAction, styles.textCancel]}>
            (3) ĐĂNG KÝ
          </Text>
        </TouchableOpacity>
        <BackgroundGradientHorizontal style={styles.btnAction}>
          <Pressable onPress={() => props.navigation.navigate('ListRegistry')}>
            <Text style={styles.textAction}>BẮT ĐẦU</Text>
          </Pressable>
        </BackgroundGradientHorizontal>
      </View>
    </BoxShadow>
  );
};

export default ItemRegistry;
const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    paddingHorizontal: 17,
    paddingVertical: 12,
    marginHorizontal: 13,
  },
  wrapDate: {
    flex: 1,
    backgroundColor: Colors.inboxSend,
    borderRadius: 15,
  },
  textDate: {
    textAlign: 'center',
    color: Colors.orange,
    paddingVertical: 5,
  },
  spaceVertical: {
    marginVertical: 2,
  },
  groupBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  btnAction: {
    width: '45%',
    borderRadius: 20,
  },
  btnCancel: {
    borderWidth: 1,
    borderColor: Colors.orange2,
  },
  textAction: {
    textAlign: 'center',
    color: Colors.whiteColor,
    fontSize: 13,
    paddingVertical: 3,
  },
  textCancel: {
    color: Colors.orange2,
  },
  iconDelete: {width: 14, height: 18},
});
