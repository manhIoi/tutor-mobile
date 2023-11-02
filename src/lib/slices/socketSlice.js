import {createSlice} from '@reduxjs/toolkit';
import {pushLocalNotificationChat} from '../../api/notification';

const initialState = {
  chatLog: [],
  newNotification: {},
  displayNewMessage: false,
  socketId: '',
  currentChatGroup: '',
  preChatGroup: '',
  currentUser: {},
};

const socketSlice = createSlice({
  name: 'socket',
  initialState: initialState,
  reducers: {
    updateNewMessage: (state, action) => {
      if (
        action.payload?._id &&
        action.payload._id !== state.newNotification?._id
      ) {
        state.newNotification = action.payload;
        state.displayNewMessage = true;
        if (
          action?.payload?.group !== state.currentChatGroup &&
          action?.payload?.from?.type !== state.currentUser?.access &&
          state.currentUser?.notify
        ) {
          console.log('currentUser', state.currentUser?.notify);
          pushLocalNotificationChat(action?.payload);
        }
      }
    },
    displayedNewMessage: (state, action) => {
      state.displayNewMessage = false;
    },
    setSocketId: (state, action) => {
      state.socketId = action.payload;
    },
    updateCurrentChatGroup: (state, action) => {
      state.preChatGroup = state.currentChatGroup;
      state.currentChatGroup = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

export const {
  updateNewMessage,
  displayedNewMessage,
  setSocketId,
  updateCurrentChatGroup,
  setCurrentUser,
} = socketSlice.actions;
export default socketSlice.reducer;

// async action
