import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import {Text} from 'react-native-elements';
import Styles from '../../theme/MainStyles';
import RecommendationItem from './RecommendationItem';
import {getTeacherManagementRequest} from '../../api/class';
import Colors from '../../theme/Colors';

const Recommendation = (props) => {
  const [data, setData] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  async function getRequest(page = 1, limit = 20, keyword = '') {
    try {
      setIsBusy(true);
      const response = await getTeacherManagementRequest();
      if (response) {
        setData(response?.payload);
        setIsBusy(false);
      }
    } catch (error) {
      setIsBusy(false);
      console.log(error);
    }
  }
  useEffect(() => {
    getRequest();
  }, []);
  return (
    <View style={styles.container}>
      {isBusy ? (
        <ActivityIndicator size="small"
color={Colors.orange2} />
      ) : (
        <FlatList
          data={data}
          renderItem={({item, index}) => <RecommendationItem data={item} />}
          keyExtractor={(item) => item.toString}
        />
      )}
    </View>
  );
};

export default Recommendation;

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
