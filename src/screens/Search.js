import { View, Text, FlatList, StyleSheet, TextInput } from "react-native";
import ConfigStyle from "../theme/ConfigStyle";
import Statusbar from "../components/common/StatusBar";
import Container from "../components/common/Container";
import Selection from "../components/common/Selection";
import React, { useMemo, useState } from "react";
import { ModalPicker } from "../components/common/CustomPicker";
import { useSelector } from "react-redux";
import Colors from "../theme/Colors";
import isEqual from "lodash/isEqual";
import groupBy from "lodash/groupBy";

import ButtonCustom from "../components/common/ButtonFooterCustom";
import ProfileHorizontal from "../components/Home/ProfileHorizontal";
import TutorRequestItem from "../components/RequestManagement/TutorRequestItem";
import ColorsCore from "../../constants/Colors";
import ChoiceSpecificDay from "../components/CreateRequest/ChoiceSpecificDay";

const DEFAULT_DOB = Array.from({ length: 40 }, (_, index) => index + 1975).map(i => ({ name: `Năm: ${i.toString()}` }))

const SearchScreen = (props) => {
    const { route, navigation } = props || {}
    const subjects = useSelector(state => state.subject.value);

    const [showSubject, setShowSubject] = useState(false);
    const [showDOB, setShowDOB] = useState(false);
    const [showAddress, setShowAddress] = useState(false);
    const [showStatus, setShowStatus] = useState(false);

    const [currentSubject, setCurrentSubject] = useState([]);
    const [currentDOB, setCurrentDOB] = useState(null);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [currentStatus, setCurrentStatus] = useState(null);
    const [currentDayStudy, setCurrentDayStudy] = useState([]);
    const [currentAmount, setCurrentAmount] = useState('');
    const [currentNumberOfStudent, setCurrentNumberOfStudent] = useState('')
    const isSearchTeacher = route?.params?.isSearchTeacher;
    const teacherList = useSelector(state => state.main.teacherList)
    const tutorRequestList = useSelector(state => state.main.tutorRequestList)
    const [searchData, setSearchData] = useState(null);

    const addressData = useMemo(() => {

        const groupByAddress = groupBy(teacherList, "address");
        return Object.keys(groupByAddress)?.filter?.(item => !!item)?.map?.(item => ({ name: item }));
    }, [teacherList])

    const subjectsString = useMemo(() => {
        if (!currentSubject?.length) return '';
        return currentSubject?.map?.(item => item?.name)?.join(", ")
    }, [currentSubject])

    const teacherListSearch = useMemo(() => {
        let result = teacherList;
        if (searchData?.address) {
            result = result?.filter?.(item => item?.address === searchData?.address)
        }
        if (searchData?.dob) {
            result = result?.filter?.(item => item?.dob === searchData?.dob)
        }
        if (searchData?.subjects?.length > 0) {
            const subjectsHash = searchData?.subjects?.reduce?.((current, item, index) => {
                current[item?._id] = item;
                return current;
            }, {})
            result = result?.filter?.(item => item?.subjects?.some(s => subjectsHash[s?._id]))
        }
        return result;
    }, [teacherList, searchData])

    const tutorRequestListSearch = useMemo(() => {
        let result = tutorRequestList;
        if (typeof searchData?.status === "number") {
            result = result?.filter(item => item?.status === searchData?.status);
        }
        if (searchData?.amount) {
            result = result?.filter(item => item?.price <= searchData?.amount)
        }

        if (searchData?.numberOfStudent) {
            result = result?.filter(item => item?.numOfStudents <= searchData?.numberOfStudent)
        }

        if (searchData?.weekDays?.length > 0) {
            const weekDaysSorted = searchData?.weekDays?.sort?.((a, b) => a - b);
            result = result?.filter?.(item => {
                const weekDaysItemSorted = item?.weekDays?.sort?.((a, b) => a - b);
                return isEqual(weekDaysSorted, weekDaysItemSorted);
            })
        }

        return result;
    }, [tutorRequestList, searchData])



    const handleSubmit = () => {
        if (isSearchTeacher) {
            setSearchData({
                address: currentAddress?.name,
                dob: currentDOB?.name?.split(": ")[1],
                subjects: currentSubject,
            })
        } else {
            setSearchData({
                status: currentStatus?.value,
                amount: currentAmount ? parseInt(currentAmount) : 0,
                numberOfStudent: currentNumberOfStudent ? parseInt(currentNumberOfStudent) : 0,
                weekDays: currentDayStudy
            })
        }
    }

    const handleClearFilter = () => {
        setSearchData(null)
        setCurrentSubject(null);
        setCurrentDOB(null);
        setCurrentAddress(null);
        setCurrentStatus(null);
        setCurrentDayStudy([]);
        setCurrentAmount('');
        setCurrentNumberOfStudent('')
    }

    const _renderItem = ({ item, index }) => {
        if (isSearchTeacher) {
            return (
                <ProfileHorizontal
                    data={item}
                    navigation={navigation}
                />
            )
        }
        return <TutorRequestItem data={item} onPress={() => navigation.navigate('Calendar', {
            screen: 'DetailRequest',
            params: {
                tutorRequest: item,
            }
        })} />
    }

    const renderForm = () => {
        return (
            <View style={{ padding: 10 }} >
                {
                    isSearchTeacher ? (
                        <>
                            <Selection textInputProps={{
                                placeholder: "Môn học",
                                value: subjectsString || '',
                                style: styles.selection
                            }} onPress={() => setShowSubject(true)}
                                style={styles.selectionContainer}
                            />
                            <Selection textInputProps={{
                                placeholder: "Năm sinh",
                                value: currentDOB?.name || '',
                                style: styles.selection
                            }} onPress={() => setShowDOB(true)}
                                style={styles.selectionContainer}
                            />
                            <Selection textInputProps={{
                                placeholder: "Địa chỉ",
                                value: currentAddress?.name || '',
                                style: styles.selection
                            }} onPress={() => setShowAddress(true)}
                                style={styles.selectionContainer}
                            />
                        </>
                    ) : (
                        <>
                            <Selection textInputProps={{ placeholder: "Trạng thái", style: styles.selection, value: currentStatus?.name || '' }} style={styles.selectionContainer} onPress={() => setShowStatus(true)} />
                            <View style={styles.inputContainer}>
                                <TextInput placeholder={"Giá tiền tối đa"} keyboardType={"numeric"} value={currentAmount} onChangeText={setCurrentAmount} />
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput placeholder={"Số lượng học sinh tối đa"} keyboardType={"numeric"} value={currentNumberOfStudent} onChangeText={setCurrentNumberOfStudent} />
                            </View>
                            <View style={{ marginBottom: 10 }} >
                                <ChoiceSpecificDay
                                    numberDay={7}
                                    dayStudy={currentDayStudy}
                                    handleChange={(value) => {
                                        setCurrentDayStudy(value)
                                    }}
                                />
                            </View>

                        </>
                    )
                }

                <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }} >
                    <ButtonCustom outline={true} text={"Xóa bộ lọc"} onPress={handleClearFilter} style={{ marginRight: 10 }} />
                    <ButtonCustom text={"Tìm kiếm"} onPress={handleSubmit} />
                </View>
            </View>

        )
    }

    const renderResult = () => {
        return <FlatList
            style={{ margin: 10 }}
            data={isSearchTeacher ? teacherListSearch : tutorRequestListSearch}
            renderItem={_renderItem}
            ListHeaderComponent={<Text style={{ marginBottom: 10, fontSize: 18 }}>Kết quả tìm kiếm</Text>}
        />
    }

    return (
        <Container
            contentBarStyles={{ justifyContent: 'space-between' }}
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
            {showSubject ? <ModalPicker
                searchable={true}
                searchKey={"name"}
                items={subjects}
                show={showSubject}
                hideModal={() => setShowSubject(!showSubject)}
                onChange={setCurrentSubject}
                isMultiSelect
                selectedItems={currentSubject}
                title={"Môn học"}
            /> : null}

            <ModalPicker
                items={DEFAULT_DOB}
                show={showDOB}
                hideModal={() => setShowDOB(!showDOB)}
                onChange={setCurrentDOB}
                title={"Năm sinh"}
            />
            <ModalPicker
                items={addressData}
                show={showAddress}
                hideModal={() => setShowAddress(!showAddress)}
                onChange={setCurrentAddress}
                title={"Địa chỉ"}
            />
            <ModalPicker
                items={[
                    {
                        name: "Đang mở",
                        value: 0
                    },
                    {
                        name: "Đợi giáo viên xác nhận",
                        value: 1
                    },
                    {
                        name: "Có giáo viên nhận lớp",
                        value: 2
                    },
                    {
                        name: "Lớp học kết thúc",
                        value: 3
                    }
                ]}
                show={showStatus}
                hideModal={() => setShowStatus(!showStatus)}
                onChange={setCurrentStatus}
                title={"Trạng thái lớp học"}
            />
        </Container>
    )
}

export default SearchScreen

const styles = StyleSheet.create({
    selectionContainer: {
        marginBottom: 10,
    },
    selection: {
        color: Colors.black,
    },
    inputContainer: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: ColorsCore.borderColor,
        borderRadius: 8,
        marginBottom: 10,
    },
    input: {
    }
})
