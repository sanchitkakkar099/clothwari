import { createSlice } from "@reduxjs/toolkit";

const initState = {
  designerList: [],
};

export const designerSlice = createSlice({
  name: "designer",
  initialState: initState,
  reducers: {
    getDesigner: (state, { payload }) => {
      state.designerList = payload;
    },
  },
});

export const {
  getDesigner
} = designerSlice.actions;

export default designerSlice.reducer;
