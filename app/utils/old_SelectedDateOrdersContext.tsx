"use client";
import React from 'react';

export const SelectedDateOrdersContext = React.createContext({
    selectedDateOrders: {},
    setSelectedDateOrders: (dateInfo: any) => {},
});
