import React from 'react';
import {Icon} from 'react-native-elements';
import {TouchableOpacity} from 'react-native';
import Colors from '../../../constants/Colors';

const SyncMessage = () => {
  return (
    <TouchableOpacity onPress={() => console.log('hello')}>
      <Icon
        iconStyle={{marginRight: 20}}
        name="md-sync"
        type="ionicon"
        color={Colors.whiteColor}
        size={30}
      />
    </TouchableOpacity>
  );
};

export default SyncMessage;
