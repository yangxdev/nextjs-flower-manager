"use client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface selectedDateOrdersState {
    value: {},
}

const initialState: selectedDateOrdersState = {
    value: {},
}

export const selectedDateOrdersSlice = createSlice({
    name: 'selectedDateOrders',
    initialState,
    reducers: {
        setSelectedDateOrders: (state, action: PayloadAction<any>) => {
            state.value = action.payload;
        },
    },
});

export const { setSelectedDateOrders } = selectedDateOrdersSlice.actions;

export default selectedDateOrdersSlice.reducer;
