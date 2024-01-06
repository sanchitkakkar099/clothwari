import { createSlice } from "@reduxjs/toolkit";

const initState = {
  designUploadList: [],
  designUploadView: null,
  designUploadEdit: null,
  uploadProgress:null,
  uploadTag:null
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
    setUploadProgress:(state,{payload}) => {
      state.uploadProgress = payload;
    },
    setUploadTag:(state,{payload}) => {
      state.uploadTag = payload;
    }
  },
});

export const {
  getDesignUpload,
  setDesignUploadView,
  setDesignUploadEdit,
  setUploadProgress,
  setUploadTag
} = designSlice.actions;

export default designSlice.reducer;
