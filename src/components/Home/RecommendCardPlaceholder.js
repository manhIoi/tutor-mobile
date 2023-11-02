import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Text} from 'react-native-elements';
import PropTypes from 'prop-types';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  ShineOverlay,
} from 'rn-placeholder';
import BoxShadow from '../common/BoxShadow';
import Styles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';

const width = Dimensions.get('window').width;

const RecommendCard = (props) => {
  return (
    <View>
      <BoxShadow style={styles.wrapper}>
        <Placeholder width={0.4 * width}
Animation={ShineOverlay}>
          <PlaceholderMedia
            style={{
              width: '100%',
              height: 110,
            }}
          />
          <View style={styles.boxInfo}>
            <View style={styles.wrapTitle}>
              <PlaceholderLine
                style={{
                  marginTop: 4,
                  width: '80%',
                  height: 15,
                  marginBottom: 2,
                  backgroundColor: '#e2e1e1',
                }}
              />
            </View>
            <PlaceholderLine
              style={{
                marginBottom: 2,
                width: '45%',
                height: 10,
                backgroundColor: Colors.grey2,
              }}
            />
            <View>
              <PlaceholderLine
                style={{
                  marginBottom: 1,
                  width: '100%',
                  height: 12,
                  backgroundColor: Colors.grey2,
                }}
              />
            </View>
            <View>
              <PlaceholderLine
                style={{
                  marginBottom: 0,
                  width: '100%',
                  marginTop: 2,
                  height: 12,
                  backgroundColor: Colors.grey2,
                }}
              />
            </View>
            <View>
              <View style={styles.wrapBtn}>
                <Text style={[Styles.textWhite, styles.textBtn]}>BOOK</Text>
              </View>
            </View>
          </View>
        </Placeholder>
      </BoxShadow>
    </View>
  );
};
RecommendCard.prototype = {
  user: PropTypes.object,
};
export default RecommendCard;

const styles = StyleSheet.create({
  wrapper: {
    width: 0.4 * width,
    overflow: 'hidden',
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
  wrapBtn: {
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    height: 20,
    backgroundColor: Colors.grey2,
  },
  textBtn: {
    fontSize: 11,
    color: Colors.grey2,
  },
});
