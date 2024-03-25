import { createSlice } from "@reduxjs/toolkit";

const initState = {
  salesPersonList: [],
};

export const salesPersonSlice = createSlice({
  name: "salesPerson",
  initialState: initState,
  reducers: {
    getSalesPerson: (state, { payload }) => {
      state.salesPersonList = payload;
    },
  },
});

export const {
  getSalesPerson
} = salesPersonSlice.actions;

export default salesPersonSlice.reducer;
