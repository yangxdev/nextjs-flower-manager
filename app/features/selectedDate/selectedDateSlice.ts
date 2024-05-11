"use client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import dayjs from 'dayjs';

export interface selectedDateState {
    value: string,
}

const initialState: selectedDateState = {
    value: dayjs().format(),
}

export const selectedDateSlice = createSlice({
    name: 'selectedDate',
    initialState,
    reducers: {
        setSelectedDate: (state, action: PayloadAction<string>) => {
            state.value = action.payload;
        },
    },
});

export const { setSelectedDate } = selectedDateSlice.actions;

export default selectedDateSlice.reducer;
