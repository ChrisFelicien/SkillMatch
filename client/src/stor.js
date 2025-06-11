import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";

const store = configureStore({
  reducer: {
    userState: userReducer
  }
});

export default store;
