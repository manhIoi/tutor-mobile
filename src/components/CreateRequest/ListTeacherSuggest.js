import React, {useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {Text} from 'react-native-elements';
import BoxShadow from '../common/BoxShadow';
import ImageUtil from '../../utils/images.util';
import Styles from '../../theme/MainStyles';
import ArrowGrey from '../../assets/images/svg/arrow-grey.svg';
import AvatarInfo from '../common/AvatarInfo';
import IconCheck from '../../assets/images/svg/icon-check.svg';
import IconUnCheck from '../../assets/images/svg/icon-uncheck.svg';
import config from '../../../config/config';
import Colors from '../../theme/Colors';

const ListTeacherSuggest = (props) => {
  const contentRight = (item) => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
      }}
    >
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('DetailTutor', {_id: item?._id})
        }
      >
        <Animated.View
          style={{
            transform: [
              {
                rotate: '-90deg',
              },
            ],
            paddingTop: 8,
            paddingHorizontal: 10,
            paddingBottom: 6,
          }}
        >
          <ArrowGrey />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );

  function handleChange(id) {
    if (!props.disabled) {
      const selected = props.selected || [];
      const index = selected?.indexOf(id);
      if (index === -1) {
        selected.push(id);
        props.handleChange(selected);
      } else {
        selected.splice(index, 1);
        props.handleChange(selected);
      }
    }
  }

  function formatContent(data) {
    let str = '';
    if (Array.isArray(data) && data.length) {
      data.map((item, index) => {
        if (index + 1 < data.length) {
          str += ` ${item.name},`;
        } else {
          str += ` ${item.name}`;
        }
      });
    }
    return str;
  }

  const renderItem = ({item}) => (
    <TouchableWithoutFeedback
      onPress={() => handleChange(item?._id)}
      disabled={props.disabled}
    >
      <View style={{...Styles.flexRowCenterVertical, marginBottom: 5}}>
        <View style={styles.wrapTicker}>
          {props.selected?.indexOf(item._id) !== -1 ? (
            <IconCheck width={16}
height={16} />
          ) : (
            <IconUnCheck width={16}
height={16} />
          )}
        </View>

        <BoxShadow style={{...styles.wrapBoxTeacher, flex: 1}}>
          <AvatarInfo
            source={{
              uri: `${config.IMAGE_MD_URL}${item?.avatar?.medium}`,
            }}
            size={72}
            data={{
              fullName: item?.fullName,
              rate: item?.rate,
            }}
            showStar={true}
            content={formatContent(item.subject)}
            contentRight={contentRight(item)}
            containerStyle={styles.containerStyle}
            titleStyle={Styles.textBold}
          />
        </BoxShadow>
      </View>
    </TouchableWithoutFeedback>
  );
  return (
    <View>
      {!props.isBusy ? (
        props.data?.length ? (
          <FlatList data={props.data || []}
renderItem={renderItem} />
        ) : (
          <Text style={styles.textEmpty}>Không có giáo viên phù hợp</Text>
        )
      ) : (
        <View style={{marginBottom: 15}}>
          <ActivityIndicator color={Colors.orange} />
        </View>
      )}
    </View>
  );
};
export default ListTeacherSuggest;
const styles = StyleSheet.create({
  wrapBoxTeacher: {
    paddingLeft: 18,
    paddingRight: 10,
  },
  wrapTicker: {
    marginHorizontal: 10,
  },
  textEmpty: {
    color: Colors.black3,
    textAlign: 'center',
    marginBottom: 10,
  },
});
