"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SingUp } from "types/Auth.types";

interface UserState {
  user: undefined | null | SingUp;
}

const initialState: UserState = {
  user: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<null | undefined | SingUp>) {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions

export default userSlice.reducer;
