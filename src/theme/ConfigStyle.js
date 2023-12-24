import {Dimensions, Platform, StatusBar} from 'react-native';
import {getStatusBarHeight} from '../utils/ScaleAdaptor';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const unit = width / 400;
export default {
  // Size unit
  rem1: unit,
  rem2: 2 * unit,
  rem4: 4 * unit,
  rem5: 5 * unit,
  rem6: 6 * unit,
  rem7: 7 * unit,
  rem8: 8 * unit,
  rem9: 9 * unit,
  rem10: 10 * unit,
  rem11: 11 * unit,
  rem12: 12 * unit,
  rem13: 13 * unit,
  rem14: 14 * unit,
  rem15: 15 * unit,
  rem16: 16 * unit,
  rem17: 17 * unit,
  rem18: 18 * unit,
  rem19: 19 * unit,
  rem20: 20 * unit,
  rem21: 21 * unit,
  rem22: 22 * unit,
  rem23: 23 * unit,
  rem24: 24 * unit,
  rem25: 25 * unit,
  rem26: 26 * unit,
  rem27: 27 * unit,
  rem28: 28 * unit,
  rem29: 29 * unit,
  rem30: 30 * unit,
  rem31: 31 * unit,
  rem32: 32 * unit,
  rem33: 33 * unit,
  rem34: 34 * unit,
  rem35: 35 * unit,
  rem36: 36 * unit,
  rem37: 37 * unit,
  rem38: 38 * unit,
  rem39: 9 * unit,
  rem40: 40 * unit,
  // Font style
  title1: 25,
  title2: 20,
  title3: 15,
  title4: 12,
  font10: 10,
  font12: 12,
  font14: 14,
  font15: 15,
  font16: 16,
  font20: 20,
  font25: 25,
  font30: 30,
  smallDeviceWidth: 330,
  bold: 'bold',
  uppercase: 'uppercase',
  // Button style
  btnPaddingHorizontal: 20,
  btnMarginHorizontal: 20,
  footerBtnMarginText: 29,
  footerMarginBottom: 28,
  RF: {
    title1: width < 330 ? 0.8 * 25 : 25,
    title2: width < 330 ? 0.8 * 20 : 20,
    title3: width < 330 ? 0.8 * 18 : 18,
    title4: width < 330 ? 0.8 * 15 : 15,
    title5: width < 330 ? 0.8 * 12 : 12,
    text6: width < 330 ? 0.8 * 10 : 10,
    text7: width < 330 ? 0.8 * 13 : 13,
    font14: width < 330 ? 0.8 * 14 : 14,
  },
  // Title
  titleMBSubTitle: 23,
  customeTitle1: 16,
  customTitle2: 14,
  backdropOpacity: 0.52,
  statusBarHeight: Platform.select({
    ios: 90,
    android: 70,
  }),
  statusBarIb: 90,
  statusBarHomeHeight: 102,
  statusBarHomeHeightTutor: 80,
  statusBarHeight1: 95,
  statusBarHeightList: 90,
  minStatusBar: 40,
  inputToolBarHeight: 46,
  toastDefault: {
    text1: '',
    type: 'success',
    position: 'top',
    visibilityTime: 2000,
    autoHide: true,
    topOffset:
      Platform.OS === 'android'
        ? StatusBar.currentHeight
        : getStatusBarHeight(true),
    bottomOffset: 40,
  },
};
