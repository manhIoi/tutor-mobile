import {createSlice} from '@reduxjs/toolkit';
import {callApi} from '../../utils/apiCaller.util';
import {USER_TOKEN} from '../../utils/auth.util';
import {login, logoutUser} from '../../api/users';

const initialState = {
  user: {},
  isUserLogged: false,
  balance: 0,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    getUser: (state, action) => {
      state.user = action.payload;
      state.isUserLogged = true;
    },
    logout: (state) => initialState,
    updateBalance: (state, action) => {
      state.balance = action.payload;
    },
  },
});

// get State
export const selectUser = (state) => state.auth.user;
export const selectIsUserlogged = (state) => state.auth.isUserLogged;

export const {getUser, logout, updateBalance} = authSlice.actions;
export default authSlice.reducer;

// async action

export const checkUser = () => async (dispatch) => {
  const userLoggedIn = await callApi('/users/profile', 'get');
  return dispatch(getUser(userLoggedIn));
};

export const loginUserAsync = (user) => async (dispatch) => {
  const userLoggedIn = await login(user);
  await USER_TOKEN.set(userLoggedIn.token);
  await USER_TOKEN.setTokenImage(userLoggedIn.token);
  return dispatch(getUser(userLoggedIn));
};
export const logoutAsync = () => async (dispatch) => {
  // const userLogout = await logoutUser();
  await USER_TOKEN.delete();
  await USER_TOKEN.deleteTokenImage();
  return dispatch(logout());
};
export const setUser = (data) => async (dispatch) => {
  if (data.token) {
    await USER_TOKEN.set(data.token);
    await USER_TOKEN.setTokenImage(data.token);
  }
  return dispatch(getUser(data.user));
};
