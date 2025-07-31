'use client';

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session'; // Uses sessionStorage

import authReducer from 'state/auth/authSlice';
import userReducer from 'state/auth/userSlice';
import bankReducer from 'state/main/bankSlice';

// // ✅ Configuration for persisting the bank slice
// const persistConfig = {
//   key: "root",
//   storage: sessionStorage, // Uses sessionStorage (not localStorage)
//   whitelist: ["bank"], // Persist only the `bank` slice
// };

// ✅ Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  bank: bankReducer, // Only this slice will be persisted
});

// // ✅ Wrap root reducer with persistReducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Configure Redux store
export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Avoids warnings for non-serializable values
    }),
});

// ✅ Persistor to manage persistence
export const persistor = persistStore(store);

// ✅ Export types for use in the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
