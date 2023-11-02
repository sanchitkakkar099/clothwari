import { createSlice } from "@reduxjs/toolkit";

const initState = {
  designUploadList: [],
  designUploadView: null,
  designUploadEdit: null,
};

export const designSlice = createSlice({
  name: "design",
  initialState: initState,
  reducers: {
    getDesignUpload: (state, { payload }) => {
      state.designUploadList = payload;
    },
    setDesignUploadView: (state, { payload }) => {
      state.designUploadView = payload;
    },
    setDesignUploadEdit: (state, { payload }) => {
      state.designUploadEdit = payload;
    },
  },
});

export const {
  getDesignUpload,
  setDesignUploadView,
  setDesignUploadEdit,
} = designSlice.actions;

export default designSlice.reducer;
