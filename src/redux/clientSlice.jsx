import { createSlice } from "@reduxjs/toolkit";

const initState = {
  clientList: [],
};

export const clientSlice = createSlice({
  name: "client",
  initialState: initState,
  reducers: {
    getClient: (state, { payload }) => {
      state.clientList = payload;
    },
  },
});

export const {
  getClient
} = clientSlice.actions;

export default clientSlice.reducer;
