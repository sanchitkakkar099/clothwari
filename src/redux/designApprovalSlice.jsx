import { createSlice } from "@reduxjs/toolkit";

const initState = {
    currentPage:1
};

export const designApprovalSlice = createSlice({
  name: "designApproval",
  initialState: initState,
  reducers: {
    getCurrentPage: (state, { payload }) => {
      state.currentPage = payload;
    }
  },
});

export const {
    getCurrentPage
} = designApprovalSlice.actions;

export default designApprovalSlice.reducer;
