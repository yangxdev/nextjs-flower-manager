"use client";
import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "../features/loading/loadingSlice";
import selectedDateReducer from "../features/selectedDate/selectedDateSlice";
import selectedDateInfoReducer from "../features/selectedDateInfo/selectedDateInfoSlice";
import ordersReducer from "../features/orders/ordersSlice";
import addModalReducer from "../features/addModal/addModalSlice";

export const store = configureStore({
    reducer: {
        loading: loadingReducer,
        selectedDate: selectedDateReducer,
        selectedDateInfo: selectedDateInfoReducer,
        orders: ordersReducer,
        addModal: addModalReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;