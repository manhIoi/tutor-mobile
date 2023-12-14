import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import PropsTypes from 'prop-types';
import Styles from '../../theme/MainStyles';
import {formatDDMMYYY, formatHHMM} from '../../utils/string.util';
import ArrowRight from '../../assets/images/svg/arrow-right.svg';
import Colors from '../../theme/Colors';

const LabelDuration = (props) => {
  return (
    <View>
      <Text
        style={[
          Styles.textLight,
          Styles.textBlack3,
          {marginTop: 5, fontSize: 12},
        ]}
      >
        Thời gian học:{' '}
        <Text style={[{fontSize: 14}, Styles.textNormal]}>
          {formatHHMM(props.startTime)} - {formatHHMM(props.finishTime)}
        </Text>
      </Text>
      <View
        style={[Styles.flexRowSB, {alignItems: 'center', marginVertical: 8}]}
      >
        <View style={[styles.wrapDate, {marginRight: 12}]}>
          <Text style={styles.textDate}>{formatDDMMYYY(props.startDate)}</Text>
        </View>
        <ArrowRight width={6}
height={9} />
        <View style={[styles.wrapDate, {marginLeft: 12}]}>
          <Text style={styles.textDate}>{formatDDMMYYY(props.finishDate)}</Text>
        </View>
      </View>
    </View>
  );
};
LabelDuration.prototype = {
  startDate: PropsTypes.object,
  finishDate: PropsTypes.object,
  startTime: PropsTypes.object,
  finishTime: PropsTypes.object,
  totalLesson: PropsTypes.number,
};
export default LabelDuration;
const styles = StyleSheet.create({
  spaceVertical: {
    marginVertical: 2,
  },
  textDate: {
    textAlign: 'center',
    color: Colors.orange,
    paddingVertical: 5,
  },
  wrapDate: {
    flex: 1,
    backgroundColor: Colors.inboxSend,
    borderRadius: 15,
  },
});
