import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  StatusBar,
  Platform,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import PropsTypes from 'prop-types';
import {Text} from 'react-native-elements';
import InputSearch from '../common/InputSearch';
import Styles from '../../theme/MainStyles';
import ClassRoomHorizontal from '../Home/ClassRoomHorizontal';
import ConfigStyle from '../../theme/ConfigStyle';
import {getStatusBarHeight} from '../../utils/ScaleAdaptor';
import {getListClass, searchRequestList} from '../../api/class';
import Colors from '../../theme/Colors';
import Constants from '../../../constants/Values';
import IconClose from '../../assets/images/svg/close.svg';

const INIT_VALUE = {
  data: [],
  currentPage: 1,
  totalItems: 0,
  limit: 10,
};

const ModalSearch = (props) => {
  const [classes, setClasses] = useState(INIT_VALUE);
  const [isBusy, setBusy] = useState(false);
  const [refreshing, setRefresh] = useState(false);
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const [searchText, setSearchText] = useState(props?.textSearch);
  useEffect(() => {
    if (Platform.OS === 'android') {
      // setStatusBarHeight(StatusBar.currentHeight);
    } else {
      setStatusBarHeight(getStatusBarHeight(true));
    }
    StatusBar.setBackgroundColor('rgba(0,0,0,0.5)');
    return () => {
      StatusBar.setBackgroundColor('rgba(255,0,0,0)');
    };
  }, []);
  useEffect(() => {
    setSearchText(props?.textSearch);
    getClasses(1, Constants.LIMIT, props?.textSearch);
  }, [props?.textSearch]);
  // useEffect(() => {
  //   getClasses();
  // }, []);
  async function getClasses(
    page = 1,
    limit = Constants.LIMIT,
    text = '',
    loadMore = false,
    refresh = false,
  ) {
    try {
      if (!loadMore && !refresh) setBusy(true);
      const response = await searchRequestList(page, limit, text);
      if (loadMore) {
        if (response?.payload) {
          setClasses({
            data: [...classes.data, ...response?.payload],
            currentPage: response?.page,
            totalItems: response.total_item,
          });
        }
      } else {
        if (response?.payload) {
          setClasses({
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
  function onRefresh(showLoading = true) {
    if (showLoading) {
      setRefresh(true);
    }
    getClasses(1, Constants.LIMIT, searchText, false, true);
  }
  function handleLoadMore() {
    if (classes.currentPage * Constants.LIMIT < classes.totalItems) {
      getClasses(
        classes.currentPage + 1,
        Constants.LIMIT,
        searchText,
        true,
        false,
      );
    }
  }

  return (
    <Modal
      isVisible={props.show}
      onBackdropPress={props.hideModalSearch}
      backdropOpacity={ConfigStyle.backdropOpacity}
      style={styles.modal}
    >
      <View style={{...styles.container, marginTop: statusBarHeight}}>
        <View style={styles.searchBar}>
          <View style={styles.controlGroup}>
            <InputSearch
              onSearch={props.onSearch}
              textSearch={props.textSearch}
              autoFocus={true}
            />
          </View>
          <TouchableOpacity
            style={styles.iconClose}
            onPress={props.hideModalSearch}
          >
            <IconClose width={20}
height={20} />
          </TouchableOpacity>
        </View>
        {!isBusy ? (
          <FlatList
            style={styles.results}
            keyboardShouldPersistTaps="handled"
            data={classes.data}
            keyExtractor={(item) => item._id}
            renderItem={({item}) => (
              <ClassRoomHorizontal
                data={item}
                navigation={props.navigation}
                containerStyle={{flex: 1, marginBottom: 10}}
                hideModalSearch={props.hideModalSearch}
                isRequest={item?.isRequest}
                access={'teacher'}
                onRefresh={onRefresh}
                classRequest={true}
              />
            )}
            onEndReachedThreshold={0.2}
            onEndReached={() => {
              handleLoadMore();
            }}
            ListHeaderComponent={<View style={Styles.paddingTop} />}
            ListFooterComponent={() =>
              classes.data?.length >= classes.totalItems ? (
                <Text style={styles.countResult}>
                  {classes.totalItems} kết quả
                </Text>
              ) : (
                <ActivityIndicator color={Colors.whiteColor} />
              )
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.orange]}
              />
            }
          />
        ) : (
          <View style={{marginTop: 25}}>
            <ActivityIndicator color={Colors.whiteColor} />
          </View>
        )}
      </View>
    </Modal>
  );
};

ModalSearch.prototype = {
  show: PropsTypes.bool.isRequired,
  hideModalSearch: PropsTypes.func,
};
export default ModalSearch;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#fff',
  },
  modal: {
    justifyContent: 'flex-start',
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  controlGroup: {
    width: '86%',
  },
  results: {
    marginTop: 15,
    marginBottom: 50,
  },
  countResult: {
    textAlign: 'center',
    color: Colors.whiteColor,
    fontSize: 13,
    fontStyle: 'italic',
  },
  iconClose: {
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
});
