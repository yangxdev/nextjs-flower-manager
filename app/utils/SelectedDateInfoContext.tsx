"use client";
import React from 'react';

export const SelectedDateInfoContext = React.createContext({
    selectedDateInfo: null,
    setSelectedDateInfo: (_dateInfo: any) => {},
});
