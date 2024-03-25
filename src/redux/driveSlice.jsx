import { createSlice } from "@reduxjs/toolkit";

const initState = {
  driveList: [],
};

export const driveSlice = createSlice({
  name: "drive",
  initialState: initState,
  reducers: {
    getDrive: (state, { payload }) => {
      state.driveList = payload;
    },
  },
});

export const {
  getDrive
} = driveSlice.actions;

export default driveSlice.reducer;
