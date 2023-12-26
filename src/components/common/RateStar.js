import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import PropsTypes from 'prop-types';
import Star from '../../assets/images/svg/star.svg';
import StarGrey from '../../assets/images/svg/star-grey.svg';
import Colors from "../../theme/Colors";

const RateStar = (props) => {
  const { activeValue = 0, numberOfVotes = 0 } = props || {}
  return (
    <View style={styles.containerRate}>
      {[1,2,3,4,5].map((item, index) => {
        const Element = item <= activeValue  ? Star : StarGrey
        return (
            <Element width={props.size || 10} height={props.size || 10} />
        );
      })}
      {numberOfVotes > 0 ? <Text style={{ color: Colors.greyText, fontSize: 12, marginLeft: 4, }} >({numberOfVotes})</Text> : null}
    </View>
  );
};

RateStar.prototype = {
  size: PropsTypes.number,
  star: PropsTypes.number,
};
export default RateStar;

const styles = StyleSheet.create({
  containerRate: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center'
  },
  imageStar: {
    marginHorizontal: 0.5,
    width: 10,
    height: 10,
  },
});
