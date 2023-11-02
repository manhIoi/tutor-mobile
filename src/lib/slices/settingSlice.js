import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isDarkMode: false,
};

const settingSlice = createSlice({
  name: 'setting',
  initialState: initialState,
  reducers: {
    changeMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
  },
});

// get State
export const selectThemeMode = (state) => state.setting.isDarkMode;

export const {changeMode} = settingSlice.actions;
export default settingSlice.reducer;

// async action
