import {TextInput, TouchableOpacity, View} from 'react-native'
import Colors from "../../../constants/Colors";

const Selection = (props) => {
    const { renderIcon, textInputProps, onPress, style } = props || {};
    const _renderIcon = () => {
        return renderIcon?.() || null;
    }
    return (
        <TouchableOpacity  onPress={onPress} activeOpacity={0.85} style={[{ 
            paddingHorizontal: 10, paddingVertical: 4, borderWidth:1, borderColor: Colors.borderColor, borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center'
        }, style]} >
            {_renderIcon()}
            <TextInput {...textInputProps}  editable={false}   />
        </TouchableOpacity>
    )
}

export default Selection;
