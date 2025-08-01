'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SingUp } from 'types/Auth.types';

/**
 * Interface for user state
 */
interface UserState {
  /** Current user data or null if not set */
  user: SingUp | null | undefined;
}

/**
 * Initial state for user slice
 */
const initialState: UserState = {
  user: null,
};

/**
 * Redux slice for user state management
 */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * Sets the user state
     * @param state Current user state
     * @param action Payload containing user data or null
     */
    setUser: (state, action: PayloadAction<SingUp | null  | undefined>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
