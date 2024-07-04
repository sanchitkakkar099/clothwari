import { createSlice } from "@reduxjs/toolkit";

const initState = {
  colorVariationList: [],
  selectedColorVariationListDesign: [],
};

export const colorVariationSlice = createSlice({
  name: "colorVariation",
  initialState: initState,
  reducers: {
    getColorVariation: (state, { payload }) => {
      state.colorVariationList = payload;
    },
    setSelectedColorVariationListDesign: (state, { payload }) => {
      state.selectedColorVariationListDesign = payload;
    },
  },
});

export const {
  getColorVariation,
  setSelectedColorVariationListDesign
} = colorVariationSlice.actions;

export default colorVariationSlice.reducer;
