import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { apiMiddleware } from "redux-api-middleware";
import reducers, { RootStoreState } from "./reducers";

const store = configureStore({
  reducer: reducers,
  middleware: [...getDefaultMiddleware<RootStoreState>(), apiMiddleware],
  devTools: process.env.NODE_ENV !== "production"
});

export default store;
