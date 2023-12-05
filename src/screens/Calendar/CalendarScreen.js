import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {Text} from 'react-native-elements';
import moment from 'moment';
import MonthPicker from 'react-native-month-year-picker';
import {useSelector} from 'react-redux';
import Container from '../../components/common/Container';
import Statusbar from '../../components/common/StatusBar';
import ConfigStyle from '../../theme/ConfigStyle';
import CustomCalendar from '../../components/Calendar/CustomCalendar';
import Colors from '../../theme/Colors';
import EventInDay from '../../components/Calendar/EventInDay';
import ManageCalendar from '../../components/Calendar/ManageCalendar';
import Styles from '../../theme/MainStyles';
import IconCalendar from '../../assets/images/svg/calendar.svg';
import {
  getClassByTeacher,
  getLessonByDate,
  getLessonByMonth, getRequestByTeacherId,
  teacherGetLessonByDate, userGetListRequest,
} from '../../api/class';
import BoxShadow from '../../components/common/BoxShadow';
import TutorRequestItem from "../../components/RequestManagement/TutorRequestItem";

const INIT_DATA = {
  data: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
};
const CalendarScreen = (props) => {
  const user = useSelector((state) => state.auth.user);
  const [classes, setClasses] = useState([]);


  useEffect(() => {
    getData()
  }, []);

  const getData = async () => {
    try {
      const response = user?.role === 'teacher' ? await getRequestByTeacherId(user._id) : await userGetListRequest(user._id);
      console.info(`🔥LOGGER:: response`,response);
      setClasses(response)
    } catch (e) {
      console.info(`🔥LOGGER:: e`,e);
    }
  }

  const onRefresh = () => {
    getData();
  }

  const renderItem = ({item}) => {
    return (
        <TutorRequestItem data={item} onPress={() => {
          props.navigation.navigate('Calendar', {
            screen: 'DetailRequest',
            params: {
              tutorRequest: item,
            }
          })
        }} />
    )
  }

  return (
    <Container
      header={
        <Statusbar
          title={'Quản lý'}
          contentBarStyles={{justifyContent: 'center'}}
          headerHeight={ConfigStyle.statusBarHeight}
        />
      }
      headerHeight={ConfigStyle.statusBarHeight}
      hideBackground={true}
      onRefresh={onRefresh}
      refreshing={false}
    >
      <FlatList data={classes} renderItem={renderItem} keyExtractor={(item) => item?._id} />
    </Container>
  );
};

export default CalendarScreen;
const styles = StyleSheet.create({
  textDate: {
    color: Colors.orange,
    fontSize: 16,
  },
  wrapDatePicker: {
    marginBottom: 7,
    marginLeft: 12,
  },
  listEventDay: {
    marginTop: 10,
  },
  boxEmptyEvent: {
    marginTop: 20,
  },
  textEmpty: {
    textAlign: 'center',
    paddingVertical: 25,
    fontSize: 14,
  },
});
