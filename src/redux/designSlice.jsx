import { createSlice } from "@reduxjs/toolkit";

const initState = {
  designList: [],
  productView: null,
  designEdit: null,
};

export const designSlice = createSlice({
  name: "design",
  initialState: initState,
  reducers: {
    getDesign: (state, { payload }) => {
      state.designList = payload;
    },
    setDesignView: (state, { payload }) => {
      state.productView = payload;
    },
    setDesignEdit: (state, { payload }) => {
      state.designEdit = payload;
    },
    setDesignList: (state, { payload }) => {
      console.log('payload',[...state?.designList,payload],payload);
      state.designList = [...state?.designList,payload];
    },
  },
});

export const {
  getDesign,
  setDesignView,
  setDesignEdit,
  setDesignList
} = designSlice.actions;

export default designSlice.reducer;
