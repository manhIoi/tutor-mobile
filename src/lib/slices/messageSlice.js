import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isSubmit: false,
};

const messageSlice = createSlice({
  name: 'message',
  initialState: initialState,
  reducers: {
    addMessage: (state) => {
      state.isSubmit = !state.isSubmit;
    },
  },
});

// get State
export const selectIsSubmit = (state) => state.message.isSubmit;

export const {addMessage} = messageSlice.actions;
export default messageSlice.reducer;

// async action
