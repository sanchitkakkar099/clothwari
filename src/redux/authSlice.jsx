import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const initState = {
    userInfo: cookies?.get('clothwari_user'), // for user object
    userToken: cookies?.get('clothwari'), // for storing the JWT
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
  },
});

export const {
  setUserToken,
  setUserInfo,
  getUserToken,
  getUserInfo
} = authSlice.actions;

export default authSlice.reducer;
