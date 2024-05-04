"use client";
import React from 'react';

export const SelectedDateInfoContext = React.createContext({
    selectedDateInfo: {},
    setSelectedDateInfo: (dateInfo: any) => {},
});
