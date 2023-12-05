import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {Text} from 'react-native-elements';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import Container from '../../components/common/ContainerRenderList';
import Statusbar from '../../components/common/StatusBar';
import ConfigStyle from '../../theme/ConfigStyle';
import {
  getListClass,
  studentGetRegisteredClass,
  getFavoriteClass, getAvailableClasses, getRequestByTeacherId, getRequestById,
} from '../../api/class';
import Styles from '../../theme/MainStyles';
import Constants from '../../../constants/Values';
import ClassRoomHorizontal from '../../components/Home/ClassRoomHorizontal';
import IconEmpty from '../../assets/images/svg/empty-list.svg';
import Colors from '../../theme/Colors';
import ItemClassRegistered from '../../components/ManageRegistry/ItemClassRegistered';
import {useSelector} from "react-redux";
import TutorRequestItem from "../../components/RequestManagement/TutorRequestItem";

const INIT_VALUE = {
  data: [],
  currentPage: 1,
  totalItems: 0,
  limit: 10,
};
const ManageRegistry = (props) => {

  const user = useSelector(state => state.auth.user);
  const [classes, setClasses] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = user?.role === 'teacher' ?  await getRequestByTeacherId(user._id) : await getRequestById();
      setClasses(response)
    } catch (e) {
      console.info(`🔥LOGGER:: getData`, e);
    }
  }

  async function onRefresh(showLoading = true) {
    getData();
  }

  const renderItem = ({item}) => {
    return <TutorRequestItem data={item} onPress={() => {
      props.navigation.navigate('Calendar', {
        screen: 'DetailRequest',
        params: {
          tutorRequest: item,
        }
      })
    }} />;
  }

  return (
    <Container
      header={
        <Statusbar
          title={'Quản lý đăng ký'}
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
          <Text style={[Styles.textBold, styles.title]}>
            {/* {tab === 0 ? 'Danh sách lớp đã đăng ký' : 'Danh sách lớp yêu thích'} */}
          </Text>
        </View>
      }
    >
      <FlatList data={classes} renderItem={renderItem} keyExtractor={(item) => item?._id} />
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
});
