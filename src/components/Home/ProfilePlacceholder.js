import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  ShineOverlay,
} from 'rn-placeholder';
import BoxShadow from '../common/BoxShadow';
import Styles from '../../theme/MainStyles';
import Colors from '../../theme/Colors';

const ProfileHorizontal = (props) => {
  return (
    <View>
      <BoxShadow style={styles.wrapper}>
        <Placeholder Animation={ShineOverlay}>
          <View style={styles.container}>
            <PlaceholderMedia
              style={{
                position: 'relative',
                height: '100%',
                flex: 45,
              }}
            />
            <View style={styles.boxInfo}>
              <View style={styles.wrapTitle}>
                <PlaceholderLine
                  style={{
                    width: '65%',
                    height: 15,
                    marginBottom: 4,
                    backgroundColor: '#e2e1e1',
                  }}
                />
                <PlaceholderLine
                  style={{
                    width: '25%',
                    height: 15,
                    marginBottom: 4,
                  }}
                />
              </View>
              <View style={[Styles.flexRow, styles.wrapBirth]}>
                <PlaceholderLine
                  style={{
                    width: '40%',
                    marginBottom: 2,
                    height: 8,
                  }}
                />
              </View>
              <View style={[Styles.flexRow, styles.wrapBirth]}>
                <PlaceholderLine
                  style={{
                    width: '30%',
                    marginBottom: 2,
                    height: 12,
                  }}
                />
              </View>
              <View>
                <PlaceholderLine
                  style={{
                    width: '55%',
                    marginBottom: 2,
                    height: 12,
                  }}
                />
              </View>
              <View>
                <PlaceholderLine
                  style={{
                    width: '90%',
                    marginBottom: 2,
                    height: 12,
                  }}
                />
              </View>
              <View>
                <PlaceholderLine
                  style={{
                    width: '70%',
                    marginBottom: 2,
                    height: 12,
                  }}
                />
              </View>
              <View style={[Styles.flexRowCenterVertical, styles.groupBtn]}>
                <PlaceholderLine
                  style={{
                    width: '30%',
                    marginBottom: 0,
                    marginTop: 0,
                    height: 15,
                  }}
                />
                <View>
                  <View style={styles.wrapBtn}>
                    <Text style={[Styles.textWhite, styles.textBtn]}>BOOK</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Placeholder>
      </BoxShadow>
    </View>
  );
};
export default ProfileHorizontal;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 18,
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
  },
  boxInfo: {
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 6,
    flex: 55,
  },
  wrapTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapBirth: {
    alignItems: 'center',
  },
  groupBtn: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
    paddingHorizontal: 18,
    paddingVertical: 5,
    color: Colors.grey2,
  },
});
