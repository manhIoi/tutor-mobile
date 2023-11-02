import React from 'react';
import {View} from 'react-native';
import Add from './Add';
import SyncMessage from './Sync';

const HeaderSync = ({route}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
      }}
    >
      <SyncMessage />
      <Add route={route} />
    </View>
  );
};

export default HeaderSync;
