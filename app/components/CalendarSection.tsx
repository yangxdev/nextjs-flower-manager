"use client";
import { Calendar as AntdCalendar } from "antd";
import CalendarSideView from "./CalendarSideView";
import React from "react";
import { SelectedDateContext } from "../utils/SelectedDateContext";
import Calendar from "./Calendar";
import { PrismaClient } from "@prisma/client";

export default function CalendarSection(props: { orders: any[] }) {
    // a calendar component, it shows a calendar containing future orders (not implemented yet)
    // only current month is shown
    const [selectedDate, setSelectedDate] = React.useState(null);

    return (
        <div className="border-lightBorder border-2 rounded-xl p-4 bg-white">
            <SelectedDateContext.Provider value={{ selectedDate, setSelectedDate }}>
                <div className="flex flex-row gap-6">
                    <Calendar orders={props.orders} />
                    <div className="border-r border-lightBorder"></div> {/* Divider */}
                    <CalendarSideView />
                </div>
            </SelectedDateContext.Provider>
        </div>
    );
}
