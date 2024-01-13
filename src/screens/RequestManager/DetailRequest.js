import React, { useEffect, useMemo, useState } from 'react';
import Toast from 'react-native-toast-message';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity, TextInput,
} from 'react-native';
import { Text } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import ConfigStyle from '../../theme/ConfigStyle';
import Container from '../../components/common/ContainerAnimated';
import Styles from '../../theme/MainStyles';
import BoxShadow from '../../components/common/BoxShadow';
import Colors from '../../theme/Colors';
import ImageUtils from '../../utils/images.util';
import { isEmpty } from "lodash";


import {
  cancelRegistryClass,
  registerClass,
  teacherRegistryRequest,
  updateDetailRequest,
  voteClass,
  getVoteByClass, cancelDetailRequest,
  getOtherVoteByClass
} from '../../api/class';
import ButtonCustom from '../../components/common/ButtonFooterCustom';
import CustomActionSheet from '../../components/common/CustomActionSheet';
import config from '../../../config/config';
import IconChatActive from '../../assets/images/tab/chat1.svg';
import TutorRequestItem from "../../components/RequestManagement/TutorRequestItem";
import { useDispatch, useSelector } from "react-redux";

import Star from '../../assets/images/svg/star.svg';
import StarGrey from '../../assets/images/svg/star-grey.svg';
import { syncMyRequestList, syncTutorRequestList } from "../../helper/main";
import SocketIO from "../../utils/SocketIO";
import VoteItem from '../../components/common/VoteItem';

