import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';
// import { CheckBox } from "native-base";
// import { Item } from "native-base";
import {
  getTeacherInfo,
  getTeacherInfoWidthToken,
} from '../../api/teacherInformation';

const Teacher = (props) => {
  const [teacher, setteacher] = React.useState([]);
  React.useEffect(() => {
    (async () => {
      try {
        let teachers = null;
        if (props.token) {
          teachers = await getTeacherInfoWidthToken(props.token);
        } else {
          teachers = await getTeacherInfo();
        }
        const data = Object.entries(teachers).map(([key, value]) => [
          key,
          value,
        ]);
        setteacher(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  // const teacher = props.Data;
  const {isClicked, setIsClicked} = props;
  const [kind, setKind] = React.useState('TEACHER');
  // const { goBack } = navigation;
  const RenderTeacher = (props) => {
    const {item} = props;
    return (
      <TouchableOpacity
        key={item.name}
        onPress={() => {
          // setKind(item[0]);
          item[0] === 'STUDENT'
            ? setKind('Sinh viên/Học sinh')
            : item[0] === 'TEACHER'
            ? setKind('Giáo viên/ Giảng viên')
            : item[0] === 'WORKING'
            ? setKind('Đang đi làm')
            : null;
          isClicked ? setIsClicked(false) : setIsClicked(true);
          props.action(item[1]);
        }}
      >
        {props.data.length - 1 === props.index ? (
          <Text style={styles.text_separator}>
            {item[0] === 'STUDENT'
              ? 'Sinh viên/Học viên'
              : item[0] === 'TEACHER'
              ? 'Giáo viên/Giảng viên'
              : item[0] === 'WORKING'
              ? 'Đang đi làm'
              : null}
          </Text>
        ) : (
          <Text style={styles.card2_text}>
            {item[0] === 'STUDENT'
              ? 'Sinh viên/Học viên'
              : item[0] === 'TEACHER'
              ? 'Giáo viên/Giảng viên'
              : item[0] === 'WORKING'
              ? 'Đang đi làm'
              : null}
          </Text>
        )}
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <View
        style={{
          marginHorizontal: 20,
          marginTop: 30,
        }}
      >
        <View style={styles.topicView}>
          <Text style={styles.topic}>Loại giáo viên</Text>
          <View style={styles.picker}>
            <TouchableOpacity
              style={styles.dropdownTitle}
              onPress={() => {
                isClicked ? setIsClicked(false) : setIsClicked(true);
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  justifyContent: 'center',
                  bottom: 5,
                  fontSize: ConfigStyle.title3,
                  marginRight: 10,
                }}
              >
                {kind === 'TEACHER' ? 'GIÁO VIÊN/GIẢNG VIÊN' : kind}
              </Text>
              {isClicked ? (
                <Icon
                  name="down"
                  style={{color: 'black', position: 'absolute', right: 0}}
                />
              ) : (
                <Icon
                  name="right"
                  style={{color: 'black', position: 'absolute', right: 0}}
                />
              )}
            </TouchableOpacity>
            <Text />
          </View>
        </View>
      </View>
      {isClicked ? (
        <View style={styles.card2}>
          <FlatList
            data={teacher}
            renderItem={(item, index) => (
              <RenderTeacher
                data={teacher}
                index={index}
                {...item}
                action={props.action}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  dropdownTitle: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingLeft: 30,
    fontSize: ConfigStyle.title3,
  },
  picker: {
    borderBottomColor: 'lightgray',
    fontSize: ConfigStyle.title3,
    height: 30,
    flex: 1,
  },
  text_separator: {
    width: '100%',
    paddingVertical: 5,
    textAlign: 'left',
    fontSize: ConfigStyle.title4,
  },

  card2_text: {
    textAlign: 'left',
    paddingVertical: 5,
    fontSize: ConfigStyle.title4,
    borderBottomColor: '#FFB02C',
    borderBottomWidth: 1,
  },
  card2: {
    borderRadius: 10,
    elevation: 20,
    backgroundColor: '#fff',
    shadowOffset: {width: 1, height: 1},
    textShadowColor: Colors.black4,
    shadowOpacity: 0.1,
    textShadowRadius: 0.5,
    // marginHorizontal: 5,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: ConfigStyle.btnMarginHorizontal,
    width: '50%',
    alignSelf: 'flex-end',
  },
  topicNumber: {
    color: Colors.black4,
    fontSize: ConfigStyle.new_title,
    marginTop: 4,
  },
  topic: {
    color: Colors.black4,
    fontSize: ConfigStyle.RF.title2,
    paddingRight: ConfigStyle.btnPaddingHorizontal,
  },

  topicView: {
    // marginHorizontal: ConfigStyle.marginHorizontal,
    marginTop: ConfigStyle.marginTop1,
    flexDirection: 'row',
  },
});
export default Teacher;
