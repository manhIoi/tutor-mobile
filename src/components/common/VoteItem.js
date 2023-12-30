import Colors from "../../theme/Colors";
import {Image, View} from "react-native";
import {Text} from "react-native-elements";
import React from "react";
import RateStar from "./RateStar";

const VoteItem = (props) => {
    const { message, userSend, value } = props?.vote || {}
    
    console.log(`🔥LOG_IT:: userSend`, userSend)
    return (
        <View style={[{ padding: 8, borderRadius: 6, }, props?.style]} >
            <View style={{ flexDirection: 'row' }} >
                <Image source={{ uri: userSend?.avatar }}  style={{ width: 20, height: 20, borderRadius: 30, borderWidth:1, borderColor: Colors.greyText, marginRight: 8, backgroundColor: Colors.greyText }} />
                <Text style={{ fontWeight: "bold" }} >{userSend?.fullName}</Text>
            </View>
            <Text style={{ color: Colors.black3 }} >{message}</Text>
            <RateStar size={10}  activeValue={Math.round(value) }/>
        </View>
    )
}

export default VoteItem;
