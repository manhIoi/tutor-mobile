import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import {Text} from 'react-native-elements';
import Styles from '../../theme/MainStyles';
import InvitationItem from './InvitationItem';
import {teacherInvite} from '../../api/class';
import Colors from '../../theme/Colors';

const Invitation = (props) => {
  const [data, setData] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  async function getTeacherInvite(page = 1, limit = 20, keyword = '') {
    try {
      setIsBusy(true);
      const response = await teacherInvite(page, limit);
      setData(response);
      setIsBusy(false);
    } catch (error) {
      setIsBusy(false);
      console.log(error);
    }
  }
  useEffect(() => {
    getTeacherInvite();
  }, []);
  return (
    <View style={styles.container}>
      {isBusy ? (
        <ActivityIndicator
          size="small"
          style={{marginVertical: 10}}
          color={Colors.orange2}
        />
      ) : (
        <FlatList
          data={data}
          renderItem={({item, index}) => <InvitationItem item={item} />}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

export default Invitation;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginBottom: 15,
  },
});
