import { configureStore } from '@reduxjs/toolkit';

import authReducer from './src/lib/slices/authSlice';
import messageReducer from './src/lib/slices/messageSlice';
import settingReducer from './src/lib/slices/settingSlice';
import directoryReducer from './src/lib/slices/directorySlice';
import familyReducer from "./src/lib/slices/familySlice";
import classManagerReducer from "./src/lib/slices/classManagementSlice";
import socketReducer from './src/lib/slices/socketSlice';
import notificationReducer from './src/lib/slices/notificationSlice';
import callingSlice from './src/lib/slices/callSlice';
import subjectSlice from "./src/lib/slices/subjectSlice";
import mainSlice from "./src/lib/slices/mainSlice";
import modalSlice from './src/lib/slices/modalSlice';
import chatSlice from './src/lib/slices/chatSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    message: messageReducer,
    setting: settingReducer,
    directory: directoryReducer,
    family: familyReducer,
    classManager: classManagerReducer,
    socket: socketReducer,
    notification: notificationReducer,
    calling: callingSlice,
    subject: subjectSlice,
    main: mainSlice,
    modal: modalSlice,
    chat: chatSlice
  },
});
