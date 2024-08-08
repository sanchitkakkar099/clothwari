import { createSlice, current } from "@reduxjs/toolkit";

const initState = {
  currentPage:1,
  categoryList: [],
  selectedCategoryList: [],
  selectedCategoryListDesign: [],
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
    setSelectedCategoryListDesign: (state,  { payload }) =>{
      state.selectedCategoryListDesign = payload;
    },
    setSelectedCategoryList: (state, { payload }) => {
      state.selectedCategoryList = payload;
    },
    getCurrentPage: (state, { payload }) =>{
      state.currentPage = payload;
    }
  },
});

export const {
  getCategory,
  setCategoryList,
  setSelectedCategoryListDesign,
  setSelectedCategoryList,
  getCurrentPage
} = categorySlice.actions;

export default categorySlice.reducer;
