import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const initState = {
    userInfo: cookies?.get('clothwari_user'), // for user object
    userToken: cookies?.get('clothwari'), // for storing the JWT,
    allowTime: cookies?.get('client_allow_time'),
    loginTime: cookies?.get('client_login_time'),
    isLoggedIn: false,
    timer:0
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    setUserToken: (state, { payload }) => {
      state.userToken = payload;
    },
    setUserInfo: (state, { payload }) => {
        state.userInfo = payload;
    },
    getUserToken: (state, { payload }) => {
        state.userToken = payload;
    },
    getUserInfo: (state, { payload }) => {
        state.userInfo = payload;
    },
    setAllowTime: (state, { payload }) => {
      state.allowTime = payload;
    },
    setLoginTime: (state, { payload }) => {
      state.loginTime = payload;
    },
    setIsLoggedIn: (state, { payload }) => {
      state.isLoggedIn = payload;
    },
    setTimer: (state, { payload }) => {
      state.timer = payload;
    },
  },
});

export const {
  setUserToken,
  setUserInfo,
  getUserToken,
  getUserInfo,
  setAllowTime,
  setLoginTime,
  setIsLoggedIn,
  setTimer
} = authSlice.actions;

export default authSlice.reducer;
