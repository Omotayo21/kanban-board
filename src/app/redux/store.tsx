import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./uiSlice";



const store = configureStore({
  reducer: {
    ui: uiReducer,
   
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
