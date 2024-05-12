"use client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ImageZoomState {
    value: boolean
}

const initialState: ImageZoomState = {
    value: false,
}

export const imageZoomSlice = createSlice({
    name: "imageZoom",
    initialState,
    reducers: {
        setImageZoom: (state, action: PayloadAction<boolean>) => {
            state.value = action.payload;
        },
    },
});

export const { setImageZoom } = imageZoomSlice.actions;

export default imageZoomSlice.reducer;