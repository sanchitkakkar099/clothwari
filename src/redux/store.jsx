import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import {
//   authApi,
// } from "../service";
import designSlice from "./designSlice";
import designerSlice from "./designerSlice";


const appReducer = combineReducers({
  designState: designSlice,
  designerState: designerSlice,
//   [authApi.reducerPath]: authApi.reducer,
});

export const store = configureStore({
  reducer: appReducer,
//   middleware: (getDefaltMiddleware) =>
//     getDefaltMiddleware({ serializableCheck: false }).concat([
//       authApi.middleware,
//       courseApi.middleware,

//     ]),
});