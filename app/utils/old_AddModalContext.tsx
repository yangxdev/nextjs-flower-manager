"use client";
import React from 'react';

export const AddModalContext = React.createContext({
    isAddModalVisible: false,
    setIsAddModalVisible: (isAddModalVisible: boolean) => {},
});
