import Colors from "../../theme/Colors";
import {Image, View} from "react-native";
import {Text} from "react-native-elements";
import React from "react";

const VoteItem = (props) => {
    const { message, userSend } = props || {}
    return (
        <View style={[{ borderWidth:1, borderColor: Colors.inputBorder, marginTop: 10, padding: 8, borderRadius: 6, }, props?.style]} >
            <View style={{ flexDirection: 'row' }} >
                <Image source={{ uri: userSend?.avatar }}  style={{ width: 20, height: 20, borderRadius: 30, borderWidth:1, borderColor: Colors.greyText, marginRight: 8, backgroundColor: Colors.greyText }} />
                <Text style={{ fontWeight: "bold" }} >{userSend?.fullName}</Text>
            </View>
            <Text style={{ color: Colors.black3 }} >{message}</Text>
        </View>
    )
}

export default VoteItem;
