import { configureStore, combineReducers } from "@reduxjs/toolkit";
import designUploadSlice from "./designUploadSlice";
import designerSlice from "./designerSlice";
import categorySlice from "./categorySlice";
import tagSlice from "./tagSlice";
import clientSlice from "./clientSlice";

import { authApi, categoryApi, clientApi, designTagApi, designUploadApi, designerApi, fileApi } from "../service";

const appReducer = combineReducers({
  designUploadState: designUploadSlice,
  designerState: designerSlice,
  categoryState: categorySlice,
  tagState: tagSlice,
  clientState: clientSlice,
  [authApi.reducerPath]: authApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [designTagApi.reducerPath]: designTagApi.reducer,
  [designUploadApi.reducerPath]: designUploadApi.reducer,
  [fileApi.reducerPath]: fileApi.reducer,
  [designerApi.reducerPath]: designerApi.reducer,
  [clientApi.reducerPath]: clientApi.reducer,
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
      clientApi.middleware,
    ]),
});