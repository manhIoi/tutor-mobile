import React from 'react';
import {StyleSheet, View, Dimensions, Image} from 'react-native';
import {Text} from 'react-native-elements';

import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';
import imagesUtil from '../../utils/images.util';
import BtnIconText from '../../components/Tools/BtnIconText';
import BottomImgCustomize from '../../components/Tools/BottomImgCustomize';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const SplashScreen = (props) => {
  const {navigation} = props;
  return (
    <View style={styles.splashWrap}>
      <View style={styles.top}>
        <View>
          <Image source={imagesUtil.logo}
style={styles.logo} />
        </View>
      </View>
      <View style={styles.middle}>
        <View style={styles.wrapContent}>
          <Text style={styles.title2}>Bạn là ai?</Text>
          <BtnIconText
            title={'Học sinh'}
            imgWidth={32}
            imgHeight={20}
            fntSize={ConfigStyle.title3}
            imgSource={imagesUtil.icoStudent}
            handlePress={() =>
              navigation.navigate('Login', {
                type: 'student',
              })
            }
          />
          <BtnIconText
            title={'Giáo viên'}
            imgWidth={25}
            imgHeight={24}
            fntSize={ConfigStyle.title3}
            imgSource={imagesUtil.icoTeacher}
            handlePress={() =>
              navigation.navigate('Login', {
                type: 'teacher',
              })
            }
          />
          {/* <BtnIconText */}
          {/*  title={'University'} */}
          {/*  imgWidth={25} */}
          {/*  imgHeight={27} */}
          {/*  fntSize={ConfigStyle.title3} */}
          {/*  imgSource={imagesUtil.icoUniversity} */}
          {/*  handlePress={() => */}
          {/*    navigation.navigate('Login', { */}
          {/*      type: 'university', */}
          {/*    }) */}
          {/*  } */}
          {/* /> */}
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <BottomImgCustomize
            imgSource={imagesUtil.bgBottom}
            imgHeight={0.25 * height}
            title={'Sản phẩm của tập đoàn K group'}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginTop: 15,
    width: 0.4 * width,
    height: 0.6 * width,
  },
  splashWrap: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
  },
  title2: {
    fontSize: ConfigStyle.title2,
    fontWeight: ConfigStyle.bold,
  },
  top: {
    flex: 1.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middle: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 99,
  },
  wrapContent: {
    alignItems: 'center',
  },
});

export default SplashScreen;
