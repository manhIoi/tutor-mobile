import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-elements';
import PropsTypes from 'prop-types';
import Colors from '../../theme/Colors';
import BackgroundGradient from '../common/BackgroudGradient';
import Styles from '../../theme/MainStyles';

const CustomCalendar = (props) => {
  const [line1, setLine1] = useState([]);
  const [line2, setLine2] = useState([]);
  const [line3, setLine3] = useState([]);
  const [line4, setLine4] = useState([]);
  const [line5, setLine5] = useState([]);
  const [line6, setLine6] = useState([]);
  useEffect(() => {
    handleShowDateCalendar(props.date);
  }, []);
  useEffect(() => {
    handleShowDateCalendar(props.date);
  }, [props.date]);
  async function handleShowDateCalendar(date) {
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth();
    const numberDay = new Date(year, month + 1, 0).getDate();
    const numberDayPre = new Date(year, month, 0).getDate();
    const typeDay = new Date(year, month, 1).getDay()
      ? new Date(year, month, 1).getDay() - 1
      : 6;
    const listDay1 = [];
    const listDay2 = [];
    const listDay3 = [];
    const listDay4 = [];
    const listDay5 = [];
    const listDay6 = [];
    let i = 1;
    let currentPlace = typeDay;
    while (i <= numberDay) {
      if (i === 1) {
        let preDay = numberDayPre;
        for (let j = currentPlace - 1; j >= 0; j--) {
          listDay1[j] = preDay;
          preDay--;
        }
      }
      if (!listDay1[6]) {
        if (currentPlace !== 6) {
          listDay1[currentPlace] = i;
          i++;
          currentPlace++;
        } else {
          listDay1[currentPlace] = i;
          i++;
          currentPlace = 0;
        }
      } else if (!listDay2[6]) {
        if (currentPlace !== 6) {
          listDay2[currentPlace] = i;
          i++;
          currentPlace++;
        } else {
          listDay2[currentPlace] = i;
          i++;
          currentPlace = 0;
        }
      } else if (!listDay3[6]) {
        if (currentPlace !== 6) {
          listDay3[currentPlace] = i;
          i++;
          currentPlace++;
        } else {
          listDay3[currentPlace] = i;
          i++;
          currentPlace = 0;
        }
      } else if (!listDay4[6]) {
        if (currentPlace !== 6) {
          listDay4[currentPlace] = i;
          i++;
          currentPlace++;
        } else {
          listDay4[currentPlace] = i;
          i++;
          currentPlace = 0;
        }
      } else if (!listDay5[6]) {
        if (currentPlace !== 6) {
          listDay5[currentPlace] = i;
          if (i === numberDay) {
            currentPlace++;
            let dayNext = 1;
            while (currentPlace <= 6) {
              listDay5[currentPlace] = dayNext;
              dayNext++;
              currentPlace++;
            }
          }
          i++;
          currentPlace++;
        } else {
          listDay5[currentPlace] = i;
          i++;
          currentPlace = 0;
        }
      } else if (!listDay6[6]) {
        if (currentPlace !== 6) {
          listDay6[currentPlace] = i;
          if (i === numberDay) {
            currentPlace++;
            let dayNext = 1;
            while (currentPlace <= 6) {
              listDay6[currentPlace] = dayNext;
              dayNext++;
              currentPlace++;
            }
          }
          i++;
          currentPlace++;
        } else {
          listDay6[currentPlace] = i;
          i++;
          currentPlace = 0;
        }
      }
    }

    const promise = [
      setLine1(listDay1),
      setLine2(listDay2),
      setLine3(listDay3),
      setLine4(listDay4),
      setLine5(listDay5),
      setLine6(listDay6),
    ];
    await Promise.all(promise);
  }

  const renderDayName = (
    <View style={styles.wrapDayName}>
      <View style={styles.wrapDay}>
        <Text style={{...styles.dayName, ...Styles.textBold}}>MO</Text>
      </View>
      <View style={styles.wrapDay}>
        <Text style={{...styles.dayName, ...Styles.textBold}}>TU</Text>
      </View>
      <View style={styles.wrapDay}>
        <Text style={{...styles.dayName, ...Styles.textBold}}>WE</Text>
      </View>
      <View style={styles.wrapDay}>
        <Text style={{...styles.dayName, ...Styles.textBold}}>TH</Text>
      </View>
      <View style={styles.wrapDay}>
        <Text style={{...styles.dayName, ...Styles.textBold}}>FR</Text>
      </View>
      <View style={styles.wrapDay}>
        <Text
          style={{...styles.dayName, ...styles.weekend, ...Styles.textBold}}
        >
          SA
        </Text>
      </View>
      <View style={styles.wrapDay}>
        <Text
          style={{...styles.dayName, ...styles.weekend, ...Styles.textBold}}
        >
          SU
        </Text>
      </View>
    </View>
  );
  const handleChangeDate = (day) => {
    const newDate = new Date(props.selectedDate).setDate(day);
    props.setSelectedDate(new Date(newDate));
  };
  const renderDateLine = (listDate, line) => (
    <View style={styles.wrapDateLine}>
      {listDate.map((day, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleChangeDate(day)}
          style={styles.wrapDayLine}
          disabled={
            (line === 1 && day > 10) || ((line === 5 || line === 6) && day < 10)
          }
        >
          {!(line === 1 && day > 10) &&
          !((line === 5 || line === 6) && day < 10) &&
          day === props.selectedDate.getDate() ? (
            <BackgroundGradient style={styles.wrapDate}>
              {!(line === 1 && day > 10) &&
              !((line === 5 || line === 6) && day < 10) ? (
                <Text style={{...styles.dayText, ...Styles.textBold}}>
                  {day}
                </Text>
              ) : null}
            </BackgroundGradient>
          ) : (
            <View style={styles.wrapDate}>
              {!(line === 1 && day > 10) &&
              !((line === 5 || line === 6) && day < 10) ? (
                <Text style={{...styles.dayText, ...Styles.textBold}}>
                  {day}
                </Text>
              ) : null}
            </View>
          )}
          {!(line === 1 && day > 10) &&
          !((line === 5 || line === 6) && day < 10) &&
          props.dayBusy?.indexOf(day) !== -1 ? (
            <View style={[styles.point, styles.pointMarker]}></View>
          ) : !(line === 1 && day > 10) &&
            !((line === 5 || line === 6) && day < 10) &&
            day % 5 !== 0 ? (
            <View style={styles.point}></View>
          ) : null}
        </TouchableOpacity>
      ))}
    </View>
  );
  return (
    <View style={styles.container}>
      {renderDayName}
      {renderDateLine(line1, 1)}
      {renderDateLine(line2, 2)}
      {renderDateLine(line3, 3)}
      {renderDateLine(line4, 4)}
      {renderDateLine(line5, 5)}
      {renderDateLine(line6, 6)}
    </View>
  );
};
CustomCalendar.prototype = {
  date: PropsTypes.object,
  selectedDate: PropsTypes.object,
};
export default CustomCalendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black4,
    paddingHorizontal: 11,
    paddingVertical: 11,
    minHeight: 250,
  },
  weekend: {
    color: Colors.orange,
  },
  wrapDayName: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomWidth: 1.2,
    borderBottomColor: '#707070',
  },
  dayName: {
    color: Colors.whiteColor,
    fontWeight: 'bold',
  },
  wrapDay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapDateLine: {
    flexDirection: 'row',
  },
  wrapDayLine: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
  dayText: {
    color: Colors.whiteColor,
    fontSize: 14,
    paddingBottom: 1,
  },
  point: {
    width: 7,
    height: 7,
    borderRadius: 7,
    borderTopLeftRadius: 7,
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  pointMarker: {
    backgroundColor: '#FFB02C',
  },
  wrapDate: {
    borderRadius: 50,
    // padding: 5,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
});
