import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, CheckBox} from 'react-native-elements';
import BoxShadow from '../common/BoxShadow';
import Styles from '../../theme/MainStyles';
import ChoiceSpecificDay from '../CreateRequest/ChoiceSpecificDay';
import Colors from '../../theme/Colors';
import BackgroundGradientHorizontal from '../common/BackgroundGradientHorizontal';
import LabelDuration from '../Tutor/LabelDuration';

export default function ItemCourseTwo(props) {
  const data = {
    code: '001',
    dayCircle: [4, 5],
    startTime: new Date(),
    dateStart: new Date(),
    dateFinish: new Date(),
    totalLesson: 20,
  };
  return (
    <BoxShadow style={styles.container}>
      <View>
        <Text
          numberOfLines={1}
          style={[Styles.textLight, Styles.textBlack3, {fontSize: 12}]}
        >
          Mã lớp:{' '}
          <Text style={[{fontSize: 14}, Styles.textNormal]}>{data.code}</Text>
        </Text>
      </View>
      <ChoiceSpecificDay
        containerStyle={{marginHorizontal: 0}}
        dayStudy={data.dayCircle}
        handleChange={null}
      />
      <LabelDuration
        startDate={data.startTime}
        finishDate={data.startTime}
        startTime={data.startTime}
        finishTime={data.startTime}
        totalLesson={data.totalLesson}
      />
    </BoxShadow>
  );
}
const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    paddingHorizontal: 17,
    paddingTop: 12,
    paddingBottom: 20,
    marginHorizontal: 16,
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
});
