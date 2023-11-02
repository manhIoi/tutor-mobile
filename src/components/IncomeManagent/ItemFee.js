import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {Text, CheckBox} from 'react-native-elements';
import {useSelector} from 'react-redux';
import BoxShadow from '../common/BoxShadow';
import Styles from '../../theme/MainStyles';
import ChoiceSpecificDay from '../CreateRequest/ChoiceSpecificDay';
import Colors from '../../theme/Colors';
import LabelDuration from '../Tutor/LabelDuration';

export default function ItemFee(props) {
  const data = {
    name: 'Toán cao cấp',
    code: '001',
    status: 'Đang mở',
    dayCircle: [4, 5],
    startTime: new Date(),
    dateStart: new Date(),
    dateFinish: new Date(),
    totalLesson: 20,
    price: 100000,
    priceClass: 100000,
  };
  return (
    <TouchableWithoutFeedback
    //   onPress={() => {
    //     props.navigation.navigate('ListClassManagement');
    //   }}
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
                checked={props.selected?.indexOf(props.data._id) !== -1}
                onPress={() => props.action(props.data._id)}
                containerStyle={{
                  backgroundColor: '#fff',
                  borderWidth: 0,
                  paddingHorizontal: 0,
                  paddingVertical: 0,
                }}
                // onPress={() =>props.action()}
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
          Trạng thái:{' '}
          <Text
            style={[Styles.textNormal, {fontSize: 14, color: Colors.greenBold}]}
          >
            {data.status}
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
            {data.priceClass.toLocaleString('it-IT', {
              style: 'currency',
              currency: 'VND',
            })}
          </Text>
        </Text>
      </BoxShadow>
    </TouchableWithoutFeedback>
  );
}
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
