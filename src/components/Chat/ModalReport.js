import React, {useState} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {ListItem, Text} from 'react-native-elements';
import Toast from 'react-native-toast-message';
import ConfigStyle from '../../theme/ConfigStyle';
import Colors from '../../theme/Colors';
import Styles from '../../theme/MainStyles';
import BackgroundGradient from '../common/BackgroudGradient';
import {reportUser} from '../../api/users';

const list = [
  {
    text: 'Làm phiền',
    id: 1,
  },
  {
    text: 'Nội dung nhạy cảm',
    id: 2,
  },
  {
    text: 'Lừa đảo',
    id: 3,
  },
  {
    text: 'Nhập lý do khác',
    id: 4,
  },
];

const ModalReport = (props) => {
  const [typeOther, setTypeOther] = useState(false);
  const [text, setText] = useState('');

  async function handleReport(id) {
    try {
      const data = {
        id: props.userReceive?._id,
        typeReport: id,
        content: text,
      };
      props.hideModal();
      const response = await reportUser(data);
      if (response) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'success',
          text1: 'Báo cáo của bạn đã được ghi nhận',
        });
      }
    } catch (error) {
      if (error?.response?.data?.errors) {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'error',
          text1:
            error?.response?.data?.errors[0].message ||
            error?.response?.data?.errors[0].param,
        });
      } else {
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'error',
          text1: 'Lỗi máy chủ',
        });
      }
    }
  }

  async function choiceReason(reason) {
    if (reason.id === 4) {
      setTypeOther(true);
    } else {
      await handleReport(reason.id);
    }
  }

  return (
    <Modal
      isVisible={props.isModalVisible}
      backdropOpacity={ConfigStyle.backdropOpacity}
      onBackdropPress={props.hideModal}
    >
      <View style={styles.container}>
        <View style={styles.title}>
          <Text
            style={{
              ...Styles.title3RS,
              ...Styles.textBold,
            }}
          >
            {typeOther ? 'Lý do khác' : 'Lý do báo cáo'}
          </Text>
        </View>
        {typeOther ? (
          <View>
            <View style={styles.wrapInput}>
              <TextInput
                placeholder={'Nhập lý do báo cáo'}
                multiline
                numberOfLines={3}
                value={text}
                onChangeText={(value) => setText(value)}
              />
            </View>
            <View style={styles.btnGroup}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={props.hideModal}
              >
                <View style={{borderRadius: 30}}>
                  <Text style={styles.textCancel}>Hủy</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnDetail}
                onPress={() => handleReport(4)}
              >
                <BackgroundGradient style={{borderRadius: 30}}>
                  <Text style={styles.btnDetailText}>Gửi</Text>
                </BackgroundGradient>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {list.map((l, i) => (
              <ListItem
                key={i}
                bottomDivider={i !== list?.length - 1}
                onPress={() => choiceReason(l)}
              >
                <ListItem.Content style={{paddingVertical: 0}}>
                  <ListItem.Title>{l.text}</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            ))}
          </>
        )}
      </View>
    </Modal>
  );
};

export default ModalReport;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.whiteColor,
    borderRadius: 15,
  },
  title: {
    marginBottom: 20,
    alignItems: 'center',
  },
  wrapInput: {
    borderBottomWidth: 1,
    marginBottom: 10,
    borderBottomColor: Colors.borderThin,
  },
  btnDetailText: {
    color: Colors.whiteColor,
    paddingHorizontal: 25,
    paddingVertical: 6,
    textAlign: 'center',
  },
  textCancel: {
    paddingHorizontal: 25,
    paddingVertical: 6,
    textAlign: 'center',
    color: Colors.black2,
  },
  btnDetail: {
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  btnCancel: {
    justifyContent: 'center',
    alignSelf: 'flex-end',
    backgroundColor: Colors.borderThin,
    borderRadius: 50,
    marginRight: 10,
  },
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
