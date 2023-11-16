import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {Text} from 'react-native-elements';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import Container from '../../components/common/ContainerRenderList';
import Statusbar from '../../components/common/StatusBar';
import ItemCourseRequest from '../../components/RequestManagement/ItemCourseRequest';
import ConfigStyle from '../../theme/ConfigStyle';
import Styles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';
import Constants from '../../../constants/Values';
import {userGetListRequest} from '../../api/class';
import IconEmpty from '../../assets/images/svg/empty-list.svg';
import IconFill from '../../assets/images/svg/icon-fill.svg';
import IconFillActive from '../../assets/images/svg/icon-fill-active.svg';
import ModalFilter from '../../components/RequestManagement/ModalFilter';
import {useDispatch, useSelector} from 'react-redux';

const dataFilter = [
  {
    id: 0,
    status: 'Hoàn thành',
    checked: false,
    value: 'finished',
  },
  {
    id: 1,
    status: 'Đang diễn ra',
    checked: false,
    value: 'ongoing',
  },
  {
    id: 2,
    status: 'Đã duyệt',
    checked: false,
    value: 'upcoming',
  },
  {
    id: 3,
    status: 'Chờ duyệt',
    checked: true,
    value: 'pending',
  },
];

export default function RequestManagementScreen(props) {
  const [textSearch, setTextSearch] = useState('');
  const [listRequest, setListRequest] = useState(null);
  const [isBusy, setBusy] = useState(false);
  const [refreshing, setRefresh] = useState(false);
  const [timeLoad, setTimeLoad] = useState(0);
  const [showFilter, setFilter] = useState(false);
  const [autoFocus, setAutoFocus] = useState(false);
  const [status, setStatus] = useState('pending');
  const [text, setText] = useState('');
  const [data, setData] = useState(dataFilter);
  const user = useSelector(state => state.auth.user);

  const isFocused = useIsFocused();
  function actionSearch(event) {
    const {text} = event.nativeEvent;
    setTextSearch(text);
  }
  async function hideModalFilter() {
    setFilter(false);
  }
  function handleFilter() {
    setAutoFocus(false);
    onFocusSearch(false);
    hideModalFilter();
  }
  function onFocusSearch(showKeyboard = true) {
    if (showKeyboard) {
      setAutoFocus(true);
    }
    setFilter(true);
  }

  useEffect(() => {
    getListRequesting()
  }, []);
  function onSearch(event) {
    const {text} = event.nativeEvent;
    setTextSearch(text);
  }
  async function handleChangeStatus(status, textString) {
    setText(textString);
    setStatus(status);
    setBusy(true);
    await getListRequesting(
      1,
      Constants.LIMIT,
      textString,
      status,
      false,
      false,
      true,
    );
    setBusy(false);
  }

  async function getListRequesting() {
    try{
      const response = await userGetListRequest(user?._id)
      setListRequest(response)
    } catch (e) {

    }
  }

  async function onRefresh(showIcon = true) {
    if (showIcon) {
      setRefresh(true);
    }
    await getListRequesting(
      1,
      Constants.LIMIT,
      textSearch,
      status,
      false,
      true,
    );
  }
  useEffect(() => {
    getListRequesting(1, Constants.LIMIT, textSearch, status, false, false);
  }, [textSearch]);
  function handleLoadMore() {
    if (listRequest.currentPage * Constants.LIMIT < listRequest.totalItems) {
      getListRequesting(
        listRequest.currentPage + 1,
        Constants.LIMIT,
        textSearch,
        status,
        true,
        false,
      );
    }
  }
  const iconRight = (
    <TouchableOpacity style={styles.wrapIconRight}
onPress={onFocusSearch}>
      <View style={styles.iconFilter}>
        <IconFill width={12.6}
height={18} />
      </View>
    </TouchableOpacity>
  );

  return (
    <Container
      header={
        <Statusbar
          search={true}
          headerHeight={ConfigStyle.statusBarHomeHeightTutor}
          navigation={props.navigation}
          arrowBack={true}
          title={'Quản lý yêu cầu'}
          right={true}
          iconFilter={iconRight}
          iconSearchRight={iconRight}
          actionSearch={onSearch}
          textSearch={textSearch}
          visibleInput={showFilter}
        />
      }
      headerHeight={ConfigStyle.statusBarHomeHeightTutor}
    >
      {!isBusy ? (
        listRequest?.length ? (
          <FlatList
            style={styles.wrapList}
            data={listRequest || []}
            renderItem={({item, index}) => (
              <ItemCourseRequest
                data={item}
                containerStyle={{marginHorizontal: 13}}
                navigation={props.navigation}
                onRefresh={onRefresh}
                teacher={{
                  _id: props.route?.params?.teacherId,
                  fullName: props.route?.params?.fullName,
                }}
                access={'student'}
                request={true}
                status={status}
              />
            )}
            keyExtractor={(item) => item._id}
            onEndReachedThreshold={0.4}
            onEndReached={handleLoadMore}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.orange]}
              />
            }
          />
        ) : (
          <View style={Styles.wrapEmptyImage}>
            <IconEmpty width={'50%'}
height={'50%'} />
            <Text style={Styles.textBlack3}>Không có dữ liệu</Text>
          </View>
        )
      ) : (
        <View style={{marginTop: 20}}>
          <ActivityIndicator color={Colors.orange} />
        </View>
      )}
      {showFilter ? (
        <ModalFilter
          show={showFilter}
          data={data}
          hideModalFilter={hideModalFilter}
          onSearch={onSearch}
          iconRight={iconRight}
          textSearch={textSearch}
          handleFilter={handleFilter}
          action={handleChangeStatus}
          text={setTextSearch}
          status={status}
          request={true}
        />
      ) : null}
    </Container>
  );
}
const styles = StyleSheet.create({
  wrapList: {
    marginTop: 10,
  },
  wrapIconRight: {
    // marginTop: 8,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
});
