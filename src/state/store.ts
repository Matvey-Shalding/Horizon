'use client';

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from 'state/auth/authSlice';
import userReducer from 'state/auth/userSlice';
import bankReducer from 'state/main/bankSlice';

/**
 * Combined reducers for the Redux store
 */
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  bank: bankReducer,
});

/**
 * Configure Redux store
 */
export const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  reducer: rootReducer,
});

/**
 * Type definitions for the Redux store
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
