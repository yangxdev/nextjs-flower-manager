"use client";
import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "../features/loading/loadingSlice";
import selectedDateReducer from "../features/selectedDate/selectedDateSlice";
import selectedDateOrdersReducer from "../features/selectedDateOrders/selectedDateOrdersSlice";
import ordersReducer from "../features/orders/ordersSlice";
import addModalReducer from "../features/addModal/addModalSlice";
import imageZoomReducer from "../features/imageZoom/imageZoomSlice";
import imageZoomSourceReducer from "../features/imageZoomSource/imageZoomSourceSlice";

export const store = configureStore({
    reducer: {
        loading: loadingReducer,
        selectedDate: selectedDateReducer,
        selectedDateOrders: selectedDateOrdersReducer,
        orders: ordersReducer,
        addModal: addModalReducer,
        imageZoom: imageZoomReducer,
        imageZoomSource: imageZoomSourceReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;