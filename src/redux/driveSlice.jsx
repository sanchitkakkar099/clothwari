import { createSlice, current } from "@reduxjs/toolkit";
const initState = {
  currentPage:1,
  driveList: [],
};

export const driveSlice = createSlice({
  name: "drive",
  initialState: initState,
  reducers: {
    getDrive: (state, { payload }) => {
      state.driveList = payload;
    },
    getCurrentPage: (state, { payload }) => {
      state.currentPage = payload;
    }
  },
});

export const {
  getDrive,
  getCurrentPage
} = driveSlice.actions;

export default driveSlice.reducer;
