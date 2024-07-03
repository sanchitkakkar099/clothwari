import { createSlice } from "@reduxjs/toolkit";

const initState = {
  adminList: [],
  staffApprovalList:[],
  selectedStaffList: [],
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
    getSelectedStaffList: (state,  { payload }) =>{
      state.selectedStaffList = payload;
    },
    setSelectedStaffList: (state, { payload }) => {
      state.selectedStaffList = payload;
    },
  },
});

export const {
  getAdmin,
  getStaffApprovalList,
  getSelectedStaffList,
  setSelectedStaffList,
} = adminSlice.actions;

export default adminSlice.reducer;
