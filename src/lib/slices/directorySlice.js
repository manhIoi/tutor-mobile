import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isSubmit: false,
};

const directorySlice = createSlice({
  name: 'directory',
  initialState: initialState,
  reducers: {
    submitDirectory: (state) => {
      state.isSubmit = !state.isSubmit;
    },
  },
});

// get State
export const selectIsSubmit = (state) => state.directory.isSubmit;

export const {submitDirectory} = directorySlice.actions;
export default directorySlice.reducer;

// async action
