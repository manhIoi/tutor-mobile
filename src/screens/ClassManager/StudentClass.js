import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {Text} from 'react-native-elements';
import Container from '../../components/common/ContainerRenderList';
import Statusbar from '../../components/common/StatusBar';
import ConfigStyle from '../../theme/ConfigStyle';
import AvatarInfo from '../../components/common/AvatarInfo';
import Styles from '../../theme/MainStyles';
import IconChat from '../../assets/images/svg/chat.svg';
import IconPhone from '../../assets/images/svg/phone (1).svg';
import {userGetListFollow} from '../../api/users';
import Constants from '../../../constants/Values';
import Colors from '../../theme/Colors';
import config from '../../../config/config';
import IconEmpty from '../../assets/images/svg/empty-list.svg';
import useDebouncedEffect from '../../hooks/useDebounce';
import {teacherGetStudent} from '../../api/class';

const INIT_VALUE = {
  data: [],
  currentPage: 1,
  totalItems: 0,
};
const Contacts = (props) => {
  const [listContact, setListContact] = useState(INIT_VALUE);
  const [isBusy, setBusy] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [textSearch, setTextSearch] = useState('');
  const [student, setStudent] = useState([]);
  const id = props?.route?.params.id;
  const {navigation} = props;
  console.log('id', id);
  function callContact(phone) {
    Linking.openURL(`tel:${phone}`);
  }

  useEffect(() => {
    getListStudent(id);
  }, []);
  async function getListStudent(
    id,
    page = 1,
    limit = 2 * Constants.LIMIT,
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) {
        setBusy(true);
      }
      const response = await teacherGetStudent(id, page, limit);
      if (loadMore) {
        if (response?.payload) {
          setListContact({
            data: [...listContact.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setListContact({
            data: response?.payload || [],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
        setBusy(false);
      }
      setRefresh(false);
    } catch (error) {
      console.log('getListStudent ==>', error);
    }
  }

  function chatWithContact(item, navigation) {
    navigation.navigate('InboxChat', {
      to: item?.user?.id || item?._id,
      userReceive: {
        avatar:
          typeof item?.avatar === 'string'
            ? JSON?.parse(item?.avatar)
            : item?.user?.avatar,
        online: item?.guest?.isOnline || item?.isOnline,
        fullName: item?.user?.fullName || item?.fullName,
      },
    });
  }
  const contentRight = (item, navigation) => (
    <View style={styles.wrapAction}>
      <TouchableOpacity
        style={styles.wrapIconRight}
        onPress={() => callContact(item.phone)}
      >
        <IconPhone width={22}
height={22} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.wrapIconRight}
        onPress={() => chatWithContact(item, navigation)}
      >
        <IconChat width={19.7}
height={19.7} />
      </TouchableOpacity>
    </View>
  );

  function onRefresh() {
    setRefresh(true);
    getListStudent(id, 1, 2 * Constants.LIMIT, false, true);
  }

  const RenderItem = ({item, navigation}) => {
    return (
      <AvatarInfo
        source={
          typeof item?.avatar === 'string'
            ? config.IMAGE_MD_URL + JSON?.parse(item?.avatar)?.medium
            : item?.user?.avatar?.medium?.indexOf('http') !== -1
            ? item?.user?.avatar?.medium
            : `${config.IMAGE_MD_URL}${item?.user?.avatar?.medium}`
        }
        size={62}
        phone={item?.user?.isPayment ? 'Đã thanh toán' : 'Chưa thanh toán'}
        data={{fullName: item?.user?.fullName || item?.fullName}}
        content={item?.user?.phone}
        contentRight={contentRight(item, navigation)}
        titleStyle={{...Styles.title3RS, ...styles.nameContact}}
        contentStyles={styles.phoneNumberContact}
      />
    );
  };
  function handleLoadMore() {
    if (listContact.currentPage * Constants.LIMIT < listContact.totalItems) {
      getListStudent(
        id,
        listContact.currentPage + 1,
        2 * Constants.LIMIT,
        textSearch,
        true,
      );
    }
  }
  const renderFooter =
    listContact.data?.length >= listContact.totalItems ? (
      <Text style={Styles.countResult}>{listContact.totalItems} kết quả</Text>
    ) : (
      <ActivityIndicator color={Colors.orange} />
    );

  return (
    <Container
      header={
        <Statusbar
          arrowBack={true}
          title={props?.route?.params?.title}
          headerHeight={ConfigStyle.statusBarHeight1}
          navigation={props.navigation}
        />
      }
      headerHeight={ConfigStyle.statusBarHeight1}
      hideBackground={true}
    >
      <View>
        <Text
          style={{
            fontSize: ConfigStyle.font20,
            marginVertical: 20,
            marginHorizontal: 20,
          }}
        >
          Danh sách người học
        </Text>
        {!isBusy ? (
          listContact.data?.length ? (
            <FlatList
              style={styles.flatList}
              data={listContact.data}
              refreshControl={
                <RefreshControl
                  refreshing={refresh}
                  onRefresh={onRefresh}
                  colors={[Colors.orange]}
                />
              }
              renderItem={({item}) => (
                <RenderItem item={item}
navigation={props?.navigation} />
              )}
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
      </View>
    </Container>
  );
};
export default Contacts;
const styles = StyleSheet.create({
  containerStyle: {
    marginLeft: 11,
    paddingHorizontal: 6,
    paddingVertical: 7,
    backgroundColor: '#FFEDDD',
    borderBottomLeftRadius: 60,
    borderTopLeftRadius: 60,
  },
  ownerName: {
    color: '#EE6423',
    marginBottom: 0,
  },
  phoneNumberOwner: {
    marginLeft: 0,
    color: '#EE6423',
  },
  containerList: {
    flex: 1,
    marginTop: 5,
    paddingHorizontal: 17,
  },
  iconPhone: {
    width: 19,
    height: 19,
    margin: 7,
  },
  iconChat: {
    width: 17.7,
    height: 17.7,
    margin: 7,
  },
  wrapAction: {
    flexDirection: 'row',
  },
  nameContact: {
    color: '#000',
    marginBottom: 0,
  },
  phoneNumberContact: {
    color: '#666666',
  },
  wrapIconRight: {
    // borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  flatList: {
    paddingHorizontal: 15,
  },
});
