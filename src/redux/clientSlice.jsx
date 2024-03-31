import { createSlice } from "@reduxjs/toolkit";

const initState = {
  clientList: [],
  selectedBagItems:[],
  selectedPDFItems:[]
};

export const clientSlice = createSlice({
  name: "client",
  initialState: initState,
  reducers: {
    getClient: (state, { payload }) => {
      state.clientList = payload;
    },
    addedBagItems: (state, { payload }) => {
      state.selectedBagItems = [...state.selectedBagItems, payload];
    },
    removeBagItems: (state, { payload }) => {
      state.selectedBagItems =  payload;
    },
    clearBagItems: (state, { payload }) => {
      state.selectedBagItems =  payload;
    },

    addedPDFItems: (state, { payload }) => {
      state.selectedPDFItems = [...state.selectedPDFItems, payload];
    },
    removePDFItems: (state, { payload }) => {
      state.selectedPDFItems =  payload;
    },
    clearPDFItems: (state, { payload }) => {
      state.selectedPDFItems =  payload;
    },

  },
});

export const {
  getClient,
  addedBagItems,
  removeBagItems,
  clearBagItems,
  addedPDFItems,
  removePDFItems,
  clearPDFItems
} = clientSlice.actions;

export default clientSlice.reducer;
