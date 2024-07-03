import { createSlice } from "@reduxjs/toolkit";

const initState = {
  categoryList: [],
  selectedCategoryList: [],
};

export const categorySlice = createSlice({
  name: "category",
  initialState: initState,
  reducers: {
    getCategory: (state, { payload }) => {
      state.categoryList = payload;
    },
    setCategoryList: (state, { payload }) => {
      state.categoryList = [...state?.categoryList,payload];
    },
    getSelectedCategoryList: (state,  { payload }) =>{
      state.selectedCategoryList = payload;
    },
    setSelectedCategoryList: (state, { payload }) => {
      state.selectedCategoryList = payload;
    },
  },
});

export const {
  getCategory,
  setCategoryList,
  getSelectedCategoryList,
  setSelectedCategoryList,
} = categorySlice.actions;

export default categorySlice.reducer;
