import * as React from 'react';
import {StyleSheet, View, Image, Dimensions, ScrollView} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import Container from '../../components/common/ContainerAnimated';
import AvartarLeft from '../../components/Profile/AvatarLeft';
import CardProfile from '../../components/Profile/CardProfileButton';
import ConfigStyle from '../../theme/ConfigStyle';
import StatusBar from '../../components/common/StatusBar';
import {getprofile} from '../../api/users';
import {selectIsRefresh, updateRefresh} from '../../lib/slices/familySlice';
import {getBalance} from '../../api/payment';
import {updateBalance} from '../../lib/slices/authSlice';

const width = Dimensions.get('window').width;
const height = width * 0.4;
export default function ProfileScreen(props) {
  const isFocused = useIsFocused();
  // const isRefresh = useSelector(selectIsRefresh);
  const notification = useSelector((state) => state?.notification?.notiUpdate);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [userProfile, setUserProfile] = React.useState({});
  const [sourceImage, setSourceImage] = React.useState('');
  async function getProfile() {
    try {
      dispatch(updateRefresh());
      const profile = await getprofile();
      setSourceImage(profile?.avatar);
      setUserProfile(profile);
      if (profile?.access === 'teacher') {
        await teacherGetBalance();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function teacherGetBalance() {
    try {
      const response = await getBalance();
      dispatch(updateBalance(response.balance));
    } catch (error) {
      console.log('teacherGetBalance ==>', error);
    }
  }

  React.useEffect(() => {
    setUserProfile(user);
  }, []);
  React.useEffect(() => {
    getProfile();
    if (user?.access === 'teacher') {
      teacherGetBalance();
    }
  }, [isFocused]);
  return (
        <Container
            // header={
            //   <StatusBar
            //     contentBarStyles={{justifyContent: 'center'}}
            //     navigation={props.navigation}
            //     headerHeight={ConfigStyle.statusBarHeight}
            //     hideBackground={false}
            //     title="Hồ sơ cá nhân"
            //   />
            // }
            // headerHeight={ConfigStyle.statusBarHeight}
            title="Hồ sơ cá nhân"
            arrowBack={false}
            contentBarStyles={{justifyContent: 'center'}}
            navigation={props.navigation}
            headerHeight={ConfigStyle.statusBarHomeHeightTutor}
            hideBackground={false}
        >
          <View style={{flex: 1}}>
            <AvartarLeft
                fullName={userProfile?.fullName}
                src={sourceImage}
                phone={userProfile?.phone}
                srcLg={userProfile?.avatar}
            />
            <CardProfile {...props} notification={notification} />
          </View>
        </Container>
  );
}

const styles = StyleSheet.create({
  backgroundBottom: {
    position: 'absolute',
    width: width,
    height: height,
    bottom: 0,
    zIndex: 1,
  },
  container: {
    position: 'relative',
  },
  marginContent: {
    marginBottom: 50,
  },
});
