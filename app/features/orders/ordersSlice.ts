"use client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ordersState {
    value: {},
}

const initialState: ordersState = {
    value: {},
}

export const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setOrders: (state, action: PayloadAction<any>) => {
            state.value = action.payload;
        },
    },
});

export const { setOrders } = ordersSlice.actions;

export default ordersSlice.reducer;

// TODO: type orders properly