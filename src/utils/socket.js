import io from 'socket.io-client';
import Toast from 'react-native-toast-message';
import {USER_TOKEN, SOCKET_ID} from './auth.util';
import ConfigStyle from '../theme/ConfigStyle';

export default class Socket {
  constructor(host) {
    this.host = host;
  }

  connect() {
    const host = this.host;
    const socket = io.connect(host, {transports: ['websocket']});
    this.socket = socket;
    this.authenticate(socket);
  }

  authenticate(socket) {
    socket.on('connect', async () => {
      SOCKET_ID.set(socket.id);
      await this.sendAuthenticate(socket);

      socket.on('unauthorized', () => {
        console.log('unauthorized');
        Toast.show({
          ...ConfigStyle.toastDefault,
          type: 'error',
          text1: 'Disconnect socket',
        });
        socket.disconnect();
      });
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  /**
   * Send authentication to server
   */
  async sendAuthenticate(socket) {
    const token = await USER_TOKEN.get();
    if (socket?.connected === true && token) {
      const authData = {
        jwt: token,
      };
      socket.emit('authentication', authData);
    }
  }

  /**
   * Listen an event
   * @param event
   * @param cb
   */
  on(event, cb) {
    const socket = this.socket;
    socket.on(event, cb);
  }

  /**
   * Remove event listener
   * @param event
   * @param cb
   */

  off(event, cb) {
    const socket = this.socket;
    socket.off(event, cb);
  }
}
