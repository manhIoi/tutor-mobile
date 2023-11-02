import React from 'react';
import {View, StyleSheet, StatusBar, FlatList} from 'react-native';
import {Text} from 'react-native-elements';
import Container from '../../components/common/Container';
import ImageSource from '../../utils/images.util';
import ConfigStyle from '../../theme/ConfigStyle';
import Colors from '../../theme/Colors';
import HeaderLeftBack from '../../components/HeaderLeftBack/HeaderLeftBack';
import Profile from '../../components/FeeManagement/Profile';
import Purchase from '../../components/FeeManagement/Purchase';
import ItemCourseTwo from '../../components/FeeManagement/ItemCourseTwo';
import ImageUtils from '../../utils/images.util';
import Statusbar from '../../components/common/StatusBar';

export default function FeeManagement(props) {
  return (
    <Container
      imageSource={ImageUtils.bgNotDot}
      header={
        <Statusbar
          title={'Toán cao cấp'}
          contentBarStyles={{justifyContent: 'center'}}
          arrowBack={true}
          navigation={props.navigation}
          contentBarStyles={{justifyContent: 'space-between'}}
          headerHeight={ConfigStyle.statusBarHeight}
        />
      }
      headerHeight={ConfigStyle.statusBarHeight}
      hideBackground={false}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.screenContainer}>
        <Profile
          total="(42)"
          status="Offline"
          date="12 th 1,2020"
          address="38 Lê Thị Riêng, quận 1, Tp. Hồ Chí Minh"
          time="18h00"
          personname="Morich Chan"
        />
        <View style={styles.contentContainer}>
          <Text style={styles.textView}>Thông tin</Text>
          <Text style={styles.informationView}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
            porttitor, sem ac posuere ullamcorper, tortor dolor tempus augue,
            non suscipit justo risus eu lorem. Aenean quam nisi, aliquam a leo
            sagittis, dapibus pharetra nisl. Integer sit amet bibendum metus.
            Pellentesque efficitur ultricies gravida. Suspendisse neque lorem,
            rutrum vel fringilla et, rhoncus sed
          </Text>
        </View>
        <FlatList
          data={[1]}
          renderItem={({item, index}) => <ItemCourseTwo data={item} />}
          keyExtractor={(item) => item.toString}
        />
        <Purchase fee="1.000.000"
addfee="0"
totalFee="1.000.000" />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  contentContainer: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  textView: {
    color: Colors.black4,
    fontSize: ConfigStyle.font20,
  },
  informationView: {
    color: Colors.black3,
    fontSize: ConfigStyle.font12,
  },
});
