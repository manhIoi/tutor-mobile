import { View, Text } from "react-native";
import ConfigStyle from "../theme/ConfigStyle";
import Statusbar from "../components/common/StatusBar";
import Container from "../components/common/Container";


const SearchScreen = (props) => {
    const { route, navigation} = props || {}
    const isSearchTeacher = route?.params?.isSearchTeacher;

    const renderForm = () => {
        return null
    }

    const renderResult = () => {
        return null
    }

    return (
        <Container
            contentBarStyles={{justifyContent: 'space-between'}}
            navigation={props.navigation}
            headerHeight={ConfigStyle.statusBarHeight}
            hideBackground={true}
            header={
                <Statusbar
                    headerHeight={ConfigStyle.statusBarHeight}
                    hideBackground={false}
                    arrowBack={true}
                    title={`Tìm kiếm ${isSearchTeacher ? "giáo viên" : "lớp học"}`}
                    navigation={props.navigation}
                />
            }
        >
            {renderForm()}
            {renderResult()}
        </Container>
    )
}

export default SearchScreen
