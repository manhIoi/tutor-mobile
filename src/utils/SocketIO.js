
import config from "../../config/config";
import io from 'socket.io-client';
import Toast from 'react-native-toast-message';
import {USER_TOKEN, SOCKET_ID} from './auth.util';
import ConfigStyle from '../theme/ConfigStyle';

class Socket {
    constructor(host) {
        this.host = host;
        this.socket = null;
    }

    connect() {
        if (this.socket !== null) return;
        const host = this.host;
        const socket = io.connect(host);
        this.socket = socket;
        socket.on('connect', async () => {
            console.info(`🔥LOGGER::  socketId`, socket.id);
            SOCKET_ID.set(socket.id);
        });
    }

    disconnect() {
        this.socket.disconnect();
        this.socket = null;
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

    emit(event, data) {
        const socket = this.socket;
        socket.emit(event, data)
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


export default new Socket(config.SOCKET_HOST)
