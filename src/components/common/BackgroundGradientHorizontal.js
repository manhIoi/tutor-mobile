import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const BackgroundGradient = (props) => {
  return (
    <LinearGradient
      style={{...props.style}}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={['#FFB02C', '#FFA52C', '#FF992C', '#FF8B2C', '#FF802C']}
    >
      {props.children}
    </LinearGradient>
  );
};
export default BackgroundGradient;
