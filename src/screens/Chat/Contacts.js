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
import {useSelector} from 'react-redux';
import {func} from 'prop-types';
import FastImage from 'react-native-fast-image';
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
import {teacherGetManageClass} from '../../api/class';
import BoxShadow from '../../components/common/BoxShadow';
import IconChatActive from '../../assets/images/tab/chat1.svg';
import ButtonCustom from '../../components/common/ButtonFooterCustom';
import CustomActionSheet from '../../components/common/CustomActionSheet';

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
  const [classesOngoing, setClassesOngoing] = useState(INIT_VALUE);
  function callContact(phone) {
    Linking.openURL(`tel:${phone}`);
  }
  const user = useSelector((state) => state?.auth?.user);
  useEffect(() => {
    user?.access === 'teacher' ? getClassesOngoing() : getListFollow();
  }, []);

  function onSearch(event) {
    const {text} = event.nativeEvent;
    setTextSearch(text);
  }

  useDebouncedEffect(
    () => {
      getListFollow(1, 2 * Constants.LIMIT, textSearch, false, true);
    },
    500,
    [textSearch],
  );

  async function getListFollow(
    page = 1,
    limit = 2 * Constants.LIMIT,
    keyword = textSearch,
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) {
        setBusy(true);
      }
      const response = await userGetListFollow(page, limit, keyword);
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
      console.log('getListFollow ==>', error);
    }
  }

  function chatWithContact(item) {
    props.navigation.push('InboxChat', {
      to: item?.guest?._id,
      userReceive: {
        avatar: item?.avatar,
        online: item?.guest.isOnline,
        fullName: item?.guest?.fullName,
      },
    });
  }
  const contentRight = (item) => (
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
        onPress={() => chatWithContact(item)}
      >
        <IconChat width={19.7}
height={19.7} />
      </TouchableOpacity>
    </View>
  );

  function onRefresh() {
    setRefresh(true);
    getListFollow(1, 2 * Constants.LIMIT, textSearch, false, true);
  }

  const renderItem = ({item}) => (
    <AvatarInfo
      source={
        item?.guest?.avatar?.medium?.indexOf('http') !== -1
          ? item?.guest?.avatar?.medium
          : `${config.IMAGE_MD_URL}${item?.guest?.avatar?.medium}`
      }
      size={62}
      data={{fullName: item?.guest?.fullName}}
      content={item.phone}
      contentRight={contentRight(item)}
      titleStyle={{...Styles.title3RS, ...styles.nameContact}}
      contentStyles={styles.phoneNumberContact}
    />
  );
  function handleLoadMore() {
    if (user?.access === 'teacher') {
      if (
        classesOngoing.currentPage * Constants.LIMIT <
        classesOngoing.totalItems
      ) {
        getClassesOngoing(
          classesOngoing.currentPage + 1,
          2 * Constants.LIMIT,
          'ongoing',
          true,
        );
      }
    } else {
      if (listContact.currentPage * Constants.LIMIT < listContact.totalItems) {
        getListFollow(
          listContact.currentPage + 1,
          2 * Constants.LIMIT,
          textSearch,
          true,
        );
      }
    }
  }
  const renderFooter =
    user?.access !== 'teacher' &&
    listContact.data?.length >= listContact.totalItems ? (
      <Text style={Styles.countResult}>{listContact.totalItems} kết quả</Text>
    ) : user?.access === 'teacher' &&
      classesOngoing.data?.length >= classesOngoing.totalItems ? (
      <Text style={Styles.countResult}>
        {classesOngoing.totalItems} kết quả
      </Text>
    ) : (
      <ActivityIndicator color={Colors.orange} />
    );
  async function getClassesOngoing(
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
      const response = await teacherGetManageClass(page, limit, 'ongoing');
      if (loadMore) {
        if (response?.payload) {
          setClassesOngoing({
            data: [...classesOngoing.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setClassesOngoing({
            data: response?.payload || [],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
        setBusy(false);
      }
      setRefresh(false);
    } catch (error) {
      console.log('get getClasses ==>', error);
    }
  }
  const RenderCard = ({item}) => (
    <View>
      <BoxShadow style={styles.container}>
        <View style={[Styles.flexRow, {flex: 5, marginBottom: 5}]}>
          <View style={[{flex: 1}]}>
            <FastImage
              source={{
                uri: config?.IMAGE_SM_URL + item?.avatar?.small,
              }}
              style={styles.image}
            />
          </View>
          <View
            style={[{flex: 2, marginHorizontal: 20, justifyContent: 'center'}]}
          >
            <Text
              style={{fontSize: 20, color: Colors.black4}}
              numberOfLines={1}
            >
              {item?.title}
            </Text>
            <Text>{''}</Text>
            <Text style={{fontSize: 12, color: Colors.greyBold}}>
              {item?.status === 'ongoing' ? 'Đang diễn ra' : null}
              <Text>
                {'   '}
                {item?.order}/{item?.quantity}
              </Text>
            </Text>
          </View>
          <View></View>
        </View>
        <View style={styles.groupBtn}>
          <ButtonCustom
            style={styles.btnAction}
            text={'CHI TIẾT'}
            onPress={async () => {
              props?.navigation?.navigate('Detail', {
                _idClass: item?._id,
                _idLesson: item?._id,
                isRequest: item?.isRequest,
                isShowStudent: true,
                access: 'teacher',
                status: 'ongoing',
              });
            }}
            textBtn={{fontSize: 12, paddingHorizontal: 10}}
            outline={true}
          />
          <ButtonCustom
            style={styles.btnAction}
            text={'DANH SÁCH'}
            onPress={() => {
              props.navigation?.navigate('StudentClass', {
                id: item?._id,
                title: item?.title,
                isRequest: item?.isRequest,
                user: item?.user,
              });
            }}
            textBtn={{fontSize: 12, paddingHorizontal: 10}}
          />
        </View>
      </BoxShadow>
    </View>
  );
  return (
    <Container
      header={
        <Statusbar
          search={user?.access !== 'teacher'}
          arrowBack={true}
          title={user?.access === 'teacher' ? 'Danh sách lớp' : 'Liên hệ'}
          textSearch={textSearch}
          actionSearch={user?.access === 'teacher' ? null : onSearch}
          headerHeight={ConfigStyle.statusBarHeight1}
          navigation={props.navigation}
        />
      }
      keyboardAvoidingView={true}
      keyboardShouldPersistTaps={true}
      headerHeight={ConfigStyle.statusBarHeight1}
      hideBackground={true}
    >
      {!isBusy ? (
        listContact.data?.length || classesOngoing?.data.length ? (
          <FlatList
            style={styles.flatList}
            data={
              user?.access === 'teacher'
                ? classesOngoing?.data
                : listContact.data
            }
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={onRefresh}
                colors={[Colors.orange]}
              />
            }
            renderItem={({item}) =>
              user?.access !== 'teacher' ? (
                renderItem({item})
              ) : (
                <RenderCard item={item}
navigation={props?.navigation} />
              )
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
  image: {
    width: 72,
    height: 72,
    borderRadius: 72 / 2,
    borderWidth: 1,
    borderColor: Colors.borderThin,
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
  iconDelete: {width: 14, height: 18},
  itemChat: {
    marginTop: 10,
    paddingHorizontal: 3,
    paddingVertical: 3,
  },
  container: {
    marginBottom: 15,
    paddingHorizontal: 17,
    paddingVertical: 12,
  },
});
