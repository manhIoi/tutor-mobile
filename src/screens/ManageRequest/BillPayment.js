import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Text,CheckBox} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import Container from '../../components/common/ContainerRenderList';
import Statusbar from '../../components/common/StatusBar';
import ItemCourseRequest from '../../components/RequestManagement/ItemCourseRequest';
import ConfigStyle from '../../theme/ConfigStyle';
import Styles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';
import Constants from '../../../constants/Values';
import {userGetListRequest} from '../../api/class';
import IconEmpty from '../../assets/images/svg/empty-list.svg';
import BoxShadow from '../../components/common/BoxShadow';
import ButtonCustom from '../../components/common/ButtonFooterCustom';
import IconPayment from '../../assets/images/svg/access.svg';
import IconChecked from '../../assets/images/svg/tick-green.svg';
import IconUnChecked from '../../assets/images/svg/iconRadio.svg';

const INIT_VALUE = {
  data: [],
  currentPage: 1,
  totalItems: 0,
  limit: 10,
};
export default function RequestManagementScreen(props) {
  const [textSearch, setTextSearch] = useState('');
  const [listRequest, setListRequest] = useState(INIT_VALUE);
  const [isBusy, setBusy] = useState(false);
  const [refreshing, setRefresh] = useState(false);
  const [timeLoad, setTimeLoad] = useState(0);
  const [checked, setChecked] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      if (timeLoad !== 0) {
        getListRequesting();
      }
    }, []),
  );

  useEffect(() => {
    getListRequesting();
  }, []);
  function onSearch(event) {
    const {text} = event.nativeEvent;
    setTextSearch(text);
  }
  async function getListRequesting(
    page = 1,
    limit = Constants.LIMIT,
    text = '',
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) {
        setBusy(true);
      }
      const response = await userGetListRequest(page, limit);
      setTimeLoad(timeLoad + 1);
      if (loadMore) {
        if (response?.payload) {
          setListRequest({
            data: [...listRequest.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setListRequest({
            data: response?.payload || [],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
        setBusy(false);
      }
      setRefresh(false);
    } catch (error) {
      console.log('get getListRequesting ==>', error);
    }
  }

  async function onRefresh(showIcon = true) {
    if (showIcon) {
      setRefresh(true);
    }
    await getListRequesting(1, Constants.LIMIT, '', false, true);
  }
  function handleLoadMore() {
    if (listRequest.currentPage * Constants.LIMIT < listRequest.totalItems) {
      getListRequesting(listRequest.currentPage + 1, Constants.LIMIT, '', true);
    }
  }
  const renderFooter =
    listRequest.data?.length >= listRequest.totalItems ? (
      <Text style={Styles.countResult}>{listRequest.totalItems} kết quả</Text>
    ) : (
      <ActivityIndicator color={Colors.orange} />
    );
  const footer = (
    <BoxShadow style={styles.wrapFooter}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View style={{justifyContent: 'center', marginRight: 5}}>
          <IconPayment width={20}
height={20} />
        </View>
        <View style={{justifyContent: 'center'}}>
          <Text style={{fontSize: ConfigStyle.font16}}>Mã giảm giá</Text>
        </View>
        <TextInput
          style={{
            flex: 1,
            width: '100%',
            marginHorizontal: 14,
            paddingHorizontal: 10,
            backgroundColor: '#F3F3F3',
            borderColor: '#C0C0C0',
            borderStyle: 'dotted',
            borderWidth: 2,
            borderRadius: 1,
            position: 'relative',
            fontSize: 12,
            height: 34,
          }}
          placeholder={'Nhập mã giảm giá '}
        />
      </View>
      <TouchableOpacity
        style={{flexDirection: 'row', marginLeft: -20}}
        onPress={() => {
          setChecked(!checked);
        }}
      >
        <CheckBox
          checked={checked}
          checkedIcon={<IconChecked width={20}
height={20} />}
          uncheckedIcon={<IconUnChecked height={20}
width={20} />}
          onPress={() => {
            setChecked(!checked);
          }}
        />
        <View style={{justifyContent: 'center'}}>
          <Text style={{fontSize: ConfigStyle.font16}}>Chọn tất cả</Text>
        </View>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 20,
        }}
      >
        <Text style={{fontSize: 16}}> Tổng tiền</Text>
        <Text style={{fontSize: 16, color: Colors.orange}}> 10000000</Text>
      </View>
      <View style={styles.groupBtn}>
        <ButtonCustom
          style={styles.wrapBtn}
          onPress={() => {
            props?.navigation?.navigate('Menu', {
              screen: 'Payement',
            });
          }}
          text={'Thanh toán'}
        />
      </View>
    </BoxShadow>
  );
  return (
    <Container
      header={
        <Statusbar
          // search={true}
          headerHeight={ConfigStyle.statusBarHomeHeightTutor}
          navigation={props.navigation}
          arrowBack={true}
          title={'Phiếu thanh toán'}
        />
      }
      footer={footer}
      headerHeight={ConfigStyle.statusBarHomeHeightTutor}
    >
      {!isBusy ? (
        listRequest.data?.length ? (
          <FlatList
            style={styles.wrapList}
            data={listRequest?.data || []}
            renderItem={({item, index}) => (
              <ItemCourseRequest
                data={item}
                containerStyle={{marginHorizontal: 13}}
                navigation={props.navigation}
                onRefresh={onRefresh}
                payment={true}
              />
            )}
            keyExtractor={(item) => item._id}
            ListFooterComponent={renderFooter}
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
    </Container>
  );
}
const styles = StyleSheet.create({
  wrapList: {
    marginTop: 10,
  },
  wrapFooter: {
    flexDirection: 'column',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    // justifyContent: 'space-between',
    // alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 0,
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    borderBottomWidth: 0,
    paddingVertical: 19,
    marginTop: 1,
  },
  wrapBtn: {
    width: '45%',
    borderRadius: 20,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  groupBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 10,
    width: '100%',
  },
});
