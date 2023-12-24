import {TextInput, TouchableOpacity, View} from 'react-native'
import Colors from "../../../constants/Colors";

const Selection = (props) => {
    const { IconElement, textInputProps, onPress, style } = props || {}
    return (
        <TouchableOpacity  onPress={onPress} activeOpacity={0.85} style={[{ paddingHorizontal: 10, paddingVertical: 4, borderWidth:1, borderColor: Colors.borderColor, borderRadius: 8 }, style]} >
            <TextInput {...textInputProps}  editable={false}   />
        </TouchableOpacity>
    )
}

export default Selection;
