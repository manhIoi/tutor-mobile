import {Text} from "react-native-elements";
import Styles from "../../theme/MainStyles";
import ChoiceSpecificDay from "../CreateRequest/ChoiceSpecificDay";
import LabelDuration from "../Tutor/LabelDuration";
import Constants from "../../constants";
import BoxShadow from "../common/BoxShadow";
import React, {useMemo} from "react";
import {Pressable, StyleSheet} from "react-native";


const TutorRequestItem = (props) => {
    const classData = props.data;
    const timeStart = useMemo(() => {
        return new Date(classData?.timeStart);
    }, [classData?.timeStart]);
    const timeEnd = useMemo(() => {
        return new Date(timeStart).setMinutes(timeStart.getMinutes()+classData?.timeline)
    }, [timeStart, classData?.timeLine])

    return (
        <Pressable onPress={props?.onPress}>
            <BoxShadow style={styles.wrapBoxTime}>
                <Text
                    style={[
                        Styles.textLight,
                        Styles.textBlack3,
                        styles.spaceVertical,
                        {fontSize: 12, marginVertical: 2},
                    ]}
                >
                    Mã lớp:{' '}
                    <Text style={[{fontSize: 14}, Styles.textNormal]}>
                        {classData?._id}
                    </Text>
                </Text>
                <ChoiceSpecificDay
                    dayStudy={classData.weekDays}
                    containerStyle={{marginHorizontal: 0}}
                />
                <LabelDuration
                    startTime={timeStart}
                    finishTime={timeEnd}
                    startDate={classData?.startAt}
                    finishDate={classData?.endAt}
                    totalLesson={classData?.totalLesson}
                />
                <Text
                    style={[
                        Styles.textLight,
                        Styles.textBlack3,
                        styles.spaceVertical,
                        {fontSize: 12},
                    ]}
                >
                    Học phí:{'   '}
                    <Text
                        style={[Styles.textNormal, Styles.textOrange, {fontSize: 14}]}
                    >
                        {classData?.price?.toLocaleString('it-IT', {
                            style: 'currency',
                            currency: 'VND',
                        })}
                    </Text>
                </Text>
                <Text
                    style={{
                        ...Styles.textLight,
                        ...Styles.textBlack3,
                        ...styles.spaceVertical,
                        fontSize: 12,
                    }}
                >
                    Số lượng học sinh :{' '}
                    <Text
                        style={{
                            ...Styles.textNormal,
                            fontSize: 14,
                        }}
                    >
                        {`${classData?.students?.length}/${classData?.numOfStudents}`}
                    </Text>
                </Text>
                <Text
                    style={{
                        ...Styles.textLight,
                        ...Styles.textBlack3,
                        ...styles.spaceVertical,
                        fontSize: 12,
                    }}
                >
                    Trạng thái:{' '}
                    <Text
                        style={{
                            ...Styles.textNormal,
                            fontSize: 14,
                            color:
                                Constants.STATUS_CLASS_COLOR[props.data?.status],
                        }}
                    >
                        {Constants.STATUS_CLASS[props.data?.status]}
                    </Text>
                </Text>
            </BoxShadow>
        </Pressable>
    )
}

export default TutorRequestItem;

const styles= StyleSheet.create({
    wrapBoxTime: {
        paddingVertical: 15,
        paddingHorizontal: 17,
    },
    spaceVertical: {
        marginVertical: 2,
    },
    container: {
        marginBottom: 15,
        paddingHorizontal: 17,
        paddingVertical: 12,
    },
});
