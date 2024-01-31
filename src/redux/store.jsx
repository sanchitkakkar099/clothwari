import { configureStore, combineReducers } from "@reduxjs/toolkit";
import designUploadSlice from "./designUploadSlice";
import designerSlice from "./designerSlice";
import categorySlice from "./categorySlice";
import colorVariationSlice from "./colorVariationSlice";
import tagSlice from "./tagSlice";
import clientSlice from "./clientSlice";
import dashboardSlice from "./dashboardSlice";


import { adminApi, authApi, categoryApi, clientApi, clientBagApi, colorVariationApi, dashboardApi, designTagApi, designUploadApi, designerApi, fileApi } from "../service";
import authSlice from "./authSlice";
import adminSlice from "./adminSlice";

const appReducer = combineReducers({
  authState: authSlice,
  adminState: adminSlice,
  designUploadState: designUploadSlice,
  designerState: designerSlice,
  categoryState: categorySlice,
  colorVariationState: colorVariationSlice,
  tagState: tagSlice,
  clientState: clientSlice,
  dashboardState: dashboardSlice,
  [authApi.reducerPath]: authApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [designTagApi.reducerPath]: designTagApi.reducer,
  [designUploadApi.reducerPath]: designUploadApi.reducer,
  [fileApi.reducerPath]: fileApi.reducer,
  [designerApi.reducerPath]: designerApi.reducer,
  [clientApi.reducerPath]: clientApi.reducer,
  [colorVariationApi.reducerPath]: colorVariationApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
  [clientBagApi.reducerPath]: clientBagApi.reducer,

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
      colorVariationApi.middleware,
      dashboardApi.middleware,
      clientBagApi.middleware,
    ]),
});