const INIT_REVIEWS = {
  data: [],
  totalItems: 0,
  currentPage: 1,
};
const DetailClass = (props) => {
  const user = useSelector(state => state.auth.user);
  const [classData, setClassData] = useState(props.route?.params?.tutorRequest);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [isBusyButon, setBusyButton] = useState(false);
  const coursesString = classData?.subjects?.map?.(s => s?.name).join(', ')
  const isMyRequest = classData?.user?._id === user?._id;
  const isClassEnd = classData?.status === 3;
  const isClassNotApprove = classData?.status === 0 || classData?.status === 1;
  const classFullStudent = classData?.students?.length === classData?.numOfStudents
  const isInClass = classData?.students?.some(i => i?._id === user?._id)
  const isValidSubject = useMemo(() => {
    const subjectHash = classData?.subjects?.reduce?.((current, item, index) => {
      current[item?._id] = item;
      return current;
    }, {})
    return user?.subjects?.some?.(item => subjectHash[item?._id]);
  }, [classData?.subjects, user])
  const dispatch = useDispatch();
  const [voteData, setVoteData] = useState({
    value: 0,
    message: '',
    editable: false,
    userSend: user,
  });

  const [otherVotes, setOtherVotes] = useState([]);

  useEffect(() => {
    getVoteData();
    getOtherVote();
  }, [])

  const getVoteData = async () => {
    try {
      const response = await getVoteByClass(classData?._id, user?._id) || {};
      console.log(`🔥LOG_IT:: response`, response)

      setVoteData({
        ...voteData,
        ...response,
        editable: isEmpty(response),
      })
    } catch (e) {
      console.log(`🔥LOG_IT:: getVoteData e`, e)
    }
  }

  const getOtherVote = async () => {
    try {
      const response = await getOtherVoteByClass(classData?._id, user?._id) || {};
      console.log(`🔥LOG_IT:: response`, response)
      setOtherVotes(response);
    } catch (error) {
      console.log(`🔥LOG_IT:: getVoteData e`, error)
    }
  }

  function handleClickCancel() {
    setShowActionSheet(true);
    setTimeout(() => {
      setShowActionSheet(false);
    }, 200);
  }

  const handleClickJoinClass = () => {
    setShowActionSheet(true);
  }

  const handleJoinClass = async () => {
    try {
      if (user.role === 'teacher') {
        const response = await updateDetailRequest(classData._id, {
          teacher: {
            _id: user._id,
          },
          status: 2,
          isTeacherApproved: true,
        })
        if (response) {
          Toast.show({
            ...ConfigStyle.toastDefault,
            text1: 'Nhận lớp thành công!',
            type: 'success',
          });
          SocketIO.emit("joinClass", { tutorRequest: response, userId: user?._id })
          props.navigation.goBack()
        }
      } else {
        const response = await updateDetailRequest(classData._id, {
          students: [...classData?.students, { _id: user._id }]
        })
        if (response) {
          Toast.show({
            ...ConfigStyle.toastDefault,
            text1: 'Tham gia lớp thành công!',
            type: 'success',
          });
          SocketIO.emit("joinClass", { tutorRequest: response, userId: user?._id })
          props.navigation.goBack()
        }
      }

    } catch (e) {
      console.info(`LOG_IT:: e`, e);
      Toast.show({
        ...ConfigStyle.toastDefault,
        text1: 'Nhận lớp không thành công!',
        type: 'error',
      });
    }
  }

  const cancelMyRequest = async () => {
    try {
      const response = await cancelDetailRequest(classData?._id)
      console.info(`LOG_IT:: response`, response);
      if (response) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          text1: 'Hủy yêu cầu thành công!',
          type: 'success',
        });
        props.navigation.goBack()
      }
    } catch (e) {
      console.info(`LOG_IT:: e cancelMyRequest`, e);
      Toast.show({
        ...ConfigStyle.toastDefault,
        text1: 'Hủy yêu cầu không thành công!',
        type: 'error',
      });
    }
  }

  async function handleActionSheetOnPress(index) {
    setShowActionSheet(false);
    switch (index) {
      case 0: {
        if (isMyRequest) {
          await cancelMyRequest()
          break;
        } else {
          await handleJoinClass()
        }
        syncTutorRequestList(dispatch, user)
        syncMyRequestList(dispatch, user)
        break;
      }
      case 1: {
        break;
      }
      default:
        break;
    }
  }

  const handleVoteClass = async () => {
    try {
      const _voteData = {
        userSend: user?._id,
        userReceive: classData?.teacher?._id,
        value: voteData.value,
        message: voteData?.message,
        class: classData?._id,
      }
      const response = await voteClass(_voteData);
      if (response) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          text1: 'Gửi đánh giá thành công! Cảm ơn sự đánh giá của bạn.',
          type: 'success',
        });
        props.navigation.goBack()
      } else {
        Toast.show({
          ...ConfigStyle.toastDefault,
          text1: 'Gửi đánh giá thất bại',
          type: 'error',
        });
      }
    } catch (e) {
      Toast.show({
        ...ConfigStyle.toastDefault,
        text1: 'Gửi đánh giá thất bại',
        type: 'error',
      });
    }
  }

  const renderVoteStar = () => {
    if (!isClassEnd || isEmpty(classData?.teacher) || user?.role === 'teacher') return null;
    return <View>
      <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 10 }} >
        {[1, 2, 3, 4, 5].map(i => <TouchableOpacity onPress={() => {
          if (!voteData.editable) return;
          setVoteData({ ...voteData, value: i })
        }} style={{ marginVertical: 4, marginHorizontal: 10 }}>
          {voteData.value < i ? <StarGrey width={40} height={40} /> : <Star width={40} height={40} />}
        </TouchableOpacity>)}
      </View>
      {voteData?.editable
        ? <TextInput multiline={true} placeholder={"Nhập đánh giá"} style={{ marginBottom: 10, borderRadius: 4, borderWidth: 1, borderColor: Colors.borderThin }} onChangeText={(text) => setVoteData({ ...voteData, message: text })} />
        : <View style={{ justifyContent: 'center', alignItems: 'center' }} ><Text>Bạn đã đánh giá: {voteData.message}</Text></View>
      }
    </View>
  }

  const renderOtherVotes = () => {
    if (!isClassEnd || isEmpty(classData?.teacher) || otherVotes?.length === 0) return null;
    return <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, marginBottom: 8 }}>
        <Text style={{ fontSize: ConfigStyle.font20, fontWeight: "bold", color: Colors.orange2, marginRight: 10 }}>
          Nhận xét khác
        </Text>
        <Text style={{ fontSize: ConfigStyle.font16 }} >({otherVotes.length})</Text>
      </View>
      {otherVotes?.map?.(item => (
        <View style={{ marginBottom: 8 }} key={`other_vote_item_${item?._id}`} >
          <BoxShadow>
            <VoteItem vote={item} />
          </BoxShadow>
        </View>
      ))}
    </View>
  }

  const renderInboxTeacher = () => {
    if (!classData?.teacher) return null;
    const isMyClass = user?._id === classData?.teacher?._id
    const nameTeacher = isMyClass ? "Tôi" : classData?.teacher?.fullName
    const subTitle = classData?.teacher?.metaData?.description || '';

    return (
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: ConfigStyle.font20, fontWeight: "bold", color: Colors.orange2 }}>
          Giáo viên nhận lớp
        </Text>
        <TouchableOpacity onPress={() => {
          props?.navigation?.push?.("DetailTutor", {
            teacher: classData?.teacher,
          })
        }} >
          <BoxShadow style={{ ...styles.container, flexDirection: 'row' }}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <Image
                source={{
                  uri: classData?.teacher?.avatar,
                }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  borderWidth: 1,
                  borderColor: Colors.borderThin,
                }}
              />

              <View
                style={{
                  flexDirection: 'column',
                  marginLeft: 10,
                  justifyContent: 'center',
                  flex: 1,
                }}
              >
                <Text style={{ fontSize: ConfigStyle.font16 }}>
                  {nameTeacher}
                </Text>
                <Text style={{ fontSize: ConfigStyle.font12 }}>
                  {classData?.teacher?.phone}
                </Text>
                <Text style={{ fontSize: ConfigStyle.font10 }} numberOfLines={2}>
                  {subTitle}
                </Text>
              </View>
            </View>
            {isMyClass ? null : <TouchableOpacity
              style={{
                ...styles.itemChat,
                position: 'absolute',
                top: 0,
                right: 10,
              }}
              onPress={() => {
                props.navigation.push('InboxChat', {
                  to: classData?.teacher?.id,
                  userReceive: classData?.teacher,
                });
              }}
            >
              <IconChatActive width={16} height={16} />
            </TouchableOpacity>}
          </BoxShadow>
        </TouchableOpacity>
      </View>
    )
  }

  const renderButton = () => {
    const buttonProps = {
      style: { width: '100%' },
    }
    if (isClassEnd) {
      if (voteData?.editable && !isEmpty(classData?.teacher) && user?.role === 'student') {
        return <ButtonCustom {...buttonProps} onPress={handleVoteClass} text={"Gửi đánh giá"} />
      }
      return <ButtonCustom {...buttonProps} disabled={true} text={"Lớp học đã hết hạn"} />;
    }

    if (isMyRequest) {
      console.info(`LOG_IT:: `, classData?.teacher, classData?.students > 1);
      return <ButtonCustom {...buttonProps} disabled={classData?.teacher || classData?.students > 1} text={'HỦY ĐĂNG KÝ'} onPress={handleClickCancel} />
    }

    if (user?.role === 'teacher') {
      if (!isValidSubject) {
        return <ButtonCustom
          style={{ width: '100%' }}
          text={'Môn học không khả dụng với bạn'}
          disabled={true}
        />
      }
      if (isClassNotApprove) {
        return <ButtonCustom
          style={{ width: '100%' }}
          text={'NHẬN LỚP NGAY'}
          onPress={handleClickJoinClass}
        />
      }
      return <ButtonCustom
        style={{ width: '100%' }}
        text={'Đã có giáo viên'}
        disabled={true}
      />
    } else {
      if (classFullStudent) {
        return <ButtonCustom
          style={{ width: '100%' }}
          text={'LỚP HỌC ĐÃ ĐẦY'}
          disabled={true}
        />
      }
      if (isInClass) {
        return <ButtonCustom
          style={{ width: '100%' }}
          text={'BẠN ĐANG TRONG LỚP HỌC '}
          disabled={true}
        />
      }
      return <ButtonCustom
        style={{ width: '100%' }}
        text={'THAM GIA LỚP HỌC'}
        onPress={handleClickJoinClass}
      />
    }
  }

  console.info(`LOG_IT:: classData?.teacher?.avatar`, classData?.teacher?.avatar);

  return (
    <Container
      title={"Chi tiết"}
      arrowBack={true}
      contentBarStyles={{ justifyContent: 'space-between' }}
      navigation={props.navigation}
      headerHeight={ConfigStyle.statusBarHeight}
      hideBackground={false}
      keyboardShouldPersistTaps={true}
      imageSource={ImageUtils.bgNotDot}
    >
      <View style={styles.container}>
        <Text style={{ fontSize: ConfigStyle.font20, fontWeight: "bold", color: Colors.orange2 }}>
          Giới thiệu
        </Text>
        <View>
          <View style={{ flexDirection: 'row', alignItems: "flex-end" }} >
            <Text style={{ fontSize: 14, fontWeight: "bold" }} >Tiêu đề: </Text>
            <Text>{classData?.title || ''}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: "flex-end" }} >
            <Text style={{ fontSize: 14, fontWeight: "bold" }} >Mô tả: </Text>
            <Text>{classData?.description || ''}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: "flex-end" }} >
            <Text style={{ fontSize: 14, fontWeight: "bold" }} >Môn học: </Text>
            <Text>{coursesString || ''}</Text>
          </View>
        </View>
        <Text style={{ fontSize: ConfigStyle.font20, fontWeight: "bold", color: Colors.orange2, marginTop: 10 }}>
          Thông tin lớp
        </Text>
        <TutorRequestItem data={classData} />
        {renderInboxTeacher()}
        {renderVoteStar()}
        {renderButton()}
        {renderOtherVotes()}
        <CustomActionSheet
          title={isMyRequest ? 'Xác nhận hủy đăng ký' : 'Xác nhận nhận lớp'}
          arrayActions={['Xác nhận', 'Thoát']}
          message={classData?.title ? `Lớp : ${classData?.title}` : ''}
          actionSheetOnPress={handleActionSheetOnPress}
          shouldShow={showActionSheet}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
        />
      </View>
    </Container>
  );
};

