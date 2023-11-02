import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
} from 'react-native';
import {Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import ConfigStyle from '../../theme/ConfigStyle';
import TopicHeader from './TopicHeader';
import Card from './Card';
import Styles from '../../theme/MainStyles';
import ModalGooglePlace from '../common/ModalGooglePlace';
import {updateProfile} from '../../api/users';
import {checkUser} from '../../lib/slices/authSlice';

const Form = (props) => {
  const [showModalGG, setShowModalGG] = useState(false);

  function handleHideModalGG() {
    setShowModalGG(false);
  }

  function handleFocusInput() {
    setShowModalGG(true);
  }

  return (
    <View>
      <View
        style={{
          marginHorizontal: 20,
          marginTop: 30,
        }}
      >
        <TopicHeader title={props.title}
number={props.number} />
        <View style={Styles.flexRow}>
          {/* <RenderItem selected={props?.selected} data={props?.data} /> */}
        </View>

        <TouchableOpacity
          onPress={() => {
            // handleChange();
            handleFocusInput();
          }}
          style={{marginLeft: 5, marginVertical: 15}}
        >
          <Image
            source={require('../../assets/images/profile/iconLocation.png')}
            style={styles.image}
          />
          <View style={styles.dropdownTitle}>
            <Text
              numberOfLines={1}
              style={{
                justifyContent: 'center',
                bottom: 10,
                fontSize: ConfigStyle.title3,
              }}
            >
              {props?.value?.address?.value?.desc || props.title}
            </Text>
            {props.showBox ? (
              <Icon
                name="down"
                style={{
                  color: 'black',
                  position: 'absolute',
                  right: 0,
                  bottom: 10,
                }}
              />
            ) : (
              <Icon
                name="right"
                style={{
                  color: 'black',
                  position: 'absolute',
                  right: 0,
                  bottom: 10,
                }}
              />
            )}
          </View>
          {showModalGG ? (
            <ModalGooglePlace
              visible={showModalGG}
              text={props?.value?.address?.value?.desc}
              setAddress={(value) => props.action('address', value)}
              onHideModal={handleHideModalGG}
            />
          ) : null}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topicText: {
    paddingHorizontal: ConfigStyle.btnPaddingHorizontal,
    marginVertical: 5,
    backgroundColor: '#FFEDDD',
    marginRight: 8,
    // borderRadius: 5,
    borderTopRightRadius: 7,
    borderTopLeftRadius: 7,
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    paddingVertical: 2,
  },

  dropdownTitle: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingLeft: 30,
    fontSize: ConfigStyle.title3,
  },
  image: {
    width: 20,
    height: 20,
    position: 'absolute',
    left: 0,
    bottom: 10,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicWrap: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
});
export default Form;
