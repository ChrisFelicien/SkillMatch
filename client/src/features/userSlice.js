import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {},
    logoutUser: (state, action) => {}
  }
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
