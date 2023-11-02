import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import {Text} from 'react-native-elements';
import Styles from '../../theme/MainStyles';
import ClassRoomHorizontal from '../Home/ClassRoomHorizontal';
import {getListClass} from '../../api/class';
import Colors from '../../theme/Colors';
import IconEmpty from '../../assets/images/svg/empty-list.svg';

const ClassFavorite = (props) => {
  return (
    <View style={styles.container}>
      <Text style={[Styles.textBold, styles.title]}>
        Danh sách lớp yêu thích
      </Text>
      {!props.isBusy ? (
        props.data?.length ? (
          <FlatList
            data={props.data}
            renderItem={({item, index}) => (
              <ClassRoomHorizontal
                data={item}
                containerStyle={{flex: 1, marginBottom: 10}}
              />
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

export default ClassFavorite;

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
