import React from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  ShineOverlay,
} from 'rn-placeholder';
import BoxShadow from '../common/BoxShadow';
import Colors from '../../theme/Colors';

const ClassRoomCard = (props) => {
  return (
    <View style={{width: '50%'}}>
      <BoxShadow style={styles.wrapper}>
        <Placeholder
          style={{
            width: '100%',
          }}
          Animation={ShineOverlay}
        >
          <PlaceholderMedia
            style={{
              width: '100%',
              height: 110,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              backgroundColor: '#e2e1e1',
            }}
          />
          <View style={styles.boxInfo}>
            <View style={styles.wrapTitle}>
              <PlaceholderLine
                style={{
                  marginTop: 2,
                  width: '30%',
                  height: 10,
                  marginBottom: 2,
                  backgroundColor: '#e2e1e1',
                }}
              />
              <PlaceholderLine
                style={{
                  marginTop: 2,
                  width: '20%',
                  height: 10,
                  marginBottom: 2,
                  backgroundColor: '#eeecec',
                }}
              />
            </View>
            <View style={styles.wrapTitle}>
              <PlaceholderLine
                style={{
                  marginTop: 3,
                  width: '80%',
                  height: 15,
                  marginBottom: 2,
                  backgroundColor: '#e2e1e1',
                }}
              />
            </View>
            <View style={styles.wrapRating}>
              <PlaceholderLine
                style={{
                  marginBottom: 2,
                  width: '55%',
                  height: 12,
                  backgroundColor: Colors.grey2,
                }}
              />
            </View>

            <View>
              <PlaceholderLine
                style={{
                  marginTop: 2,
                  width: '45%',
                  height: 14,
                  marginBottom: 2,
                  backgroundColor: Colors.grey2,
                }}
              />
            </View>
            <View>
              <PlaceholderLine
                style={{
                  marginTop: 2,
                  width: '45%',
                  height: 14,
                  marginBottom: 2,
                  backgroundColor: Colors.grey2,
                }}
              />
            </View>
            <View style={styles.wrapStartTime}>
              <PlaceholderLine
                style={{
                  marginTop: 3,
                  width: '60%',
                  height: 10,
                  marginBottom: 2,
                  backgroundColor: '#e2e1e1',
                }}
              />
            </View>
            <View style={styles.wrapStartTime}>
              <PlaceholderLine
                style={{
                  marginTop: 3,
                  width: '50%',
                  height: 10,
                  marginBottom: 2,
                  backgroundColor: '#e2e1e1',
                }}
              />
            </View>
            <View>
              <PlaceholderLine
                style={{
                  borderRadius: 25,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 8,
                  height: 20,
                  marginBottom: 0,
                }}
              />
            </View>
          </View>
        </Placeholder>
      </BoxShadow>
    </View>
  );
};
ClassRoomCard.prototype = {
  user: PropTypes.object,
};
export default ClassRoomCard;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginBottom: 15,
    // marginRight: 15,
  },
  wrapTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boxInfo: {
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 6,
  },
  wrapRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  wrapStartTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
});
