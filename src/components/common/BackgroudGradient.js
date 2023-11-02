import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const BackgroundGradient = (props) => {
  return (
    <LinearGradient
      style={{...props.style}}
      colors={['#FF802C', '#FF8B2C', '#ff992c', '#FFA52C', '#FFB02C']}
    >
      {props.children}
    </LinearGradient>
  );
};
export default BackgroundGradient;
