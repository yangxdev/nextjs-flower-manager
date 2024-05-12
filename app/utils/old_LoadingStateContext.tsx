"use client";
import React from 'react';

export const LoadingStateContext = React.createContext({
    loading: true,
    setLoading: (loading: boolean) => {},
});
