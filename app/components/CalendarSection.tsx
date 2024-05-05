"use client";
import CalendarSideView from "./CalendarSideView";
import React from "react";
import { SelectedDateContext } from "../utils/SelectedDateContext";
import { SelectedDateInfoContext } from "../utils/SelectedDateInfoContext";
import Calendar from "./Calendar";
import OrderForm from "./OrderForm";
import { RefObject, useState } from "react";
import { ScrollContext } from "../utils/ScrollContext";

export default function CalendarSection(props: { orders: any[] }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateInfo, setSelectedDateInfo] = useState({});
    // const [topViewRef, setTopViewRef] = useState<RefObject<HTMLDivElement> | null>(null);

    return (
        <div className="calendar-section border-lightBorder border-2 rounded-xl p-4 mb-16 bg-white mt-2 mb-2 flex flex-col md:flex-row gap-2 md:gap-8 md:h-[calc(100vh-10rem)]">
            {/* <ScrollContext.Provider value={{ topViewRef: topViewRef, setTopViewRef: setTopViewRef }}> */}
            <SelectedDateContext.Provider value={{ selectedDate, setSelectedDate }}>
                <SelectedDateInfoContext.Provider value={{ selectedDateInfo, setSelectedDateInfo }}>
                    <Calendar orders={props.orders} />
                    <CalendarSideView />
                </SelectedDateInfoContext.Provider>
            </SelectedDateContext.Provider>
            {/* </ScrollContext.Provider> */}
            {/* <OrderForm /> */}
        </div>
    );
}
