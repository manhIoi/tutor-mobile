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
  getLessonByDate,
  getLessonByMonth,
  teacherGetLessonByDate,
} from '../../api/class';
import BoxShadow from '../../components/common/BoxShadow';

const INIT_DATA = {
  data: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
};
const CalendarScreen = (props) => {
  const user = useSelector((state) => state.auth.user);
  const access = {user};
  const [tab, setTab] = useState(0);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [event, setEvent] = useState(INIT_DATA);
  const [isBusy, setBusy] = useState(true);
  const [dayBusy, setDayBusy] = useState([]);
  const showPicker = useCallback((value) => setShow(value), []);
  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate1 = newDate || date;
      showPicker(false);
      setDate(
        new Date(new Date(selectedDate1).getTime() + 5 * 24 * 60 * 60 * 1000),
      );
      setSelectedDate(
        new Date(
          selectedDate1.getFullYear(),
          selectedDate1.getMonth(),
          selectedDate.getDate(),
        ),
      );
      setDayBusy([]);
      getLessonsOnMonth({
        month: new Date(selectedDate1).getMonth(),
        year: new Date(selectedDate1).getFullYear(),
      });
    },
    [date, showPicker],
  );
  function handleSetTab(tab) {
    setTab(tab);
  }
  useEffect(() => {
    getLessonsOnMonth({
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    });
    getLesson({date: new Date()});
  }, []);
  useEffect(() => {
    getLesson({date: selectedDate});
  }, [selectedDate]);
  async function getLesson(data) {
    try {
      setBusy(true);
      const day = data.date?.getDate();
      const month = data.date?.getMonth();
      const year = data.date?.getFullYear();
      let response = null;
      if (user.access === 'teacher') {
        response = await teacherGetLessonByDate(
          new Date(year, month, day).toISOString(),
        );
      } else {
        response = await getLessonByDate(
          new Date(year, month, day).toISOString(),
        );
      }
      setBusy(false);
      setEvent({
        data: response.payload,
        totalItems: response.total_item,
        currentPage: response.page,
        totalPages: response.total_page,
      });
    } catch (error) {
      console.log('getLesson ==>', error);
    }
  }

  async function getLessonsOnMonth(data) {
    try {
      setBusy(true);
      const firstDay = new Date(
        new Date(data.year, data.month, 1),
      ).toISOString();
      const lastDay = new Date(
        new Date(data.year, data.month + 1, 0),
      ).toISOString();
      const response = await getLessonByMonth(firstDay, lastDay);
      if (response?.payload?.length) {
        const arr = [];
        response.payload.map((item) => {
          arr.push(new Date(item?.date).getDate());
        });
        setDayBusy(arr);
      }
      setBusy(false);
    } catch (error) {
      setBusy(false);
      console.log('getLessonsOnMonth =>', error);
    }
  }
  return (
    <Container
      header={
        <Statusbar
          title={access ? 'Quản lý' : 'Performance'}
          contentBarStyles={{justifyContent: 'center'}}
          tab={tab}
          headerHeight={ConfigStyle.statusBarHeight}
          tabLabels={user.access === 'teacher' ? null : ['Calendar', 'Quản lý']}
          changeTab={handleSetTab}
        />
      }
      headerHeight={
        user.access === 'teacher'
          ? ConfigStyle.statusBarHeight
          : ConfigStyle.statusBarHeight + 30
      }
      hideBackground={true}
    >
      {tab === 0 ? (
        <View>
          {user.access === 'teacher' ? (
            <ManageCalendar navigation={props.navigation}
access={access} />
          ) : null}
          <View style={styles.wrapDatePicker}>
            <TouchableOpacity
              style={Styles.flexRowCenterVertical}
              onPress={() => showPicker(true)}
            >
              <View style={{paddingHorizontal: 10}}>
                <IconCalendar width={18} />
              </View>
              <Text style={[styles.textDate, Styles.textBold]}>
                {moment(date).format('MM - YYYY')}
              </Text>
            </TouchableOpacity>
          </View>
          <CustomCalendar
            date={date}
            selectedDate={selectedDate}
            dayBusy={dayBusy}
            setSelectedDate={(value) => setSelectedDate(value)}
          />
          {!isBusy ? (
            event.data?.length ? (
              <SafeAreaView style={{}}>
                <FlatList
                  style={styles.listEventDay}
                  nestedScrollEnabled={true}
                  data={event.data}
                  renderItem={({item, index}) => (
                    <EventInDay
                      data={item}
                      access={user?.access}
                      navigation={props.navigation}
                      date={selectedDate}
                    />
                  )}
                  keyExtractor={(item) => item.toString()}
                />
              </SafeAreaView>
            ) : (
              <BoxShadow style={styles.boxEmptyEvent}>
                <Text style={styles.textEmpty}>Không có lịch học nào</Text>
              </BoxShadow>
            )
          ) : (
            <View style={{marginTop: 20}}>
              <ActivityIndicator color={Colors.orange} />
            </View>
          )}

          {show && (
            <MonthPicker
              onChange={onValueChange}
              value={date}
              minimumDate={new Date(2010, 10)}
              maximumDate={new Date(2025, 5)}
              locale="vi"
            />
          )}
        </View>
      ) : (
        <ManageCalendar navigation={props.navigation} />
      )}
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
