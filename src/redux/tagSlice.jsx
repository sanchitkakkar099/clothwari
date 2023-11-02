import { createSlice } from "@reduxjs/toolkit";

const initState = {
  tagList: [],
};

export const tagSlice = createSlice({
  name: "tag",
  initialState: initState,
  reducers: {
    getTag: (state, { payload }) => {
      state.tagList = payload;
    },
    setTagList: (state, { payload }) => {
      console.log('payload',[...state?.tagList,payload],payload);
      state.tagList = [...state?.tagList,payload];
    },
  },
});

export const {
  getTag,
  setTagList
} = tagSlice.actions;

export default tagSlice.reducer;
