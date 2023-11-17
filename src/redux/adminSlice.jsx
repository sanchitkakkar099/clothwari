import { createSlice } from "@reduxjs/toolkit";

const initState = {
  adminList: [],
  staffApprovalList:[]
};

export const adminSlice = createSlice({
  name: "admin",
  initialState: initState,
  reducers: {
    getAdmin: (state, { payload }) => {
      state.adminList = payload;
    },
    getStaffApprovalList: (state, { payload }) => {
      state.staffApprovalList = payload;
    },
  },
});

export const {
  getAdmin,
  getStaffApprovalList
} = adminSlice.actions;

export default adminSlice.reducer;
