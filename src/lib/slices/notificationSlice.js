import {createSlice} from '@reduxjs/toolkit';
import {pushLocalNotification} from '../../api/notification';

const initialState = {
  notificationSelected: {},
  paymentResult: {},
  newNotifications: {},
  numberNotify: 0,
  notiUpdate: {},
};

const notificationSlice = createSlice({
  name: 'setting',
  initialState: initialState,
  reducers: {
    changeNotificationSelected: (state, action) => {
      state.notificationSelected = action.payload;
    },
    changePaymentResult: (state, action) => {
      state.paymentResult = action.payload;
    },
    updateNewNotification: (state, action) => {
      // console.log('action.payload?.notiUpdate',state.notiUpdate?.notification)
      if (action.payload?.type && state.notiUpdate?.notification) {
        state.newNotifications = action.payload;
        pushLocalNotification(action.payload);
      }
    },
    updatePayment: (state, action) => {
      state.paymentResult = action.payload;
    },
    updateNumberNotify: (state, action) => {
      state.numberNotify = action.payload;
    },
    changeNotiStatus: (state, action) => {
      state.notiUpdate = action.payload;
    },
  },
});

export const {
  changeNotificationSelected,
  changePaymentResult,
  updateNewNotification,
  clearNotification,
  updatePayment,
  updateNumberNotify,
  changeNotiStatus,
} = notificationSlice.actions;
export default notificationSlice.reducer;

// async action
