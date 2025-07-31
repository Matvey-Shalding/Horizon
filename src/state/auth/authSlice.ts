'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isPending: boolean;
}

const initialState: AuthState = {
  isPending: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setPending: (state, action: PayloadAction<boolean>) => {
      state.isPending = action.payload;
    },
  },
});

export const { setPending } = authSlice.actions;

export default authSlice.reducer;
