import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Text} from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ConfigStyle from '../../theme/ConfigStyle';
import Colors from '../../theme/Colors';
import RateStar from "../common/RateStar";

export default function Profile({
  total,
  status,
  date,
  address,
  time,
  personname,
}) {
  return (
    <View>
      <View style={styles.bodyContainer}>
        <View style={styles.profileContainer}>
          <Image
            source={require('../../assets/images/image-profile1.png')}
            style={styles.imgProfile}
          />
        </View>
        <View style={styles.detailContainer}>
          <View style={styles.rateStar}>
            <RateStar star={5}
size={10} />
            <Text style={styles.textTotalRate}>{total}</Text>
          </View>
          <View style={styles.status}>
            <FontAwesome name="circle"
size={6} />
            <Text style={styles.textStatus}>{status}</Text>
          </View>
          <Text style={styles.textTime}>Bắt đầu: {date}</Text>
        </View>
        <View style={styles.gestures}>
          <Image
            source={require('../../assets/images/share.png')}
            style={styles.shareOutline}
          />
          <Image
            source={require('../../assets/images/heart-empty.png')}
            style={styles.heartOutline}
          />
        </View>
      </View>
      <View style={styles.contactContainer}>
        <View style={styles.address}>
          <Image
            source={require('../../assets/images/iconLocation.png')}
            style={styles.iconLocation}
          />
          <Text style={styles.textAddress}>{address}</Text>
        </View>
        <View style={styles.timeView}>
          <Image
            source={require('../../assets/images/iconLocation.png')}
            style={styles.iconLocation}
          />
          <Text style={styles.textAddress}>{time}</Text>
        </View>
        <View style={styles.address}>
          <Image
            source={require('../../assets/images/iconLocation.png')}
            style={styles.iconLocation}
          />
          <Text style={styles.textAddress}>Teacher: {personname}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bodyContainer: {
    paddingHorizontal: 17,
    flexDirection: 'row',
    marginTop: 22,
  },
  profileContainer: {
    shadowColor: '#C0C0C0',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 2,
    width: 100,
    height: 100,
  },
  imgProfile: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    borderWidth: 5,
    resizeMode: 'cover',
    borderColor: '#FFF',
  },
  detailContainer: {
    marginLeft: 21,
    justifyContent: 'flex-end',
  },
  rateStar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  textTotalRate: {
    color: Colors.black4,
    fontSize: ConfigStyle.title4,
  },
  textStatus: {
    color: Colors.black3,
    fontSize: ConfigStyle.title4,
    paddingHorizontal: 2,
  },
  textTime: {
    color: Colors.black4,
    fontSize: ConfigStyle.font14,
    marginTop: 3,
  },
  gestures: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    position: 'absolute',
    right: 17,
  },
  shareOutline: {width: 23, height: 18, marginRight: 10},
  heartOutline: {width: 20, height: 20},
  contactContainer: {paddingHorizontal: 14, marginTop: 20},
  address: {
    flexDirection: 'row',
  },
  iconLocation: {
    width: 16,
    height: 16,
  },
  textAddress: {
    fontSize: ConfigStyle.font14,
    color: Colors.black4,
    marginLeft: 17,
  },
  timeView: {
    flexDirection: 'row',
    marginVertical: 10,
  },
});
