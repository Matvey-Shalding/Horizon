'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bank } from 'types/Bank.interface';

/**
 * Interface for the bank state
 * @interface BankState
 */
interface BankState {
  /** Array of bank objects */
  banks: Bank[];
}

/**
 * Initial state for the bank slice
 */
const initialState: BankState = {
  banks: [],
};

/**
 * Redux slice for managing bank state
 */
const bankSlice = createSlice({
  name: 'banks',
  initialState,
  reducers: {
    /**
     * Sets the entire banks array
     * @param state - Current bank state
     * @param action - Payload with array of banks
     */
    setBanks: (state, action: PayloadAction<Bank[]>) => {
      state.banks = action.payload;
    },
    /**
     * Adds a single bank to the banks array
     * @param state - Current bank state
     * @param action - Payload with a single bank object
     */
    addBank: (state, action: PayloadAction<Bank>) => {
      state.banks.push(action.payload);
    },
  },
});

/** Exported actions for the bank slice */
export const { setBanks, addBank } = bankSlice.actions;

/** Default export of the bank reducer */
export default bankSlice.reducer;
