import React, {useEffect, useState} from 'react';
import {View, StyleSheet, StatusBar, Dimensions} from 'react-native';
import {Text} from 'react-native-elements';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import Colors from '../../theme/Colors';
import ButtonCustom from '../common/ButtonFooterCustom';
import Styles from '../../theme/MainStyles';
import MainStyles from '../../theme/MainStyles';
import ConfigStyle from '../../theme/ConfigStyle';

const MessageUpdateInfo = (props) => {
  const [showModal, setShowModal] = useState(false);

  const user = useSelector((state) => state.auth?.user);
  useEffect(() => {
    if (user?._id) {
      if (!user?.topic?.length) {
        setShowModal(true);
      } else {
        if (!user?.address) {
          setShowModal(true);
        }
      }
    }
  }, []);
  useEffect(() => {
    if (user?._id) {
      if (!user?.topic?.length) {
        setShowModal(true);
      } else {
        if (!user?.address) {
          setShowModal(true);
        }
      }
    }
  }, [props.showModalUpdate, user?._id]);
  function goToUpdate() {
    // if (!user?.topic?.length) {
    //   setShowModal(true);
    // } else {
    //
    // }
    if (!user?.topic?.length) {
      setShowModal(false);
      props.navigation.navigate('Hobby', {
        isUpdate: true,
        hasAddress: user?.address || '',
      });
    } else {
      if (!user?.address) {
        setShowModal(false);
        props.navigation.navigate('Profile', {
          screen: 'Account',
          value: new Date(),
        });
      }
    }
  }
  return (
    <Modal isVisible={showModal}
backdropOpacity={0.5}
style={styles.modal}>
      <View style={styles.container}>
        <Text style={{...styles.message, ...Styles.textLight}}>
          Vui lòng cập nhật thông tin tài khoản.
        </Text>
        <ButtonCustom
          style={styles.btn}
          text={'Cập nhật'}
          onPress={goToUpdate}
        />
      </View>
    </Modal>
  );
};

export default MessageUpdateInfo;

const styles = StyleSheet.create({
  modal: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  container: {
    backgroundColor: Colors.whiteColor,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    fontSize: 14,
  },
  btn: {
    width: '50%',
    marginTop: 10,
  },
});
