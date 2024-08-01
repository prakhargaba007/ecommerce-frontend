import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import profileReducer from "./slices/profileReducer";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    profile: profileReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
