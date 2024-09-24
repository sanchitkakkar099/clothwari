import { createSlice } from "@reduxjs/toolkit";

const initState = {
    currentPage:1,
    editedReqBy:''
};

export const designApprovalSlice = createSlice({
  name: "designApproval",
  initialState: initState,
  reducers: {
    getCurrentPage: (state, { payload }) => {
      state.currentPage = payload;
    },
    getEditedReqBy: (state, { payload }) => {
      state.editedReqBy = payload;
    }
  },
});

export const {
    getCurrentPage,
    getEditedReqBy
} = designApprovalSlice.actions;

export default designApprovalSlice.reducer;
