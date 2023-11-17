import { createSlice } from "@reduxjs/toolkit";

const initState = {
  colorVariationList: [],
};

export const colorVariationSlice = createSlice({
  name: "colorVariation",
  initialState: initState,
  reducers: {
    getColorVariation: (state, { payload }) => {
      state.colorVariationList = payload;
    },
  },
});

export const {
  getColorVariation,
} = colorVariationSlice.actions;

export default colorVariationSlice.reducer;
