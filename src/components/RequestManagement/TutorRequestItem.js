import {Text} from "react-native-elements";
import Styles from "../../theme/MainStyles";
import ChoiceSpecificDay from "../CreateRequest/ChoiceSpecificDay";
import LabelDuration from "../Tutor/LabelDuration";
import Constants from "../../constants";
import BoxShadow from "../common/BoxShadow";
import React from "react";
import {Pressable, StyleSheet} from "react-native";
import Colors from "../../theme/Colors";

const TutorRequestItem = (props) => {
    const classData = props.data;
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
                    startTime={
                        new Date(
                            2020,
                            8,
                            2,
                            classData?.timeStartAt?.hour || 0,
                            classData?.timeStartAt?.minute || 0,
                        )
                    }
                    finishTime={
                        new Date(
                            2020,
                            8,
                            2,
                            classData?.timeEndAt?.hour || 0,
                            classData?.timeEndAt?.minute || 0,
                        )
                    }
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
