import { createSlice } from "@reduxjs/toolkit";

const initState = {
  tagList: [],
  selectedTagList: [],
  selectedDate: '',
  searchData: ''
};

export const tagSlice = createSlice({
  name: "tag",
  initialState: initState,
  reducers: {
    getTag: (state, { payload }) => {
      state.tagList = payload;
    },
    setTagList: (state, { payload }) => {
      state.tagList = [...state?.tagList,payload];
    },
    getSelectedTagList: (state,  { payload }) =>{
      state.selectedTagList = payload;
    },
    setSelectedTagList: (state, { payload }) => {
      state.selectedTagList = payload;
    },
    getSelectedDate: (state,  { payload }) =>{
      state.selectedDate = payload;
    },
    setSelectedDate: (state, { payload }) => {
      state.selectedDate = payload;
    },
    getSearchData: (state,  { payload }) =>{
      state.searchData = payload;
    },
    setSearchData: (state, { payload }) => {
      state.searchData = payload;
    },


  },
});

export const {
  getTag,
  setTagList,
  getSelectedTagList,
  setSelectedTagList,
  getSelectedDate,
  setSelectedDate,
  getSearchData,
  setSearchData
} = tagSlice.actions;

export default tagSlice.reducer;
