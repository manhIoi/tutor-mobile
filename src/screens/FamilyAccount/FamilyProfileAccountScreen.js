import * as React from 'react';
import {StyleSheet, View, Image, Dimensions} from 'react-native';
import {Text} from 'react-native-elements';
import Container from '../../components/common/Container';
import Avatar from '../../components/Profile/Avatar';
import Header from '../../components/Profile/Header';
import CardUpdate from '../../components/Profile/CardUpdate';
import ConfigStyle from '../../theme/ConfigStyle';
import Colors from '../../theme/Colors';
import MainStyles from '../../theme/MainStyles';
import StatusBar from '../../components/common/StatusBar';
import {getFamilyProfileId} from '../../api/familyProfile';
import config from '../../../config/config';

const width = Dimensions.get('window').width;
const height = width * 0.7;
export default function FamilyAccountScreen(props) {
  const {navigation, route} = props;
  const {params} = route;
  const [avatar, setAvatar] = React.useState({});
  const [familyProfile, setFamilyProfile] = React.useState({});
  async function getProfileById() {
    try {
      const dataProfile = await getFamilyProfileId(params?.item?._id);
      setAvatar(dataProfile?.avatar);
      setFamilyProfile(dataProfile);
    } catch (error) {
      console.log(error);
    }
  }
  function handleChangeAvatar(image) {
    setAvatar(image);
  }
  React.useEffect(() => {
    getProfileById();
  }, []);
  const introduction = (
    <View style={styles.viewtext}>
      <Text style={styles.title}> Xin chào!! </Text>
      <Text style={{...styles.name, ...MainStyles.textBold}}>
        {params.item.fullName}
      </Text>
    </View>
  );
  return (
    <Container
      header={
        <StatusBar
          contentBarStyles={{justifyContent: 'space-between'}}
          navigation={props.navigation}
          headerHeight={ConfigStyle.statusBarHeight}
          hideBackground={false}
          arrowBack={true}
          title="Tài khoản"
        />
      }
      keyboardShouldPersistTaps={true}
      headerHeight={ConfigStyle.statusBarHeight}
    >
      <Avatar
        title={introduction}
        src={`${config.IMAGE_MD_URL}${params?.item?.avatar?.medium}`}
        data={params}
        role={2}
        action={handleChangeAvatar}
        srcLg={params?.item?.avatar}
      />
      <CardUpdate
        {...props}
        data={params}
        image={avatar}
        user={familyProfile}
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
  name: {
    fontSize: ConfigStyle.title2,
    textAlign: 'center',
    color: Colors.black4,
  },
});
