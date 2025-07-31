'use client';

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';
import authReducer from 'state/auth/authSlice';
import userReducer from 'state/auth/userSlice';
import bankReducer from 'state/main/bankSlice';

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
  whitelist: ['bank'], 
};

/**
 * Combined reducers for the Redux store
 */
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  bank: bankReducer,
});

/**
 * Wrap root reducer with persistence
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Configure Redux store
 */
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], 
      },
    }),
});

/**
 * Persistor for managing persistence
 */
export const persistor = persistStore(store);

/**
 * Type definitions for the Redux store
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
