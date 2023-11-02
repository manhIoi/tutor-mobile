import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import {Text, CheckBox} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import Container from '../../components/common/ContainerRenderList';
import Statusbar from '../../components/common/StatusBar';
import ConfigStyle from '../../theme/ConfigStyle';
import {getListClass, studentGetRegisteredClass} from '../../api/class';
import Styles from '../../theme/MainStyles';
import Constants from '../../../constants/Values';
import ClassRoomHorizontal from '../../components/Home/ClassRoomHorizontal';
import IconEmpty from '../../assets/images/svg/empty-list.svg';
import Colors from '../../theme/Colors';
import History from '../../components/IncomeManagent/History';
import ItemClassRegistered from '../../components/ManageRegistry/ItemClassRegistered';
import Payment from '../../components/IncomeManagent/Payment';
import BoxShadow from '../../components/common/BoxShadow';
import {getBalance, getTransaction, getWithDraw} from '../../api/payment';
import PurchaseHistory from '../ClassManager/PurchaseHistory';
import ButtonCustom from '../../components/common/ButtonFooterCustom';
import ViString from '../../theme/ViString';
import InputForm from '../../components/IncomeManagent/Input';
import CustomPicker from '../../components/common/CustomPicker';
import {
  formatdddDDMMYYYY,
  formatYYYYMMDD,
  formatDate,
  formatDDMMYYY,
  formatDateTime,
} from '../../utils/string.util';
import {updateBalance} from '../../lib/slices/authSlice';

const INIT_VALUE = {
  data: [],
  currentPage: 1,
  totalItems: 0,
  limit: 10,
  selected: [],
};
const INITIAL_FORM = {
  numberCard: {
    value: '',
    msgError: '',
  },
  nameBank: {
    value: '',
    msgError: '',
  },
  codeName: {
    value: '',
    msgError: '',
  },
  fullName: {
    value: '',
    msgError: '',
  },
  total: {
    value: 0,
    msgError: '',
  },
};

