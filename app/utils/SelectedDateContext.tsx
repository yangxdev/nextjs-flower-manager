"use client";
import React from 'react';

export const SelectedDateContext = React.createContext({
    selectedDate: null,
    setSelectedDate: (date: any) => {},
});
