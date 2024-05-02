"use client";
import CalendarSideView from "./CalendarSideView";
import React from "react";
import { SelectedDateContext } from "../utils/SelectedDateContext";
import { SelectedDateInfoContext } from "../utils/SelectedDateInfoContext";
import Calendar from "./Calendar";
import OrderForm from "./OrderForm";

export default function CalendarSection(props: { orders: any[] }) {
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [selectedDateInfo, setSelectedDateInfo] = React.useState(null);

    return (
        <div className="border-lightBorder border-2 rounded-xl p-4 mb-16 bg-white overflow-y-auto">
            <SelectedDateContext.Provider value={{ selectedDate, setSelectedDate }}>
                <SelectedDateInfoContext.Provider value={{ selectedDateInfo, setSelectedDateInfo }}>
                    <div className="flex flex-col md:flex-row gap-6">
                        <Calendar orders={props.orders} />
                        <div className="border-r border-lightBorder"></div>
                        <CalendarSideView />
                    </div>
                </SelectedDateInfoContext.Provider>
            </SelectedDateContext.Provider>
            {/* <OrderForm /> */}
        </div>
    );
}
