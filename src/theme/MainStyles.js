import {Dimensions, Platform} from 'react-native';
import Colors from './Colors';
import ConfigStyle from './ConfigStyle';
import {imageFormat} from '../components/Tools/imageFormat';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
    // backgroundColor: 'red'
  },
  input: {
    height: 43,
    borderBottomWidth: 1,
    borderBottomColor: Colors.inputBorder,
  },
  wrapperGlobal: {
    flex: 1,
    position: 'relative',
  },
  btnGuest: {
    height: 50,
    paddingHorizontal: ConfigStyle.btnPaddingHorizontal,
    color: Colors.orange,
    borderColor: Colors.orange,
    borderRadius: 50,
    marginVertical: ConfigStyle.footerBtnMarginText,
  },
  btnGuestTitleStyle: {
    color: Colors.orange,
    fontSize: ConfigStyle.title4,
    fontWeight: ConfigStyle.bold,
    marginRight: 12,
    textTransform: ConfigStyle.uppercase,
  },
  btnGuestIcon: {
    color: Colors.orange,
  },
  btnLogin: {
    height: 50,
    paddingHorizontal: ConfigStyle.btnPaddingHorizontal,
    color: Colors.btnLogin,
    borderColor: Colors.btnLogin,
    borderWidth: 0,
    borderRadius: 40,
  },
  btnLoginTitleStyle: {
    color: Colors.btnLogin,
    fontSize: ConfigStyle.title4,
    fontWeight: ConfigStyle.bold,
    marginRight: 12,
    textTransform: ConfigStyle.uppercase,
  },
  btnLoginIcon: {
    color: Colors.btnLogin,
  },
  marginHeaderBG: {
    marginTop: imageFormat(width, 1125, 557).height,
  },
  title1: {
    fontSize: ConfigStyle.RF.title1,
    fontWeight: 'bold',
    marginBottom: height < 550 ? 20 : 44,
  },
  title2: {
    fontSize: ConfigStyle.title2,
  },
  textBold: {
    fontFamily: Platform.OS === 'android' ? 'Segoe-UI-Semibold' : null,
  },
  title4: {
    fontSize: ConfigStyle.title4,
  },
  title1RS: {
    fontSize: ConfigStyle.RF.title1,
    fontFamily: Platform.OS === 'android' ? 'Segoe-UI-Semibold' : null,
  },
  title2RS: {
    fontSize: ConfigStyle.RF.title2,
    fontFamily: Platform.OS === 'android' ? 'Segoe-UI-Semibold' : null,
  },
  title3RS: {
    fontSize: ConfigStyle.RF.title3,
    fontFamily: Platform.OS === 'android' ? 'Segoe-UI-Semibold' : null,
  },
  title4RS: {
    fontSize: ConfigStyle.RF.title4,
  },
  title5RS: {
    fontSize: ConfigStyle.RF.title5,
  },
  text6RS: {
    fontSize: ConfigStyle.RF.text6,
  },
  textGrey: {
    color: '#666666',
  },
  textGrey2: {
    color: Colors.greyText,
  },
  textGreen: {
    color: Colors.greenBold,
  },
  textWhite: {
    color: Colors.whiteColor,
  },
  textBlack3: {
    color: Colors.black3,
  },
  colorTextNormal: {
    color: Colors.black4,
  },
  textOrange: {
    color: Colors.orange,
  },
  textError: {
    color: Colors.red,
  },
  textLight: {
    fontFamily: Platform.OS === 'android' ? 'Segoe-UI-Semilight' : null,
  },
  textNormal: {
    fontFamily: Platform.OS === 'android' ? 'Segoe-UI' : null,
  },
  flexRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexRowCenterVertical: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexRowSB: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrapBtn: {
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    height: 20,
  },
  textBlue: {
    color: Colors.blue,
  },
  titleMBSubTitle: {
    marginBottom: ConfigStyle.titleMBSubTitle,
  },
  sheetActionText1: {
    color: '#2d4ed0',
    fontSize: 17,
  },
  sheetActionText2: {
    color: '#69696a',
    fontWeight: 'bold',
    fontSize: 15,
  },
  titleActionSheet: {
    fontSize: 18,
    color: Colors.greyBold,
    marginBottom: 5,
    marginTop: 5,
  },
  marginVertical2: {
    marginVertical: 2,
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
  countResult: {
    textAlign: 'center',
    color: Colors.black3,
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 10,
  },
};
