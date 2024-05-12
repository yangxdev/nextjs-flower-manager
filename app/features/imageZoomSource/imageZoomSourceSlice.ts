"use client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface imageZoomSourceState {
    value: string,
}

const initialState: imageZoomSourceState = {
    value: '',
}

export const imageZoomSourceSlice = createSlice({
    name: 'imageZoomSource',
    initialState,
    reducers: {
        setImageZoomSource: (state, action: PayloadAction<string>) => {
            state.value = action.payload;
        },
    },
});

export const { setImageZoomSource } = imageZoomSourceSlice.actions;

export default imageZoomSourceSlice.reducer;