import { createSlice } from "@reduxjs/toolkit";

const initState = {
  adminList: [],
};

export const adminSlice = createSlice({
  name: "admin",
  initialState: initState,
  reducers: {
    getAdmin: (state, { payload }) => {
      state.adminList = payload;
    },
  },
});

export const {
  getAdmin
} = adminSlice.actions;

export default adminSlice.reducer;