const ManageRegistry = (props) => {
  const [tab, setTab] = useState(0);
  const [checked, setChecked] = useState(false);
  const [selected, setSelected] = useState([]);
  const [classesRegistry, setClassesRegistry] = useState(INIT_VALUE);
  const [classesLike, setClassesLike] = useState(INIT_VALUE);
  const [isBusy, setBusy] = useState(false);
  const [isBusy2, setBusy2] = useState(false);
  const [transaction, setTransaction] = useState(INIT_VALUE);
  const [isBusy3, setBusy3] = useState(true);
  const [refreshing, setRefresh] = useState(false);
  const [isShow, setShow] = useState(false);
  const [form, setForm] = React.useState(INITIAL_FORM);
  const dispatch = useDispatch();
  const balance = useSelector((state) => state.auth.balance);
  const [status, setStatus] = useState('pending');
  const [withdrawal, setWithdrawal] = useState([]);
  const isFocused = useIsFocused();
  // useEffect(() => {
  //   if (props.route?.params?.tab) {
  //     setTab(props.route?.params?.tab);
  //     if (props.route.params.tab === 0) {
  //       getClassesRegistry();
  //     } else {
  //       // getClassesLike();
  //     }
  //   }
  // }, []);

  useEffect(() => {
    if (tab === 0 && !withdrawal.data?.length) {
      teacherGetWithDraw(1, Constants.LIMIT, status);
    }
    if (tab === 1) {
      getAllTransaction(
        1,
        Constants.LIMIT,
        'createdAt:asc',
        true,
        false,
        false,
      );
    }
  }, [tab, balance]);
  useEffect(() => {
    teacherGetWithDraw(1, Constants.LIMIT, status);
  }, [status]);

  async function teacherGetWithDraw(
    page = 1,
    limit = Constants.LIMIT,
    status,
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) {
        setBusy2(true);
      }
      const response = await getWithDraw(page, limit, status);
      if (loadMore) {
        if (response?.payload) {
          setWithdrawal({
            data: [...withdrawal.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setWithdrawal({
            data: response?.payload || [],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
        setBusy2(false);
      }
      setRefresh(false);
    } catch (error) {
      console.log('teacherGetWithDraw ==>', error);
    }
  }
  async function getBalances() {
    try {
      const response = await getBalance();
      dispatch(updateBalance(response.balance));
    } catch (error) {
      console.log(error);
    }
  }
  async function onRefresh(showLoading = true) {
    if (showLoading) {
      setRefresh(true);
    }
    await getBalances();
    if (tab === 0) {
      await teacherGetWithDraw(1, Constants.LIMIT, status, false, true);
    } else {
      await getAllTransaction(
        1,
        Constants.LIMIT,
        'createdAt:asc',
        true,
        false,
        true,
      );
    }
  }
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
  function handleSetTab(tab) {
    setTab(tab);
  }
  const renderFooter =
    (tab === 0 && withdrawal.data?.length >= withdrawal.totalItems) ||
    (tab === 1 && transaction.data?.length >= transaction.totalItems) ? (
      <Text style={Styles.countResult}>
        {tab === 0 ? withdrawal.totalItems : transaction.totalItems} kết quả
      </Text>
    ) : (
      <ActivityIndicator color={Colors.orange} />
    );

  function handleLoadMore() {
    if (
      (tab === 0 &&
        withdrawal.currentPage * Constants.LIMIT < withdrawal.totalItems) ||
      (tab === 1 &&
        transaction.currentPage * Constants.LIMIT < transaction.totalItems)
    ) {
      if (tab === 0) {
        teacherGetWithDraw(
          withdrawal.currentPage + 1,
          Constants.LIMIT,
          status,
          true,
        );
      } else {
        getAllTransaction(
          transaction.currentPage + 1,
          Constants.LIMIT,
          'createdAt:asc',
          true,
          true,
        );
      }
    }
  }
  // console.log(transaction);

  function validateForm() {
    let validate = true;
    const formData = {...form};
    if (!formData.codeName.value) {
      formData.codeName.msgError = ViString.fieldIsRequired;
      validate = false;
    }
    if (!formData.numberCard.value) {
      formData.numberCard.msgError = ViString.fieldIsRequired;
      validate = false;
    }
    if (!formData.nameBank.value) {
      formData.nameBank.msgError = ViString.fieldIsRequired;
      validate = false;
    }
    if (!formData.fullName.value) {
      formData.fullName.msgError = ViString.fieldIsRequired;
      validate = false;
    }
    if (!formData.total.value) {
      formData.total.msgError = ViString.fieldIsRequired;
      validate = false;
    }
    setForm(formData);
    return validate;
  }
  function handleChange(value, name) {
    setForm({
      ...form,
      [name]: {
        ...form[name],
        value: value,
        msgError: '',
      },
    });
  }
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={
          props?.index + 1 === props.length
            ? styles.parentContainer2
            : styles.parentContainer1
        }
      >
        <View style={styles.itemContainer}>
          <View style={styles.circleContainer}>
            <View style={styles.cirleIcon} />
          </View>

          <View style={styles.infor}>
            <Text>
              <Text numberOfLines={1}>{item?.info?.nameBank}</Text>
            </Text>
            <Text style={styles.textNumber}>
              {/* {formatDDMMYYY(item?.createdAt)} */}
              {formatDateTime(item?.createdAt)}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 5,
              }}
            >
              <Text style={styles.textSuccess}>
                {item?.status === 'pending'
                  ? 'Chờ duyệt'
                  : item?.status === 'success'
                  ? 'Thành công'
                  : 'Thất bại'}
              </Text>
              <Text style={styles.textPurchase}>
                {item?.total.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.cash}></View>
      </TouchableOpacity>
    );
  };
  return (
    <Container
      header={
        <Statusbar
          title={'Quản lý thu nhập'}
          contentBarStyles={{justifyContent: 'center'}}
          tab={tab}
          tabLabels={['Lịch sử rút tiền', 'Lịch sử']}
          changeTab={handleSetTab}
          arrowBack={true}
          navigation={props.navigation}
          contentBarStyles={{justifyContent: 'space-between'}}
          headerHeight={ConfigStyle.statusBarHeight}
        />
      }
      headerHeight={ConfigStyle.statusBarHeight}
      hideBackground={false}
      contentTop={
        <View style={styles.wrapTitle}>
          <Text style={[Styles.textBold, styles.title]}></Text>
        </View>
      }
    >
      {tab === 1 ? (
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
          <ActivityIndicator size="small"
color={Colors.orange2} />
        )
      ) : (
        <ScrollView>
          <InputForm onRefresh={onRefresh}
navigation={props?.navigation} />
          <View style={{flexDirection: 'row', marginVertical: 0}}>
            <View style={{justifyContent: 'center'}}>
              <Text style={{fontSize: 16, marginHorizontal: 20}}>
                Lịch sử giao dịch:
              </Text>
            </View>
            <View style={{justifyContent: 'center'}}>
              <CustomPicker
                items={[
                  {_id: 'pending', name: 'Đang yêu cầu'},
                  {_id: 'success', name: 'Thành công'},
                  {_id: 'reject', name: 'Thất bại'},
                ]}
                value={status}
                onChange={(value) => setStatus(value)}
                wrapStyle={{
                  marginLeft: 17,
                  marginBottom: 12,
                  marginTop: 12,
                  justifyContent: 'center',
                }}
                textStyle={Styles.textLight}
              />
            </View>
          </View>
          {!isBusy2 ? (
            withdrawal?.data?.length > 0 ? (
              <BoxShadow style={styles.shapeContainer}>
                <FlatList
                  data={withdrawal?.data}
                  renderItem={renderItem}
                  handleLoadMore={handleLoadMore}
                  refreshing={refreshing}
                  ListFooterComponent={renderFooter}
                  onEndReachedThreshold={0.4}
                  onEndReached={handleLoadMore}
                  scrollEnabled={true}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      colors={[Colors.orange]}
                    />
                  }
                />
              </BoxShadow>
            ) : (
              <View style={Styles.wrapEmptyImage}>
                <IconEmpty width={'50%'}
height={'50%'} />
                <Text style={Styles.textBlack3}>Không có dữ liệu</Text>
              </View>
            )
          ) : (
            <ActivityIndicator size={'small'}
color={Colors.orange2} />
          )}
        </ScrollView>
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
    marginTop: 25,
    marginLeft: 15,
  },
  listItem: {
    backgroundColor: Colors.whiteColor,
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
  // textPurchase: {
  //   fontSize: ConfigStyle.font14,
  //   color: Colors.whiteColor,
  // },
  shapeContainer: {
    paddingVertical: 15,
    shadowColor: '#C0C0C0',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 5,
    backgroundColor: Colors.whiteColor,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    flex: 1,
  },
  btnAction: {
    width: '45%',
    borderRadius: 20,
  },
  groupBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 15,
  },
  boxShadow: {
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginVertical: 10,
    width: '100%',
    backgroundColor: Colors.whiteColor,
    borderColor: '#C0C0C0',
    borderStyle: 'dotted',
    borderRadius: 1,
    position: 'relative',
    fontSize: 12,
  },
  parentContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    // marginHorizontal: 19,
    borderBottomColor: Colors.blackborder,
    marginTop: 7,
  },
  parentContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginHorizontal: 19,
    marginTop: 7,
  },
  itemContainer: {flexDirection: 'row'},
  infor: {marginLeft: 15},
  circleContainer: {
    justifyContent: 'center',
  },
  cirleIcon: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    borderWidth: 1,
    borderColor: Colors.blackborder,
  },
  cash: {
    flex: 1,
    // position: "absolute",
    // right:0
    // justifyContent: 'flex-end',
  },
  textInfor: {
    fontSize: ConfigStyle.font12,
    color: Colors.black4,
  },
  textNumber: {
    fontSize: ConfigStyle.font10,
    color: Colors.greyBold,
    marginVertical: 5,
  },
  textSuccess: {
    paddingBottom: 7,
    color: Colors.greenBold,
    fontSize: ConfigStyle.font10,
    flex: 5,
  },
  textPurchase: {
    paddingBottom: 7,
    fontSize: ConfigStyle.font10,
    color: Colors.greyBold,
    flex: 5,
  },
});
