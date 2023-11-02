import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import {Text} from 'react-native-elements';
import Styles from '../../theme/MainStyles';
import ItemClassRegistered from './ItemClassRegistered';
import ClassRoomHorizontal from '../Home/ClassRoomHorizontal';
import IconEmpty from '../../assets/images/svg/empty-list.svg';
import Colors from '../../theme/Colors';

const ClassRegistered = (props) => {
  return (
    <View style={styles.container}>
      <Text style={[Styles.textBold, styles.title]}>
        Danh sách lớp đã đăng ký
      </Text>
      {!props.isBusy ? (
        props.data?.length ? (
          <FlatList
            data={props.data}
            style={{flex: 1}}
            renderItem={({item, index}) => (
              <ItemClassRegistered data={item?.class || {}} />
            )}
            keyExtractor={(item) => item._id}
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
  );
};

export default ClassRegistered;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginBottom: 15,
  },
});
