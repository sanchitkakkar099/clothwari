import { createSlice, current } from "@reduxjs/toolkit";

const initState = {
  designUploadList: [],
  designUploadApprovalList: [],
  designUploadView: null,
  designUploadEdit: null,
  uploadProgress:null,
  uploadTag:null,
  currentPageV1:1,
  currentPageV2:1,
  currentPageHidden:1,
};

export const designSlice = createSlice({
  name: "design",
  initialState: initState,
  reducers: {
    getDesignUpload: (state, { payload }) => {
      state.designUploadList = payload;
    },
    getDesignUploadApproval: (state, { payload }) => {
      state.designUploadApprovalList = payload;
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
    },
    getCurrentPageV1: (state, { payload }) => {
      state.currentPageV1 = payload;
    },
    getCurrentPageV2: (state, { payload }) => {
      state.currentPageV2 = payload;
    },
    getCurrentPageHidden: (state, { payload }) => {
      state.currentPageHidden = payload;
    }
  },
});

export const {
  getDesignUpload,
  getDesignUploadApproval,
  setDesignUploadView,
  setDesignUploadEdit,
  setUploadProgress,
  setUploadTag,
  getCurrentPageV1,
  getCurrentPageV2,
  getCurrentPageHidden
} = designSlice.actions;

export default designSlice.reducer;
