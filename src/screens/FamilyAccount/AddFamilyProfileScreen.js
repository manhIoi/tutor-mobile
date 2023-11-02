import * as React from 'react';
import {StyleSheet, View, Image, Dimensions, ScrollView} from 'react-native';
import Container from '../../components/common/ContainerAnimated';
import Avatar from '../../components/Profile/Avatar';
import Header from '../../components/Profile/Header';
import CardProfile from '../../components/Profile/CardProfile';
import ConfigStyle from '../../theme/ConfigStyle';
import StatusBar from '../../components/common/StatusBar';
import config from '../../../config/config';

const width = Dimensions.get('window').width;
const height = width * 0.7;
const imgDefault = {
  name: '5f718f9d3abc89001945b625_default_1602236703381.png',
  large: '5f718f9d3abc89001945b625_default_1602236703381.png',
  medium: '180x180_5f718f9d3abc89001945b625_default_1602236703381.png',
  small: '90x90_5f718f9d3abc89001945b625_default_1602236703381.png',
};
export default function AddProfileScreen(props) {
  const [image, setImage] = React.useState(imgDefault);
  function handleChangeAvatar(image) {
    setImage(image);
  }
  return (
    <Container
      contentBarStyles={{justifyContent: 'space-between'}}
      navigation={props.navigation}
      hideBackground={false}
      arrowBack={true}
      title="Thêm tài khoản"
      headerHeight={ConfigStyle.statusBarHeight}
      keyboardShouldPersistTaps={true}
    >
      <Avatar
        src={config.IMAGE_MD_URL + image?.medium}
        action={handleChangeAvatar}
        srcLg={
          config.IMAGE_LG_URL + (image?.avatar?.large || imgDefault?.large)
        }
        role={2}
      />
      <CardProfile {...props}
image={image} />
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
});
