import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Image,
  ActivityIndicator,
} from 'react-native';
import Container from '../../components/common/ContainerRenderList';
import Statusbar from '../../components/common/StatusBar';
import ConfigStyle from '../../theme/ConfigStyle';
import Colors from '../../theme/Colors';
import ItemStudentRegistry from '../../components/ManageTutorRegister/ItemStudentRegistry';
import {teacherManageRegistry} from '../../api/class';
import Constants from '../../../constants/Values';
import ItemClassRegistered from '../../components/ManageRegistry/ItemClassRegistered';
import ClassRoomHorizontal from '../../components/Home/ClassRoomHorizontal';
import Styles from '../../theme/MainStyles';
import IconEmpty from '../../assets/images/svg/empty-list.svg';
import {getReviewByClass} from '../../api/users';
import ReviewList from '../../components/Tutor/ReviewList';
import BoxShadow from '../../components/common/BoxShadow';
import Avatar from '../../components/common/Avatar';
import config from '../../../config/config';
import RateStar from '../../components/common/RateStar';

const INIT_VALUE = {
  data: [],
  currentPage: 1,
  totalItems: 0,
  limit: 10,
};
export default function ListReview(props) {
  const [isBusy, setBusy] = useState(true);
  const [refreshing, setRefresh] = useState(false);
  const [listReview, setListReview] = useState([]);
  useEffect(() => {
    if (props.route?.params?._id) {
      getListReview(props.route.params._id);
    }
  }, []);

  async function getListReview(
    id,
    page = 1,
    limit = Constants.LIMIT,
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) {
        setBusy(true);
      }
      const response = await getReviewByClass(id, page, limit);
      if (loadMore) {
        if (response?.payload) {
          setListReview({
            data: [...listReview.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setListReview({
            data: response?.payload || [],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
        setBusy(false);
      }
      setRefresh(false);
    } catch (error) {
      setBusy(false);
      console.log('getManageRegistry ==> ', error);
    }
  }
  async function onRefresh(showLoading = true) {
    if (showLoading) {
      setRefresh(true);
    }
    await getListReview(
      props.route?.params?._id,
      1,
      Constants.LIMIT,
      false,
      true,
    );
  }
  const formatDateCreated = (date) => {
    const dateCreated = new Date(date);
    if (date && dateCreated) {
      return (
        `${dateCreated.getDate() 
        } th ${ 
        dateCreated.getMonth() + 1 
        }, ${ 
        dateCreated.getFullYear()}`
      );
    }
    
  };
  const ReviewItem = (props) => {
    return (
      <BoxShadow style={styles.wrapItemReview}>
        <Avatar
          size={65}
          source={`${config.IMAGE_MD_URL}${props?.data?.user?.avatar?.medium}`}
        />
        <View style={styles.wrapContent}>
          <View>
            <Text
              numberOfLines={1}
              style={[Styles.title4RS, Styles.textNormal]}
            >
              {props?.data?.user?.fullName}
            </Text>
            <Text style={Styles.textBlack3}>{props?.review?.review}</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text
              style={{...Styles.textBlack3, marginTop: 5, marginBottom: 10}}
            >
              {formatDateCreated(props?.data?.createdAt) || null}
            </Text>
            <RateStar star={props?.data?.star}
size={8} />
          </View>
        </View>
      </BoxShadow>
    );
  };

  const renderFooter =
    listReview.data?.length >= listReview.totalItems ? (
      <Text style={Styles.countResult}>{listReview.totalItems} kết quả</Text>
    ) : (
      <ActivityIndicator color={Colors.orange} />
    );

  function handleLoadMore() {
    if (listReview.currentPage * Constants.LIMIT < listReview.totalItems) {
      getListReview(
        props.route?.params?._id,
        listReview.currentPage + 1,
        Constants.LIMIT,
        true,
        false,
      );
    }
  }
  return (
    <Container
      header={
        <Statusbar
          headerHeight={ConfigStyle.statusBarHeight}
          navigation={props.navigation}
          title={props?.route?.params?.title}
          arrowBack={true}
        />
      }
      hideBackground={true}
      headerHeight={ConfigStyle.statusBarHeight}
      contentTop={
        <View style={{marginHorizontal: 15}}>
          <Text style={styles.textList}>Danh sách các các nhận xét</Text>
        </View>
      }
    >
      <View style={{paddingHorizontal: 16}}>
        {!isBusy ? (
          listReview?.data?.length ? (
            <FlatList
              style={styles.listItem}
              data={listReview?.data}
              renderItem={({item, index}) => (
                <ReviewItem
                  onRefresh={onRefresh}
                  data={item}
                  navigation={props.navigation}
                />
              )}
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
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  textList: {
    fontSize: 16,
    color: Colors.black4,
    marginVertical: 10,
  },
  wrapItemReview: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  wrapContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 15,
  },
});
