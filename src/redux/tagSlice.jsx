import { createSlice } from "@reduxjs/toolkit";

const initState = {
  currentPage:1,
  tagList: [],
  selectedTagList: [],
  selectedTagListDesign: [],
};

export const tagSlice = createSlice({
  name: "tag",
  initialState: initState,
  reducers: {
    getCurrentPage: (state, { payload }) => {
      state.currentPage = payload;
    },
    getTag: (state, { payload }) => {
      state.tagList = payload;
    },
    setTagList: (state, { payload }) => {
      state.tagList = [...state?.tagList,payload];
    },
    setSelectedTagListDesign: (state,  { payload }) =>{
      state.selectedTagListDesign = payload;
    },
    setSelectedTagList: (state, { payload }) => {
      state.selectedTagList = payload;
    },
  },
});

export const {
  getCurrentPage,
  getTag,
  setTagList,
  setSelectedTagListDesign,
  setSelectedTagList,
} = tagSlice.actions;

export default tagSlice.reducer;
