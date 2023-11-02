import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isChecked: false,
};

const classManagerSlice = createSlice({
  name: 'classManager',
  initialState: initialState,
  reducers: {
    changeState: (state) => {
      state.isChecked = !state.isChecked;
      console.log(`Slice${  state.isChecked}`);
    },
  },
});

const {reducer, actions} = classManagerSlice;
export const {changeState} = actions;
export default reducer;
