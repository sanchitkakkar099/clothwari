import { createSlice } from "@reduxjs/toolkit";

const initState = {
  currentPage:1,
  salesPersonList: [],
};

export const salesPersonSlice = createSlice({
  name: "salesPerson",
  initialState: initState,
  reducers: {
    getSalesPerson: (state, { payload }) => {
      state.salesPersonList = payload;
    },
    getCurrentPage: (state, { payload }) => {
      state.currentPage = payload;
    }
  },
});

export const {
  getSalesPerson,
  getCurrentPage
} = salesPersonSlice.actions;

export default salesPersonSlice.reducer;
