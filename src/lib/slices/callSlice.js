import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  localStream: null,
  remoteStream: null,
  isCalling: false,
  isFront: {
    value: true,
    update: null,
  },
  isMute: {
    value: false,
    update: null,
  },
  typeCall: {
    value: 'video',
    update: null,
  },
  onCallView: false,
  requestCall: {
    update: null,
    value: null,
  },
};

const callingSlice = createSlice({
  name: 'calling',
  initialState: initialState,
  reducers: {
    stopCall: (state) => {
      console.log('stopCall stopCall stopCall');
      state.onCallView = false;
    },
    updateOnCallView: (state, action) => {
      state.onCallView = action.payload;
    },
    updateRemoteStream: (state, action) => {
      console.log('updateRemoteStream updateRemoteStream');
      console.log(action.payload);
      state.remoteStream = action.payload;
    },
    updateLocalStream: (state, action) => {
      console.log('updateLocalStream updateLocalStream');
      console.log(action.payload);
      state.localStream = action.payload;
    },
    updateCameraSide: (state, action) => {
      console.log(`action.payload == ${action.payload}`);
      state.isFront = {
        value: action.payload,
        update: Date.now(),
      };
    },
    updateStateMute: (state, action) => {
      state.isMute = {
        value: action.payload,
        update: Date.now(),
      };
    },
    updateTypeCall: (state, action) => {
      state.typeCall = {
        value: action.payload,
        update: Date.now(),
      };
    },
    updateIsCalling: (state, action) => {
      state.isCalling = action.payload;
    },
    updateRequestCall: (state, action) => {
      state.requestCall = {
        value: action.payload,
        update: Date.now(),
      };
    },
  },
  extraReducers: {},
});

export const {
  stopCall,
  updateOnCallView,
  updateRemoteStream,
  updateLocalStream,
  updateCameraSide,
  updateStateMute,
  updateTypeCall,
  updateIsCalling,
  updateRequestCall,
} = callingSlice.actions;

export default callingSlice.reducer;

// async action
