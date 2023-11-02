import { createSlice } from "@reduxjs/toolkit";

const initState = {
  categoryList: [],
};

export const categorySlice = createSlice({
  name: "category",
  initialState: initState,
  reducers: {
    getCategory: (state, { payload }) => {
      state.categoryList = payload;
    },
    setCategoryList: (state, { payload }) => {
      console.log('payload',[...state?.categoryList,payload],payload);
      state.categoryList = [...state?.categoryList,payload];
    },
  },
});

export const {
  getCategory,
  setCategoryList
} = categorySlice.actions;

export default categorySlice.reducer;
