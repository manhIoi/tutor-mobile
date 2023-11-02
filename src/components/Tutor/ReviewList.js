import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Text} from 'react-native-elements';
import Styles from '../../theme/MainStyles';
import BoxShadow from '../common/BoxShadow';
import ImageUtils from '../../utils/images.util';
import Avatar from '../common/Avatar';
import RateStar from '../common/RateStar';
import ClassRoomHorizontal from '../Home/ClassRoomHorizontal';
import config from '../../../config/config';

const ReviewItem = (props) => {
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
  return (
    <BoxShadow style={styles.wrapItemReview}>
      <Avatar
        size={65}
        source={`${config.IMAGE_MD_URL}${props?.review?.user?.avatar?.medium}`}
      />
      <View style={styles.wrapContent}>
        <View>
          <Text numberOfLines={1}
style={[Styles.title4RS, Styles.textNormal]}>
            {props?.review?.user?.fullName}
          </Text>
          <Text style={Styles.textBlack3}>{props?.review?.review}</Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={{...Styles.textBlack3, marginTop: 5, marginBottom: 10}}>
            {formatDateCreated(props?.review?.createdAt) || null}
          </Text>
          <RateStar star={props?.review?.star}
size={8} />
        </View>
      </View>
    </BoxShadow>
  );
};

const ReviewList = (props) => {
  return (
    <View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={[
            Styles.title2RS,
            Styles.textNormal,
            {marginVertical: 10, marginTop: 20, marginLeft: 5},
          ]}
        >
          Nhận xét ({props.totalReview})
        </Text>
        {props.totalReview > 0 ? (
          <TouchableOpacity
            style={{justifyContent: 'center'}}
            onPress={() => {
              props?.navigation.navigate('Review', {
                _id: props?._id,
                title: props?.title,
              });
            }}
          >
            <Text
              style={[
                // Styles.title2RS,
                // Styles.textNormal,
                {fontSize: 10},
                {
                  marginVertical: 10,
                  marginTop: 20,
                  marginLeft: 5,
                  marginRight: 14,
                },
              ]}
            >
              Xem tất cả
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <SafeAreaView style={styles.wrapList}>
        <FlatList
          data={props.reviews}
          renderItem={({item}) => (
            <ReviewItem navigation={props?.navigation}
review={item} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaView>
    </View>
  );
};

export default ReviewList;

const styles = StyleSheet.create({
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
