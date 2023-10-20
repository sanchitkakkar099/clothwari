import { createSlice } from "@reduxjs/toolkit";

const initState = {
  designerList: [],
};

export const designerSlice = createSlice({
  name: "designer",
  initialState: initState,
  reducers: {
    setDesignerList: (state, { payload }) => {
      console.log('payload',[...state?.designerList,payload],payload);
      state.designerList = [...state?.designerList,payload];
    },
  },
});

export const {
  setDesignerList
} = designerSlice.actions;

export default designerSlice.reducer;
