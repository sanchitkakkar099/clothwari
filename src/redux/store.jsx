import { configureStore, combineReducers } from "@reduxjs/toolkit";
import designUploadSlice from "./designUploadSlice";
import designerSlice from "./designerSlice";
import categorySlice from "./categorySlice";
import tagSlice from "./tagSlice";
import clientSlice from "./clientSlice";

import { adminApi, authApi, categoryApi, clientApi, designTagApi, designUploadApi, designerApi, fileApi } from "../service";
import authSlice from "./authSlice";
import adminSlice from "./adminSlice";

const appReducer = combineReducers({
  authState: authSlice,
  adminState: adminSlice,
  designUploadState: designUploadSlice,
  designerState: designerSlice,
  categoryState: categorySlice,
  tagState: tagSlice,
  clientState: clientSlice,
  [authApi.reducerPath]: authApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
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
      adminApi.middleware,
      categoryApi.middleware,
      designTagApi.middleware,
      designUploadApi.middleware,
      fileApi.middleware,
      designerApi.middleware,
      clientApi.middleware,
    ]),
});