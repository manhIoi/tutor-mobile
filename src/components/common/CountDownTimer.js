import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import Colors from '../../theme/Colors';
import Styles from '../../theme/MainStyles';
import ConfigStyle from '../../theme/ConfigStyle';

class Timer extends React.Component {
  render() {
    return (
      <Text style={{...styles.timer, ...Styles.textBold}}>
        {this.props.value}:{this.props.seconds}
      </Text>
    );
  }
}

class StartButton extends React.Component {
  render() {
    return (
      <Text
        style={{
          fontWeight: 'bold',
          color: '#42BBE3',
          cursor: 'pointer',
        }}
        onClick={this.props.onClickResend}
      >
        Resend verification code
      </Text>
    );
  }
}

class CountDownTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: '00',
      minutes: '00',
      time: 0,
      isClicked: true,
    };
    // eslint-disable-next-line no-unused-expressions
    this.secondsRemaining;
    // eslint-disable-next-line no-unused-expressions
    this.intervalHandle;
  }

  componentWillMount() {
    const {time} = this.props;
    const min = Math.floor(time / 60);
    const sec = time - min * 60;
    const seconds = sec < 10 ? `0${sec}` : sec;
    const minutes = min < 10 ? `0${min}` : min;

    this.setState({
      seconds: seconds,
      minutes: minutes,
      time: time,
    });
  }

  componentDidMount() {
    this.startFirstTimeCountDown();
  }

  tick = () => {
    const min = Math.floor(this.secondsRemaining / 60);
    const sec = this.secondsRemaining - min * 60;

    this.setState({
      minutes: min,
      seconds: sec,
    });

    if (sec < 10) {
      this.setState({
        seconds: `0${this.state.seconds}`,
      });
    }

    if (min < 10) {
      this.setState({
        minutes: `0${min.toString()}`,
      });
    } else {
      this.setState({
        minutes: min.toString(),
      });
    }

    if (min === 0 && sec === 0) {
      clearInterval(this.intervalHandle);
    }
    // eslint-disable-next-line no-plusplus
    this.secondsRemaining--;

    if (this.secondsRemaining === -1) {
      this.setState({
        isClicked: false,
      });
    }
  };

  startFirstTimeCountDown = () => {
    const time = this.state.time;
    this.secondsRemaining = time - 1;
    this.intervalHandle = setInterval(this.tick, 1000);
  };

  startCountDown = () => {
    const time = this.state.time;
    this.secondsRemaining = time - 1;
    this.intervalHandle = setInterval(this.tick, 1000);
    this.setState({
      isClicked: true,
    });
  };

  componentDidUpdate(
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS,
  ) {
    if (
      prevProps.isResend !== this.props.isResend &&
      this.props.isResend !== ''
    ) {
      this.startCountDown();
    }
  }

  onClickResend = () => {
    this.props.onCountDownClick();
  };

  render() {
    const {minutes, seconds, isClicked} = this.state;
    return (
      <View style={styles.subTitle}>
        <Text style={[styles.subTitleText, styles.textDesc]}>
          Mã xác nhận chúng tôi đã gửi cho bạn vào số điện thoại
          <Text
            style={{...styles.subTitleText, fontSize: 14, fontWeight: 'bold'}}
          >
            {' '}
            {this.props?.phoneNumber}
          </Text>
          <Text>.</Text>
        </Text>
        {isClicked ? (
          <Text style={{...styles.textResend, fontSize: 13, paddingTop: 10}}>
            {'  '}Yêu cầu mã mới sau{' '}
            <Text>
              <Timer value={minutes}
seconds={seconds} />
            </Text>
            .
          </Text>
        ) : (
          <Text
            style={{
              ...Styles.textBold,
              ...styles.textResend,
              ...styles.textResendBold,
            }}
            onPress={() => this.onClickResend()}
          >
            Yêu cầu mã mới
          </Text>
        )}
      </View>
    );
  }

  componentWillUnmount() {
    clearInterval(this.intervalHandle);
  }
}

export default CountDownTimer;

const styles = StyleSheet.create({
  subTitleText: {
    color: Colors.black3,
  },
  textResend: {
    textAlign: 'center',
  },
  textResendBold: {
    color: '#004892',
    textDecorationLine: 'underline',
    paddingTop: 2,
    paddingBottom: 5,
    paddingHorizontal: 10,
    fontSize: ConfigStyle.RF.text7,
  },
  textDesc: {
    textAlign: 'center',
  },
  timer: {
    color: '#004892',
    textAlign: 'center',
  },
});
