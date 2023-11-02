import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import Match from '../common/ModalMatch';

const ActionNotification = (props) => {
  const notify = useSelector((state) => state?.notification?.newNotifications);
  const user = useSelector((state) => state.auth.user);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState(0);
  const [title2, setTitle2] = useState('');
  const [classData, setClassData] = useState({});

  function toogleModal() {
    setShowModal(!showModal);
  }
  // useEffect(() => {
  //   console.log(notify);
  //   console.log('user', user);
  //   switch (notify?.type) {
  //     case 'ADMIN_APPROVE_CLASS':
  //       console.log('ADMIN_APPROVE_CLASS ', 1);
  //       setStatus(0);
  //       setTitle(notify?.title);
  //       setTitle2(notify?.body);
  //       console.log(notify?.title);
  //       setClassData(notify?.data?.class);
  //       if (user?.access === 'teacher') setShowModal(true);
  //       break;
  //     case 'ADMIN_REJECT_CLASS':
  //       console.log('ADMIN_REJECT_CLASS ', 1);
  //       setStatus(0);
  //       setTitle(notify?.title);
  //       setTitle2(notify?.body);
  //       console.log(notify?.title);
  //       setClassData(notify?.data?.class);
  //       if (user?.access === 'teacher') setShowModal(true);
  //       break;
  //     case 'CLASS_START_3_DAY':
  //       console.log('CLASS_START_3_DAY ', 1);
  //       setStatus(0);
  //       setTitle(notify?.title);
  //       setTitle2(notify?.body);
  //       console.log(notify?.title);
  //       setClassData(notify?.data?.class);
  //       if (user?.access === 'teacher') setShowModal(true);
  //       break;
  //     case 'CLASS_START':
  //       console.log('CLASS_START ', 1);
  //       setStatus(0);
  //       setTitle(notify?.title);
  //       setTitle2(notify?.body);
  //       console.log(notify?.title);
  //       setClassData(notify?.data?.class);
  //       if (user?.access === 'teacher') setShowModal(true);
  //       break;
  //     case 'LESSON_START':
  //       console.log('LESSON_START ', 1);
  //       setStatus(0);
  //       setTitle(notify?.title);
  //       setTitle2(notify?.body);
  //       console.log(notify?.title);
  //       setClassData(notify?.data?.class);
  //       if (user?.access === 'teacher') setShowModal(true);
  //       break;
  //     case 'REGISTER_CLASS':
  //       console.log('REGISTER_CLASS ', 1);
  //       setStatus(0);
  //       setTitle(notify?.title);
  //       setTitle2(notify?.body);
  //       console.log(notify?.title);
  //       setClassData(notify?.data?.class);
  //       if (user?.access === 'teacher') setShowModal(true);
  //       break;
  //     case 'CLASS_IS_FULLED':
  //       console.log('CLASS_IS_FULLED ', 1);
  //       setStatus(1);
  //       setTitle(notify?.title);
  //       console.log(notify?.title);
  //       setShowModal(true);
  //       if (user?.access === 'student') setShowModal(true);
  //
  //       break;
  //     case 'USER_REQUEST':
  //       console.log('USER_REQUEST ', 1);
  //       setTitle(notify?.title);
  //       setStatus(0);
  //       setShowModal(true);
  //       break;
  //     case 'TEACHER_REQUEST':
  //       console.log('TEACHER_REQUEST ', 1);
  //       setTitle(notify?.title);
  //       setStatus(0);
  //       setShowModal(true);
  //       break;
  //     case 'TEACHER_REJECT_REQUEST':
  //       console.log('TEACHER_REJECT_REQUEST ', 1);
  //       setTitle(notify?.title);
  //       setStatus(1);
  //       setShowModal(true);
  //       break;
  //     case 'TEACHER_APPROVE_REQUEST':
  //       console.log('TEACHER_APPROVE_REQUEST', 1);
  //       setTitle(notify?.title);
  //       setStatus(0);
  //       setShowModal(true);
  //       break;
  //     default:
  //       break;
  //   }
  // }, [notify]);
  return (
    <View>
      {/* {showModal ? ( */}
      {/*  <Match */}
      {/*    data={classData} */}
      {/*    title1={title} */}
      {/*    title2={title2} */}
      {/*    status={status} */}
      {/*    isModalVisible={showModal} */}
      {/*    action={toogleModal} */}
      {/*  /> */}
      {/* ) : null} */}
    </View>
  );
};

export default ActionNotification;
