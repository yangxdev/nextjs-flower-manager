"use client";
import React from 'react';
import dayjs from 'dayjs';

export const SelectedDateContext = React.createContext({
    selectedDate: dayjs().format(),
    setSelectedDate: (date: dayjs.Dayjs) => {},
});

// moved functionality to Redux