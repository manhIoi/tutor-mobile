
import React from "react";
import {View, Text} from "react-native";


const EmptyListComponent = () => {
  return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }} >
        <Text style={{fontStyle: 'italic'}}>
          Không có dữ liệu
        </Text>
      </View>

  )
}

export default EmptyListComponent
