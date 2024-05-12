"use client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface selectedDateInfoState {
    value: {},
}

const initialState: selectedDateInfoState = {
    value: {},
}

export const selectedDateInfoSlice = createSlice({
    name: 'selectedDateInfo',
    initialState,
    reducers: {
        setSelectedDateInfo: (state, action: PayloadAction<any>) => {
            state.value = action.payload;
        },
    },
});

export const { setSelectedDateInfo } = selectedDateInfoSlice.actions;

export default selectedDateInfoSlice.reducer;
