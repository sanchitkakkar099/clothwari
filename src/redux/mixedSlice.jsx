import { createSlice } from "@reduxjs/toolkit";

const initState = {
  selectedFromDateDesign: '',
  selectedEndDateDesign: '',
  selectedDate: '',
  searchData: '',
  searchDataDesign: ''
};

export const mixedSlice = createSlice({
  name: "mixed",
  initialState: initState,
  reducers: {
    setSelectedFromDateDesign: (state,  { payload }) =>{
      state.selectedFromDateDesign = payload;
    },
    setSelectedEndDateDesign: (state,  { payload }) =>{
        state.selectedEndDateDesign = payload;
    },
    setSelectedDate: (state, { payload }) => {
      state.selectedDate = payload;
    },
    setSearchDataDesign: (state,  { payload }) =>{
      state.searchDataDesign = payload;
    },
    setSearchData: (state, { payload }) => {
      state.searchData = payload;
    },
  },
});

export const {
  setSelectedFromDateDesign,
  setSelectedEndDateDesign,
  setSelectedDate,
  setSearchDataDesign,
  setSearchData
} = mixedSlice.actions;

export default mixedSlice.reducer;
