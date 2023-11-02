import React from 'react';
import {Icon} from 'react-native-elements';
import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../../../constants/Colors';

const HeaderIconRight = ({onSubmit, icon}) => {
  return (
    <TouchableOpacity onPress={onSubmit}>
      <Icon name={icon}
type="ionicon"
color={Colors.whiteColor}
size={30} />
    </TouchableOpacity>
  );
};

HeaderIconRight.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
};

export default HeaderIconRight;
