import React from 'react';
import PropTypes from 'prop-types';
import {Header} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

const HeaderCustom = ({
  title,
  rightComponent,
  isLeftBack,
  isRightComponent,
}) => {
  const navigation = useNavigation();
  return (
    <Header
      backgroundColor="#259dba"
      leftComponent={
        isLeftBack
          ? {
              icon: 'arrow-back',
              color: '#fff',
              onPress: () => {
                navigation.goBack();
              },
            }
          : {
              icon: 'menu',
              color: '#fff',
              onPress: () => {
                navigation.openDrawer();
              },
            }
      }
      centerComponent={{
        text: title || 'none',
        style: {color: '#fff', fontSize: 18},
      }}
      rightComponent={
        isRightComponent
          ? rightComponent || {icon: 'notifications', color: '#fff'}
          : null
      }
    />
  );
};

HeaderCustom.defaultProps = {
  isRightComponent: true,
};

HeaderCustom.propTypes = {
  title: PropTypes.string,
  isLeftBack: PropTypes.bool,
  isRightComponent: PropTypes.bool,
};

export default HeaderCustom;
