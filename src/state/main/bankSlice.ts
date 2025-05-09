"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Bank } from "types/Bank.interface";

interface BankState {
  banks: Bank[];
}

const initialState: BankState = {
  banks: [],
};

const bankSlice = createSlice({
  name: "banks",
  initialState,
  reducers: {
    setBanks: (state, action: PayloadAction<Bank[]>) => {
      state.banks = action.payload;
    },
    addBank: (state, action: PayloadAction<Bank>) => {
      state.banks.push(action.payload)
    },
  },
});

export const { setBanks,addBank } = bankSlice.actions;

export default bankSlice.reducer;
