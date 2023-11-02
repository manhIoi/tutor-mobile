import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, CheckBox} from 'react-native-elements';
import {useSelector} from 'react-redux';
import BoxShadow from '../common/BoxShadow';
import Styles from '../../theme/MainStyles';
import ChoiceSpecificDay from '../CreateRequest/ChoiceSpecificDay';
import Colors from '../../theme/Colors';
import LabelDuration from '../Tutor/LabelDuration';

const ItemClassStudying = (props) => {
  const data = {
    name: 'Toán cao cấp',
    code: '001',
    teacher: 'Adam',
    dayCircle: [4, 5],
    startTime: new Date(),
    dateStart: new Date(),
    dateFinish: new Date(),
    totalLesson: 20,
    price: 100000,
  };
  useEffect(() => {}, [props.checked]);
  return (
    <TouchableOpacity
      onPress={() => {
        props.navigation.navigate('ListClassManagement');
      }}
    >
      <BoxShadow style={styles.container}>
        {props.checked ? (
          <View style={{position: 'absolute', top: 10, right: 0}}>
            <TouchableOpacity>
              <CheckBox
                center
                checkedIcon="check-circle"
                uncheckedIcon="circle-o"
                checkedColor="green"
                checked={props.selected.indexOf(props.data) !== -1}
                containerStyle={{
                  backgroundColor: '#fff',
                  borderWidth: 0,
                  paddingHorizontal: 0,
                  paddingVertical: 0,
                }}
                onPress={() => props.onSelect(props.data)}
              />
            </TouchableOpacity>
          </View>
        ) : null}

        <View
          style={[
            Styles.flexRow,
            {justifyContent: 'space-between', width: '85%', marginTop: 5},
          ]}
        >
          <View>
            <Text
              numberOfLines={1}
              style={[Styles.textLight, Styles.textBlack3, {fontSize: 12}]}
            >
              Tên lớp:{' '}
              <Text style={[{fontSize: 14}, Styles.textNormal]}>
                {data.name}
              </Text>
            </Text>
          </View>
          <View>
            <Text
              numberOfLines={1}
              style={[Styles.textLight, Styles.textBlack3, {fontSize: 12}]}
            >
              Mã lớp:{' '}
              <Text style={[{fontSize: 14}, Styles.textNormal]}>
                {data.code}
              </Text>
            </Text>
          </View>
        </View>
        <Text
          style={[
            Styles.textLight,
            Styles.textBlack3,
            styles.spaceVertical,
            {fontSize: 12},
          ]}
        >
          Teacher:{' '}
          <Text style={[Styles.textNormal, {fontSize: 14}]}>
            {data.teacher}
          </Text>
        </Text>
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
            {data.price.toLocaleString('it-IT', {
              style: 'currency',
              currency: 'VND',
            })}
          </Text>
        </Text>
      </BoxShadow>
    </TouchableOpacity>
  );
};

export default ItemClassStudying;
const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    paddingHorizontal: 17,
    paddingTop: 12,
    paddingBottom: 20,
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
