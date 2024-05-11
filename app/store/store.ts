"use client";
import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "../features/loading/loadingSlice";
import selectedDateReducer from "../features/selectedDate/selectedDateSlice";
// import selectedDateInfoReducer from "../features/selectedDateInfo/selectedDateInfoSlice";
// import selectedAddModalReducer from "../features/selectedAddModal/selectedAddModalSlice";

export const store = configureStore({
    reducer: {
        loading: loadingReducer,
        selectedDate: selectedDateReducer,
        // selectedDateInfo: selectedDateInfoReducer,
        // selectedAddModal: selectedAddModalReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;