export default DetailClass;

const styles = StyleSheet.create({
  textRight: { justifyContent: 'flex-end', color: '#EE6423', fontSize: 14 },
  textLeft: {
    justifyContent: 'flex-start',
    color: '#00000029',
    fontSize: 14,
  },
  payment: {
    fontSize: 20,
    justifyContent: 'flex-start',
    color: '#333333',
  },
  wrapBoxPayment: {
    borderBottomWidth: 0,
    paddingVertical: 30,
    paddingHorizontal: 16,
    borderRadius: 0,
  },
  // container: {
  //   marginHorizontal: 15,
  //   paddingTop: 0,
  //   flex: 1,
  // },
  wrapTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  viewAll: {
    fontSize: 12,
    zIndex: 99,
    paddingHorizontal: 3,
    paddingVertical: 3,
  },
  wrapFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 0,
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    borderBottomWidth: 0,
    paddingVertical: 9,
    marginTop: 1,
  },
  textBtn: {
    fontSize: 14,
  },
  wrapBtn: {
    width: '45%',
    borderRadius: 20,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  wrapBtnInvited: {
    borderWidth: 1,
    borderColor: Colors.orange2,
    paddingVertical: 4,
  },
  textInvited: {
    color: Colors.orange2,
  },
  wrapBoxTime: {
    paddingVertical: 15,
    paddingHorizontal: 17,
  },
  spaceVertical: {
    marginVertical: 2,
  },
  textFooter: {
    marginLeft: 25,
  },
  wrapColItems: {
    width: 0.5 * window,
  },
  marker: {
    width: 14,
    height: 14,
    borderWidth: 2.5,
    borderColor: Colors.whiteColor,
    backgroundColor: Colors.orange,
    borderRadius: 50,
    position: 'absolute',
    bottom: 5,
    right: -3,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 72 / 2,
    borderWidth: 1,
    borderColor: Colors.borderThin,
  },
  groupBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  btnAction: {
    width: '45%',
    borderRadius: 20,
  },
  btnCancel: {
    borderWidth: 1,
    borderColor: Colors.orange2,
  },
  textAction: {
    textAlign: 'center',
    color: Colors.whiteColor,
    fontSize: 13,
    paddingVertical: 3,
  },
  textCancel: {
    color: Colors.orange2,
  },
  iconDelete: { width: 14, height: 18 },
  itemChat: {
    marginTop: 10,
    paddingHorizontal: 3,
    paddingVertical: 3,
  },
  container: {
    marginBottom: 15,
    paddingHorizontal: 17,
    paddingVertical: 12,
    backgroundColor: Colors.whiteColor,
  },
});
