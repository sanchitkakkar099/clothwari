import { createSlice } from "@reduxjs/toolkit";

const initState = {
  clientList: [],
  selectedBagItems:[]
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
  },
});

export const {
  getClient,
  addedBagItems,
  removeBagItems,
  clearBagItems
} = clientSlice.actions;

export default clientSlice.reducer;
