import { createSlice } from "@reduxjs/toolkit";

const initState = {
  dash_data: null,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: initState,
  reducers: {
    getDashboardData: (state, { payload }) => {
      state.dash_data = payload;
    },
  },
});

export const {
    getDashboardData
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
