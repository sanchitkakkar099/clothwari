import { createSlice } from "@reduxjs/toolkit";

const initState = {
  selectedFromDateDesign: '',
  selectedEndDateDesign: '',
  selectedDate: '',
  searchData: '',
  searchDataDesign: '',
  staffPageNo: 0,
  adminPageNo: 0,
  clientPageNo: 0,
  marketing: 0,
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
    setPageNo: (state, { payload }) => {
      const { view, pageNo } = payload;
      state[`${view}PageNo`] = pageNo;
    }
  },
});

export const {
  setSelectedFromDateDesign,
  setSelectedEndDateDesign,
  setSelectedDate,
  setSearchDataDesign,
  setSearchData,
  setPageNo
} = mixedSlice.actions;

export default mixedSlice.reducer;
