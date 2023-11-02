import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {CheckBox, Text} from 'react-native-elements';
import {func} from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import Container from '../../components/common/ContainerRenderList';
import Statusbar from '../../components/common/StatusBar';
import ConfigStyle from '../../theme/ConfigStyle';
import {
  getListClass,
  studentGetRegisteredClass,
  getClassOfUser,
} from '../../api/class';
import {createPayment, getTransaction} from '../../api/payment';
import Styles from '../../theme/MainStyles';
import Constants from '../../../constants/Values';
import ClassRoomHorizontal from '../../components/Home/ClassRoomHorizontal';
import IconEmpty from '../../assets/images/svg/empty-list.svg';
import Colors from '../../theme/Colors';
import ItemClassRegistered from '../../components/ManageRegistry/ItemClassRegistered';
import PurchaseHistory from './PurchaseHistory';
import BoxShadow from '../../components/common/BoxShadow';
import Payment from '../../components/IncomeManagent/Payment';
import {IP_ADDRESS} from '../../utils/auth.util';
import ButtonCustom from '../../components/common/ButtonFooterCustom';

const INIT_VALUE = {
  data: [],
  currentPage: 1,
  totalItems: 0,
  limit: 10,
};
const ManageRegistry = (props) => {
  const [tab, setTab] = useState(0);
  const [classesOnGoing, setClassesOnGoing] = useState(INIT_VALUE);
  const [classesFinish, setClassesFinish] = useState(INIT_VALUE);
  const [isBusy, setBusy] = useState(true);
  const [isBusy2, setBusy2] = useState(true);
  const [isBusy3, setBusy3] = useState(true);
  const [refreshing, setRefresh] = useState(false);
  const [transaction, setTransaction] = useState(INIT_VALUE);
  const [checked, setChecked] = useState(false);
  const [selected, setSelected] = useState([]);
  const [url, setUrl] = useState('');
  const [isBusy1, setBusy1] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const IsFocused = useIsFocused();
  useFocusEffect(
    React.useCallback(() => {
      onRefresh(false);
    }, [IsFocused, tab]),
  );
  useEffect(() => {
    if (props.route?.params?.tab) {
      setTab(props.route?.params?.tab);
      if (props.route.params.tab === 0) {
        classOnGoing();
      } else {
        getClassesFinish();
      }
    }
  }, []);
  useEffect(() => {
    if (tab === 0 && !classesOnGoing.data?.length) {
      classOnGoing(1, Constants.LIMIT, 'ongoing', false, false);
    }
    if (tab === 1 && !classesFinish.data?.length) {
      getClassesFinish(1, Constants.LIMIT, 'finish', false, false);
    }
    if (tab === 2) {
      getAllTransaction(
        1,
        Constants.LIMIT,
        'createdAt:asc',
        true,
        false,
        false,
      );
    }
  }, [tab]);
  async function getAllTransaction(
    page = 1,
    limit = Constants.LIMIT,
    sort = 'createdAt:asc',
    profit = true,
    loadMore = true,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) {
        setBusy3(true);
      }
      const response = await getTransaction(page, limit, sort, profit);
      // setTransaction(trans);
      // setBusy3(false);
      // console.log(trans)
      if (loadMore) {
        if (response?.payload) {
          setTransaction({
            data: [...transaction.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response?.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setTransaction({
            data: response?.payload || [],
            currentPage: response?.page,
            totalItems: response?.total_item,
          });
        }
        setBusy3(false);
      }
      setRefresh(false);
    } catch (error) {
      setBusy3(false);
      console.log(error);
    }
  }
  async function classOnGoing(
    page = 1,
    limit = Constants.LIMIT,
    status = 'ongoing',
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) {
        setBusy(true);
      }
      const response = await getClassOfUser(page, limit, status);
      if (loadMore) {
        if (response?.payload && status === 'ongoing') {
          setClassesOnGoing({
            data: [...classesOnGoing.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setClassesOnGoing({
            data: response?.payload || [],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
        setBusy(false);
      }
      setRefresh(false);
      //
    } catch (error) {
      console.log('get getClasses ==>', error);
    }
  }
  async function getClassesFinish(
    page = 1,
    limit = Constants.LIMIT,
    status = 'finish',
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) {
        setBusy2(true);
      }
      const response = await getClassOfUser(page, limit, status);
      if (loadMore) {
        if (response?.payload) {
          setClassesFinish({
            data: [...classesFinish.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setClassesFinish({
            data: response?.payload || [],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
        setBusy2(false);
      }
      setRefresh(false);
    } catch (error) {
      console.log('get getClasses ==>', error);
    }
  }
  async function onRefresh() {
    setRefresh(true);
    if (tab === 2) {
      await getAllTransaction(
        1,
        Constants.LIMIT,
        'createdAt:asc',
        true,
        false,
        true,
      );
    }
    if (tab === 0) {
      await classOnGoing(1, Constants.LIMIT, 'ongoing', false, true);
    } else {
      await getClassesFinish(1, Constants.LIMIT, 'finish', false, true);
    }
  }
  function handleSetTab(tab) {
    setChecked(false);
    setTab(tab);
  }
  function handleSelect(val, amount) {
    const currentSelected = JSON.parse(JSON.stringify(selected));
    const index = currentSelected.map((v) => v).indexOf(val);
    if (index === -1) {
      setTotalAmount(totalAmount + amount);
      currentSelected.push(val);
    } else {
      currentSelected.splice(index, 1);
      setTotalAmount(totalAmount - amount);
    }
    setSelected(currentSelected);
  }
  const renderFooter =
    (tab === 2 && transaction.data?.length >= transaction.totalItems) ||
    (tab === 0 && classesOnGoing.data?.length >= classesOnGoing.totalItems) ||
    (tab === 1 && classesFinish.data?.length >= classesFinish.totalItems) ? (
      <Text style={Styles.countResult}>
        {tab === 2
          ? transaction.totalItems
          : tab === 0
          ? classesOnGoing.totalItems
          : classesFinish.totalItems}{' '}
        kết quả
      </Text>
    ) : (
      <ActivityIndicator color={Colors.orange} />
    );
  function handleLoadMore() {
    if (
      tab === 2 &&
      transaction.currentPage * Constants.LIMIT < transaction.totalItems
    ) {
      getAllTransaction(
        transaction.currentPage + 1,
        Constants.LIMIT,
        'createdAt:asc',
        true,
        true,
      );
    }
    if (
      (tab === 0 &&
        classesOnGoing.currentPage * Constants.LIMIT <
          classesOnGoing.totalItems) ||
      (tab === 1 &&
        classesFinish.currentPage * Constants.LIMIT < classesFinish.totalItems)
    ) {
      if (tab === 0) {
        classOnGoing(
          classesOnGoing.currentPage + 1,
          Constants.LIMIT,
          'ongoing',
          true,
        );
      } else {
        getClassesFinish(
          classesFinish.currentPage + 1,
          Constants.LIMIT,
          'finish',
          true,
        );
      }
    }
  }
  function checkAll() {
    const items = [];
    let sum = 0;
    classesOnGoing?.data.map((item) => {
      if (!item?.isPayment) {
        items.push(item?.statusRegister?.requestId);
        sum += item?.price;
      }
    });
    setSelected(items);
    setTotalAmount(sum);
  }
  async function requestUrlPayment() {
    try {
      const ipAddress = await IP_ADDRESS.get();
      const data = {
        requestIds: selected,
        typePayment: 'payment',
        amount: totalAmount,
        ipAddress,
      };
      setBusy1(true);
      const response = await createPayment(data);
      setUrl(response);
      if (response) {
        props?.navigation?.navigate('WebViewPayment', {url: response});
      }
      setBusy1(false);
    } catch (error) {
      setBusy1(false);
      console.log('requestUrlPayment ==>', error);
      if (error?.response?.data?.errors) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'error',
          text1:
            error?.response?.data?.errors[0].message ||
            error?.response?.data?.errors[0].param,
        });
      } else {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'error',
          text1: 'Lỗi máy chủ',
        });
      }
    }
  }
  const lengthData = () => {
    const len = [];
    classesOnGoing?.data.map((val) => {
      if (!val?.isPayment) len.push(val);
    });
    return len.length;
  };
  const footer = (
    <BoxShadow style={styles.wrapFooter}>
      <View style={styles.buttonFooter}>
        <View style={styles.footerStyle}>
          <CheckBox
            checkedIcon="check-circle"
            uncheckedIcon="circle-o"
            checkedColor="green"
            checked={selected.length === lengthData()}
            onPress={() =>
              selected.length === lengthData() ? setSelected([]) : checkAll()
            }
          />
          <Text>Chọn tất cả</Text>
        </View>
        <View style={styles.footerStyle}>
          <ButtonCustom
            style={styles.wrapBtn}
            isBusy={isBusy1}
            disabled={selected.length === 0}
            onPress={requestUrlPayment}
            text={'THANH TOÁN'}
          />
        </View>
      </View>
    </BoxShadow>
  );
  return (
    <Container
      header={
        <Statusbar
          title={'Quản lý lớp học'}
          contentBarStyles={{justifyContent: 'center'}}
          tab={tab}
          tabLabels={['Đang học', 'Đã học', 'Lịch sử']}
          changeTab={handleSetTab}
          arrowBack={true}
          navigation={props.navigation}
          contentBarStyles={{justifyContent: 'space-between'}}
          headerHeight={ConfigStyle.statusBarHeight}
          tabStyle={{paddingHorizontal: 22}}
          textRight={
            tab === 0 ? (
              <TouchableOpacity
                onPress={() => {
                  setChecked(!checked);
                  if (checked) {
                    setSelected([]);
                    setTotalAmount(0);
                  }
                  // setSelected([])
                }}
              >
                {!checked ? (
                  <Text style={{color: '#ffffff', fontSize: 12}}>Chọn</Text>
                ) : (
                  <Text style={{color: '#ffffff', fontSize: 12}}>Hủy</Text>
                )}
              </TouchableOpacity>
            ) : null
          }
        />
      }
      headerHeight={ConfigStyle.statusBarHeight}
      hideBackground={false}
      contentTop={
        <View style={styles.wrapTitle}>
          <Text style={[Styles.textBold, styles.title]}>
            {/* {tab === 0 ? 'Danh sách đang học' : null} */}
            {/* {tab === 1 ? 'Danh sách đã học' : null} */}
            {/* {tab === 2 ? '' : ''} */}
          </Text>
        </View>
      }
      footer={selected.length > 0 || checked ? footer : null}
    >
      {tab === 2 ? (
        !isBusy3 ? (
          <>
            {transaction?.data?.length ? (
              <PurchaseHistory
                data={transaction?.data}
                handleLoadMore={handleLoadMore}
                renderFooter={renderFooter}
                onRefresh={onRefresh}
                refreshing={refreshing}
              />
            ) : (
              <View style={Styles.wrapEmptyImage}>
                <IconEmpty width={'50%'}
height={'50%'} />
                <Text style={Styles.textBlack3}>Không có dữ liệu</Text>
              </View>
            )}
          </>
        ) : (
          <View style={{marginTop: 20}}>
            <ActivityIndicator color={Colors.orange} />
          </View>
        )
      ) : // <View style={Styles.wrapEmptyImage}>
      //   <IconEmpty width={'50%'} height={'50%'} />
      //   <Text style={Styles.textBlack3}>Không có dữ liệu</Text>
      // </View>
      (tab === 0 && !isBusy) || (tab === 1 && !isBusy2) ? (
        (tab === 0 && classesOnGoing.data?.length) ||
        (tab === 1 && classesFinish.data?.length) ? (
          <FlatList
            style={styles.listItem}
            data={tab === 0 ? classesOnGoing.data : classesFinish.data}
            renderItem={({item, index}) =>
              tab === 0 ? (
                <ItemClassRegistered
                  data={item || {}}
                  idManagement={item._id}
                  containerStyle={{marginHorizontal: 13}}
                  disabled={true}
                  navigation={props.navigation}
                  onRefresh={onRefresh}
                  access={'student'}
                  hide={true}
                  isRequest={item?.isRequest}
                  status={'ongoing'}
                  isPayment={item?.isPayment}
                  selected={selected}
                  action={handleSelect}
                  checked={checked}
                />
              ) : (
                <ClassRoomHorizontal
                  data={item}
                  isRequest={item?.isRequest}
                  containerStyle={{
                    flex: 1,
                    marginBottom: 8,
                    marginHorizontal: 10,
                  }}
                  navigation={props.navigation}
                  onRefresh={onRefresh}
                  hide={true}
                  status={'finish'}
                />
              )
            }
            keyExtractor={(item) => item._id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.orange]}
              />
            }
            ListFooterComponent={renderFooter}
            onEndReachedThreshold={0.4}
            onEndReached={handleLoadMore}
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
    </Container>
  );
};

export default ManageRegistry;
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
  },
  title: {
    fontSize: 16,
    marginBottom: 5,
  },
  wrapTitle: {
    marginTop: 35,
    marginLeft: 15,
  },
  listItem: {
    backgroundColor: Colors.whiteColor,
  },
  wrapFooter: {
    paddingHorizontal: 14,
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    borderBottomWidth: 0,
    paddingVertical: 9,
  },
  linearGradient: {
    borderRadius: 13,
  },
  buttonText: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  textPurchase: {
    fontSize: ConfigStyle.font14,
    color: Colors.whiteColor,
  },
  footerStyle: {flexDirection: 'row', alignItems: 'center'},
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonRemind: {
    paddingHorizontal: 12,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: Colors.orange,
    justifyContent: 'center',
  },
  textRemind: {
    fontSize: ConfigStyle.font14,
    color: Colors.orange2,
  },
  buttonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  footerContainer: {
    backgroundColor: Colors.whiteColor,
    shadowColor: '#dcdbdb',
    shadowOffset: {
      width: 0,
      height: -2,
    },
  },
});
