import { configureStore, combineReducers, createAction } from "@reduxjs/toolkit";
import designUploadSlice from "./designUploadSlice";
import designApprovalSlice from "./designApprovalSlice"
import designerSlice from "./designerSlice";
import categorySlice from "./categorySlice";
import colorVariationSlice from "./colorVariationSlice";
import tagSlice from "./tagSlice";
import clientSlice from "./clientSlice";
import dashboardSlice from "./dashboardSlice";
import salesPersonSlice from "./salesPersonSlice";
import authSlice from "./authSlice";
import adminSlice from "./adminSlice";
import mixedSlice from "./mixedSlice";
import { adminApi, authApi, categoryApi, clientApi, clientBagApi, colorVariationApi, dashboardApi, designTagApi, designUploadApi, designerApi, driveApi, fileApi, salesPersonApi } from "../service";
import driveSlice from "./driveSlice";
import Cookies from "universal-cookie";
const cookies = new Cookies()

const appReducer = combineReducers({
  authState: authSlice,
  adminState: adminSlice,
  designUploadState: designUploadSlice,
  designApprovalState: designApprovalSlice,
  designerState: designerSlice,
  categoryState: categorySlice,
  colorVariationState: colorVariationSlice,
  tagState: tagSlice,
  mixedState: mixedSlice,
  clientState: clientSlice,
  dashboardState: dashboardSlice,
  salesPersonState: salesPersonSlice,
  driveState: driveSlice,
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
  [salesPersonApi.reducerPath]: salesPersonApi.reducer,
  [driveApi.reducerPath]: driveApi.reducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_STATE') {
    // Reset the entire state to undefined, which should trigger default initial states
    state = {};
  }

  return appReducer(state, action);
};

// Custom middleware to handle unauthorized responses
const unauthorizedMiddleware = (store) => (next) => (action) => {
  if (
    action?.payload?.status === 401
  ) {
    cookies.remove("clothwari");
    cookies.remove("clothwari_user");
    cookies.remove("client_allow_time");
    cookies.remove("isLoggedIn");
    cookies.remove("lastActiveTime");
    cookies.remove("savedTimerValue");
    store.dispatch({type:'RESET_STATE'});
  }

  return next(action);
};

export const store = configureStore({
  reducer: rootReducer,
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
      salesPersonApi.middleware,
      driveApi.middleware,
    ]).concat([
      unauthorizedMiddleware, // Add custom middleware
    ]),
});