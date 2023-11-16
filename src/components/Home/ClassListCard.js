import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import {Text} from 'react-native-elements';
import PropsTypes from 'prop-types';
import Styles from '../../theme/MainStyles';
import ClassRoomCard from './ClassroomCard';
import ClassRoomHorizontal from './ClassRoomHorizontal';
import ClassRoomPlaceholder from './ClassRoomPlaceholder';
import ClassHorizontalPlaceholder from './ClassHorizontalPlaceholder';
import IconEmpty from '../../assets/images/svg/empty-list.svg';
import ConfigStyle from '../../theme/ConfigStyle';

const ClassListCard = (props) => {
  const renderPlaceholder = (type) => {
    return [1, 2, 3, 4].map((item, index) => {
      return type === 'horizontal' ? (
        <ClassRoomPlaceholder key={index}
containerStyle={{paddingRight: 9}} />
      ) : (
        <ClassHorizontalPlaceholder
          key={index}
          containerStyle={{flex: 1, marginBottom: 10}}
        />
      );
    });
  };
  const renderList = (data, type) => {
    return data.map((item, index) => {
      if (type === 'horizontal') {
        return (
          <ClassRoomCard
            key={index}
            type={props.type}
            containerStyle={{paddingRight: 9}}
            navigation={props.navigation}
            classRequest={props.isRequest}
            isRequest={props.isRequest}
            onRefresh={props.onRefresh}
            data={item}
            distance={props?.distance}
            access={props?.access}
            isPayment={props?.isPayment}
            isHomepage={props?.isHomepage}
          />
        );
      }
        return (
          <ClassRoomHorizontal
            navigation={props.navigation}
            data={item}
            key={index}
            onRefresh={props.onRefresh}
            classRequest={props.isRequest}
            containerStyle={{flex: 1, marginBottom: 10}}
            isRequest={props?.isRequest}
            distance={props?.distance}
            access={props?.access}
            isHomepage={props?.isHomepage}
          />
        );
      
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.wrapTitle}>
        <Text style={Styles.title2RS}>{props.title}</Text>
        {props.viewMore && props.data?.length ? (
          <TouchableOpacity
            onPress={props.viewMoreAction ? props.viewMoreAction : null}
          >
            <Text style={styles.viewAll}>Xem tất cả</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View>
        <SafeAreaView
          style={[
            styles.wrapList,
            props.type === 'horizontal' ? styles.wrapListHorizontal : {},
          ]}
        >
          {props.isBusy ? (
            renderPlaceholder(props.type)
          ) : props.data?.length ? (
            renderList(props.data, props.type)
          ) : (
            <View style={styles.wrapEmptyImage}>
              <IconEmpty width={'50%'}
height={'50%'} />
              <Text style={Styles.textBlack3}>Không có dữ liệu</Text>
            </View>
          )}
        </SafeAreaView>
      </View>
    </View>
  );
};
ClassListCard.prototype = {
  title: PropsTypes.string,
  viewMore: PropsTypes.bool,
  viewMoreAction: PropsTypes.func,
  data: PropsTypes.array,
  type: PropsTypes.string, // enum: ['horizontal', 'vertical']
};
export default ClassListCard;
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginTop: 22,
  },
  wrapTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  wrapList: {
    marginTop: 20,
    flexDirection: 'column',
  },
  wrapListHorizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  viewAll: {
    fontSize: ConfigStyle.RF.text6,
    paddingVertical: 5,
    paddingHorizontal: 3,
  },
  wrapEmptyImage: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 220,
    paddingBottom: 15,
  },
  emptyImage: {
    width: 150,
    height: 150,
    borderWidth: 1,
  },
});
