import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Animated,
  Keyboard,
} from 'react-native';
import {Text} from 'react-native-elements';
import Toast from 'react-native-toast-message';
import BoxShadow from '../common/BoxShadow';
import StarIcon from "../../assets/images/svg/star.svg";
import StarGreyIcon from "../../assets/images/svg/star-grey.svg";
import BackgroundGradient from '../common/BackgroudGradient';
import Colors from '../../theme/Colors';
import Styles from '../../theme/MainStyles';
import {userCreateReviewClass, userCreateReviewTeacher} from '../../api/users';
import ConfigStyle from '../../theme/ConfigStyle';
import ButtonCustom from '../common/ButtonFooterCustom';

const CreateReview = (props) => {
  const [isBusy, setBusy] = useState(false);
  const [rate, setRate] = useState(0);
  const [content, setContent] = useState('');
  const [isFocus, setFocus] = useState(false);
  const [arrStar, setArrStar] = useState([]);
  const [msgError, setMessageError] = useState('');
  const animationSize = new Animated.Value(10);
  const animationMargin = new Animated.Value(1);
  useEffect(() => {
    formatStar(rate);
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);
  useEffect(() => {
    if (rate > 0) {
      setMessageError('');
    }
  }, [rate]);
  useEffect(() => {
    formatStar(rate);
  }, [rate]);
  useEffect(() => {
    if (isFocus) {
      Animated.parallel([
        Animated.timing(animationSize, {
          toValue: 22,
          duration: 350,
        }),
        Animated.timing(animationMargin, {
          toValue: 7,
          duration: 350,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animationSize, {
          toValue: 10,
          duration: 350,
        }),
        Animated.timing(animationMargin, {
          toValue: 1,
          duration: 350,
        }),
      ]).start();
    }
  }, [isFocus]);
  function _keyboardDidShow() {
    setFocus(true);
  }
  function _keyboardDidHide() {
    setFocus(false);
    setMessageError('');
  }
  function formatStar(number) {
    let star = Math.round(number);
    if (star < 0) {
      star = 0;
    }
    if (star > 5) {
      star = 5;
    }
    let i = 0;
    const arr = [];
    while (i < 5) {
      if (i < star) {
        arr.push(1);
      } else {
        arr.push(0);
      }
      i++;
    }
    setArrStar(arr);
  }

  function handleCreateReview() {
    if (props.type === 'class') {
      createReviewClass();
    } else {
      createReviewTeacher();
    }
  }

  async function createReviewClass() {
    try {
      if (rate === 0) {
        setMessageError('Vui lòng thực hiện đánh giá');
        return;
      }
      setBusy(true);
      const data = {
        classes: props.data?._id,
        star: rate,
        comment: content,
      };
      const response = await userCreateReviewClass(data);
      props.reloadReview();
      setBusy(false);
      if (response) {
        setRate(0);
        setContent('');
      }
    } catch (error) {
      setBusy(false);
      console.log('userCreateReviewClass ==>', error);
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

  async function createReviewTeacher() {
    try {
      if (rate === 0) {
        setMessageError('Vui lòng thực hiện đánh giá');
        return;
      }
      setBusy(true);
      if (rate === 0) {
        setMessageError('Vui lòng thực hiện đánh giá');
        return;
      }
      const data = {
        teacher: props.data?._id,
        star: rate,
        comment: content,
      };
      const response = await userCreateReviewTeacher(data);
      console.log('userCreateReviewTeacher');
      props.reloadReview();
      setBusy(false);
      if (response) {
        setRate(0);
        setContent('');
      }
    } catch (error) {
      setBusy(false);
      console.log('userCreateReviewTeacher ==>', error);
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

  const animatedStyle = {
    width: animationSize,
    height: 24,
    marginRight: animationMargin,
  };
  const rateStar = (
    <View style={styles.containerRate}>
      {arrStar.map((item, index) => {
        if (item === 1) {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setRate(index + 1)}
              disabled={!isFocus}
            >
              <Animated.View
                key={index}
                style={[styles.imageStar, animatedStyle]}
              >
                <StarIcon width={'100%'}
height={'100%'} />
              </Animated.View>
            </TouchableOpacity>
          );
        }
        return (
          <TouchableOpacity
            key={index}
            onPress={() => setRate(index + 1)}
            disabled={!isFocus}
          >
            <Animated.View
              key={index}
              style={[styles.imageStar, animatedStyle]}
            >
              <StarGreyIcon width={'100%'}
height={'100%'} />
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
  return (
    <BoxShadow style={styles.container}>
      <View style={styles.contentReview}>
        {rateStar}
        {msgError ? <Text style={styles.textError}>{msgError}</Text> : null}
        <View style={styles.wrapTextInput}>
          <TextInput
            placeholder={'Write review...'}
            style={styles.input}
            value={content}
            onChangeText={(value) => setContent(value)}
            multiline
            scrollEnabled={false}
          />
        </View>
      </View>

      <ButtonCustom
        isBusy={isBusy}
        text={'Review'}
        textBtn={{
          ...Styles.textLight,
          ...Styles.textWhite,
          fontSize: 12,
          paddingHorizontal: 15,
          paddingVertical: 3.5,
        }}
        onPress={handleCreateReview}
      />
    </BoxShadow>
  );
};

export default CreateReview;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  contentReview: {
    flex: 1,
    marginRight: 15,
    marginLeft: 10,
  },
  textPlaceholder: {
    color: Colors.grey,
  },
  wrapTextInput: {
    marginTop: 6,
  },
  wrapButton: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
  },
  input: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    maxHeight: 100,
  },
  containerRate: {
    flexDirection: 'row',
  },
  imageStar: {
    marginHorizontal: 0.5,
    width: 10,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textError: {
    color: Colors.red,
    fontStyle: 'italic',
    fontSize: 10,
    marginTop: 0,
    minHeight: 10,
  },
});
