import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Text } from 'react-native-elements';
import moment from 'moment';
import MonthPicker from 'react-native-month-year-picker';
import { useDispatch, useSelector } from 'react-redux';
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
import { syncMyRequestList } from "../../helper/main";
import EmptyListComponent from "../../components/common/EmptyListComponent";
import Selection from '../../components/common/Selection';
import { ModalPicker } from '../../components/common/CustomPicker';

const DATA_FILTER = [
  {
    name: "Tất cả",
    value: null
  },
  {
    name: "Đang mở",
    value: 0
  },
  {
    name: "Đợi giáo viên xác nhận",
    value: 1
  },
  {
    name: "Có giáo viên nhận lớp",
    value: 2
  },
  {
    name: "Lớp học kết thúc",
    value: 3
  }
]

const CalendarScreen = (props) => {
  const user = useSelector((state) => state.auth.user);
  const { myRequestList: classes } = useSelector(state => state.main)
  const [showFilter, setShowFilter] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(DATA_FILTER[0]);

  const dispatch = useDispatch()

  const onRefresh = () => {
    syncMyRequestList(dispatch, user);
  }

  const renderItem = ({ item }) => {
    if (item?.status !== currentFilter?.value && currentFilter?.value !== null) return null
    return (
      <TutorRequestItem data={item} onPress={() => {
        props.navigation.navigate('DetailRequest', {
          tutorRequest: item,
        })
      }} />
    )
  }

  return (
    <Container
      header={
        <Statusbar
          title={'Quản lý'}
          contentBarStyles={{ justifyContent: 'center' }}
          headerHeight={ConfigStyle.statusBarHeight}
        />
      }
      headerHeight={ConfigStyle.statusBarHeight}
      hideBackground={true}
      onRefresh={onRefresh}
      refreshing={false}
    >
      <View style={{ paddingHorizontal: 10 }} >
        <Selection style={{ marginHorizontal: 4, marginVertical: 14 }} textInputProps={{
          placeholder: "Trạng thái",
          value: currentFilter?.name,
          style: {
            fontWeight: "bold",
            color: Colors.black4
          }
        }} onPress={() => setShowFilter(true)} />
        <FlatList data={classes} renderItem={renderItem} keyExtractor={(item) => item?._id} ListEmptyComponent={<EmptyListComponent />} />
      </View>
      <ModalPicker
        items={DATA_FILTER}
        show={showFilter}
        hideModal={() => setShowFilter(false)}
        onChange={setCurrentFilter}
        title={"Trạng thái lớp học"}
      />
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
