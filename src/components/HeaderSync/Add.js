import React from 'react';
import {Icon} from 'react-native-elements';

import {useNavigation} from '@react-navigation/native';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';
import Colors from '../../../constants/Colors';

const Add = ({route}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate(route)}>
      <Icon
        name="md-add-circle-outline"
        type="ionicon"
        color={Colors.whiteColor}
        size={30}
      />
    </TouchableOpacity>
  );
};

Add.propTypes = {
  route: PropTypes.string.isRequired,
};

export default Add;
