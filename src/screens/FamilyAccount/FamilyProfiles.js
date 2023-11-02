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
import {Text} from 'react-native-elements';
import {useIsFocused} from '@react-navigation/native';
import Container from '../../components/common/ContainerRenderList';
import Statusbar from '../../components/common/StatusBar';
import ConfigStyle from '../../theme/ConfigStyle';
import Styles from '../../theme/MainStyles';
import Constants from '../../../constants/Values';
import IconEmpty from '../../assets/images/svg/empty-list.svg';
import Colors from '../../theme/Colors';
import MainStyles from '../../theme/MainStyles';
import BackgroundGradient from '../../components/common/BackgroudGradient';
import {getfamilyaccount} from '../../api/familyProfile';
import config from '../../../config/config';

const INIT_VALUE = {
  data: [],
  currentPage: 1,
  totalItems: 0,
  limit: 10,
};
const ProfileScreen = (props) => {
  const [familyData, setFamilyData] = useState(INIT_VALUE);
  const [isBusy, setBusy] = useState(false);
  const [refreshing, setRefresh] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    getFamilyProfiles();
  }, [isFocused]);
  useEffect(() => {
    if (!setFamilyData.data?.length) {
      getFamilyProfiles();
    }
  }, [isFocused]);
  async function getFamilyProfiles(
    page = 1,
    limit = Constants.LIMIT,
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) {
        setBusy(true);
      }
      const response = await getfamilyaccount(page, limit);
      if (loadMore) {
        if (response?.payload) {
          setFamilyData({
            data: [...familyData.data, ...(response?.payload || [])],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setFamilyData({
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
  async function onRefresh(showLoading = true) {
    if (showLoading) {
      setRefresh(true);
    }
    await getFamilyProfiles(1, Constants.LIMIT, '', false, true);
  }
  const renderFooter =
    familyData.data?.length >= familyData.totalItems ? (
      <Text style={Styles.countResult}>{familyData.totalItems} kết quả</Text>
    ) : (
      <ActivityIndicator color={Colors.orange} />
    );

  function handleLoadMore() {
    if (familyData.currentPage * Constants.LIMIT < familyData.totalItems) {
      getFamilyProfiles(familyData.currentPage + 1, Constants.LIMIT, true);
    }
  }
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.viewcontainer}
        onPress={() => {
          props.navigation.navigate('FamilyAccount', {item});
        }}
      >
        <Image
          source={{uri: `${config.IMAGE_MD_URL}${item?.avatar?.medium}`}}
          style={styles.image}
        />
        <View style={styles.viewcontent}>
          <Text style={styles.fullname}>{item.fullName}</Text>
          <Text style={styles.relationship}>{item.relationship}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  const footer = (
    <TouchableOpacity
      style={styles.btnAdd}
      onPress={() => {
        props.navigation.push('AddFamilyAccount');
      }}
    >
      <BackgroundGradient
        style={{borderRadius: 30, paddingHorizontal: 12, paddingVertical: 12}}
      >
        <Image
          source={require('../../assets/images/add.png')}
          style={{width: 25, height: 25}}
          resizeMode="contain"
        />
      </BackgroundGradient>
    </TouchableOpacity>
  );
  return (
    <Container
      header={
        <Statusbar
          title={'Hồ sơ gia đình'}
          contentBarStyles={{justifyContent: 'center'}}
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
          <Text
            style={{
              fontSize: ConfigStyle.title1,
              color: Colors.black4,
              ...MainStyles.textBold,
              marginTop: 25,
            }}
          >
            Hồ sơ gia đình
          </Text>
        </View>
      }
      footer={footer}
    >
      <View style={{paddingHorizontal: 15}}>
        {!isBusy ? (
          familyData.data?.length ? (
            <FlatList
              style={styles.listItem}
              data={familyData.data}
              renderItem={renderItem}
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
};

export default ProfileScreen;
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
    marginBottom: 10,
  },
  listItem: {
    backgroundColor: Colors.whiteColor,
  },
  btnAdd: {
    position: 'absolute',
    bottom: 20,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    width: 50,
    right: 16,
  },
  viewWraper: {marginHorizontal: 17, marginTop: 50},
  viewcontainer: {
    marginTop: 15,
    flexDirection: 'row',
  },
  image: {
    height: 55,
    width: 55,
    borderRadius: 27,
    borderWidth: 0.8,
    borderColor: Colors.borderThin,
  },
  fullname: {fontSize: 20, color: '#333333'},
  relationship: {fontSize: 12, color: '#666666'},
  viewcontent: {
    flexDirection: 'column',
    marginHorizontal: 30,
    justifyContent: 'center',
  },
});
