import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import IconEdit from 'react-native-vector-icons/Feather';
import {useDispatch, useSelector} from 'react-redux';
import BackgroundImageTop from '../Tools/BackgroundImageTop';
import Colors from '../../theme/Colors';
import ConfigStyle from '../../theme/ConfigStyle';
import {editProfile, IsChecked} from '../../lib/slices/familySlice';

const Header = (props) => {
  const isClicked = false;
  const dispatch = useDispatch();
  // console.log(useSelector(IsChecked));

  const {navigation} = props;
  return (
    <View style={{...styles.wrapper}}>
      <BackgroundImageTop imageSource={props.imageSource} />
      <View style={{...styles.container, minHeight: props.height}}>
        <View style={styles.searchBar}>
          <View style={styles.controlGroup}>
            {props.cancel ? (
              <TouchableOpacity
                onPress={() => {
                  dispatch(editProfile(isClicked));
                }}
              >
                <Text style={{color: '#ffffff', fontSize: 14}}> Hủy </Text>
              </TouchableOpacity>
            ) : null}
            {props.leftIcon ? (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="left"
style={styles.titleViewText} />
              </TouchableOpacity>
            ) : null}
            <View style={{...styles.titleView}}>
              <Text style={styles.header}>{props.title}</Text>
            </View>
            {props.rightIcon ? (
              <TouchableOpacity
                onPress={() => {
                  dispatch(editProfile(isClicked));
                }}
                style={{position: 'absolute', right: 0}}
              >
                <IconEdit name="edit"
style={styles.titleViewText} />
              </TouchableOpacity>
            ) : (
              <View />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    color: Colors.whiteColor,
    fontSize: ConfigStyle.title1,
  },
  titleView: {
    flex: 1,
    alignItems: 'center',
  },
  titleViewText: {
    color: Colors.whiteColor,
    fontSize: ConfigStyle.title1,
    marginTop: 5,
  },
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: Colors.whiteColor,
    overflow: 'hidden',
    paddingBottom: 30,
  },
  container: {
    paddingTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: 15,
    zIndex: 1,
    marginHorizontal: 17,
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  controlGroup: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlTab: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    height: 45,
    alignItems: 'center',
  },
  iconFilter: {
    width: 12,
    height: 18,
    marginRight: 15,
  },
  iconNoti: {
    marginTop: 5,
  },
});
