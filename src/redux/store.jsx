import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import {
//   authApi,
// } from "../service";
import designUploadSlice from "./designUploadSlice";
import designerSlice from "./designerSlice";
import categorySlice from "./categorySlice";
import tagSlice from "./tagSlice";
import { authApi, categoryApi, designTagApi, designUploadApi, designerApi, fileApi } from "../service";

const appReducer = combineReducers({
  designUploadState: designUploadSlice,
  designerState: designerSlice,
  categoryState: categorySlice,
  tagState: tagSlice,
  [authApi.reducerPath]: authApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [designTagApi.reducerPath]: designTagApi.reducer,
  [designUploadApi.reducerPath]: designUploadApi.reducer,
  [fileApi.reducerPath]: fileApi.reducer,
  [designerApi.reducerPath]: designerApi.reducer,
});

export const store = configureStore({
  reducer: appReducer,
  middleware: (getDefaltMiddleware) =>
    getDefaltMiddleware({ serializableCheck: false }).concat([
      authApi.middleware,
      categoryApi.middleware,
      designTagApi.middleware,
      designUploadApi.middleware,
      fileApi.middleware,
      designerApi.middleware,
    ]),
});