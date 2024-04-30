"use client";
import { Calendar as AntdCalendar } from 'antd';
import { SelectedDateContext } from '../utils/SelectedDateContext';
import React from 'react';

export default function Calendar() {
    const { setSelectedDate } = React.useContext(SelectedDateContext);

    return (
        <>
            <AntdCalendar
                onSelect={(date, { source }) => {
                    if (source === "date") {
                        setSelectedDate(date);
                    }
                }}
            />
        </>
    );
}
