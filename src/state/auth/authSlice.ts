'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Interface for the authentication state
 * @interface AuthState
 */
interface AuthState {
  /** Indicates if an authentication action is pending */
  isPending: boolean;
}

/**
 * Initial state for the auth slice
 */
const initialState: AuthState = {
  isPending: false,
};

/**
 * Redux slice for authentication state management
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Sets the pending status of authentication
     * @param state - Current auth state
     * @param action - Payload with boolean value for isPending
     */
    setPending: (state, action: PayloadAction<boolean>) => {
      state.isPending = action.payload;
    },
  },
});

/** Exported actions for the auth slice */
export const { setPending } = authSlice.actions;

/** Default export of the auth reducer */
export default authSlice.reducer;
