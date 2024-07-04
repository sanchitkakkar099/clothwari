import { createSlice } from "@reduxjs/toolkit";

const initState = {
  adminList: [],
  staffApprovalList:[],
  selectedStaffList: [],
  selectedStaffListDesign: [],
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
    setSelectedStaffListDesign: (state,  { payload }) =>{
      state.selectedStaffListDesign = payload;
    },
    setSelectedStaffList: (state, { payload }) => {
      state.selectedStaffList = payload;
    },
  },
});

export const {
  getAdmin,
  getStaffApprovalList,
  setSelectedStaffListDesign,
  setSelectedStaffList,
} = adminSlice.actions;

export default adminSlice.reducer;
