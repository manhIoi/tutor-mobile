import * as React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import Container from '../../components/common/ContainerAnimated';
import Avatar from '../../components/Profile/Avatar';
import CardInfo from '../../components/Profile/CardInfo';
import ConfigStyle from '../../theme/ConfigStyle';
import Colors from '../../theme/Colors';
import MainStyles from '../../theme/MainStyles';
import {getprofile, updateAvatar} from '../../api/users';
import StatusBar from '../../components/common/StatusBar';
import EditIcon from '../../assets/images/svg/edit-button.svg';
import config from '../../../config/config';

const width = Dimensions.get('window').width;
const height = width * 0.7;
export default function UserProfileAccountScreen(props) {
  const {route} = props;
  const datePicker = props.params;
  const [isClicked, setIsClicked] = React.useState(false);
  const [user, setUser] = React.useState({});
  const [isScroll, setIsScroll] = React.useState(false);
  async function getUser() {
    try {
      const u = await getprofile();
      setUser(u);
    } catch (error) {
      console.log(error);
    }
  }
  React.useEffect(() => {
    getUser();
  }, []);
  function handleClick(val) {
    setIsClicked(!val);
  }
  const introduction = (
    <View style={styles.viewtext}>
      <Text style={styles.title}> Xin chào!! </Text>
      <Text style={{...styles.name, ...MainStyles.textBold}}>
        {user?.fullName}
      </Text>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.phoneNumber}>Số điện thoại: </Text>
        <Text
          style={{
            fontSize: ConfigStyle.customeTitle1,
            color: Colors.black4,
            ...MainStyles.textBold,
          }}
        >
          {user?.phone}
        </Text>
      </View>
    </View>
  );
  return (
    <Container
      scrollEnd={isScroll}
      title="Tài khoản"
      arrowBack={!isClicked}
      contentBarStyles={{justifyContent: 'space-between'}}
      navigation={props.navigation}
      headerHeight={ConfigStyle.statusBarHomeHeightTutor}
      hideBackground={false}
      keyboardShouldPersistTaps={true}
      textRight={
        !isClicked ? (
          <TouchableOpacity
            style={{}}
            onPress={() => {
              handleClick(isClicked);
              setIsScroll(true);
            }}
          >
            <EditIcon width={'23'}
height={'23'} />
          </TouchableOpacity>
        ) : (
          <View />
        )
      }
      textLeft={
        isClicked ? (
          <TouchableOpacity
            onPress={() => {
              handleClick(isClicked);
              setIsScroll(false);
            }}
          >
            <Text
              style={{fontSize: 16, color: '#ffffff', justifyContent: 'center'}}
            >
              Hủy
            </Text>
          </TouchableOpacity>
        ) : (
          <View />
        )
      }
    >
      <Avatar
        title={introduction}
        src={user?.avatar?.medium}
        srcLg={user?.avatar?.large}
        role={0}
      />

      <CardInfo
        profile={user}
        action={handleClick}
        isClicked={isClicked}
        datePicker={datePicker}
        navigation={props?.navigation}
      />
      <Image
        source={require('../../assets/images/bg-bottom-3.png')}
        resizeMode="cover"
        style={styles.backgroundBottom}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: ConfigStyle.title2,
    textAlign: 'center',
    color: Colors.black4,
  },
  title: {
    fontSize: ConfigStyle.customTitle2,
    color: Colors.black4,
    textAlign: 'center',
  },
  viewtext: {
    marginTop: 10,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  backgroundBottom: {
    position: 'absolute',
    width: width,
    height: height,
    bottom: 0,
  },
  container: {
    flex: 1,
  },
  marginContent: {
    marginBottom: 50,
  },
});
