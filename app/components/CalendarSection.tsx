"use client";
import CalendarSideView from "./CalendarSideView";
import React from "react";
import { SelectedDateContext } from "../utils/SelectedDateContext";
import { SelectedDateInfoContext } from "../utils/SelectedDateInfoContext";
import Calendar from "./Calendar";
import { useState } from "react";
import { ScrollContext } from "../utils/ScrollContext";
import OrderForm from "./OrderForm";
import GlobalConfig from "@/app/app.config";
import Greetings from "./Greetings";
import { LoadingStateContext } from "../utils/LoadingStateContext";
import SignOutButton from "./SignOutButton";

const defaultLanguage = GlobalConfig.i18n.defaultLanguage || "en";
const gc = GlobalConfig.i18n.translations[defaultLanguage as keyof typeof GlobalConfig.i18n.translations]?.dashboard;

export default function CalendarSection(props: { orders: any[] }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateInfo, setSelectedDateInfo] = useState({});
    const [loading, setLoading] = useState(true);
    // const [topViewRef, setTopViewRef] = useState<RefObject<HTMLDivElement> | null>(null);

    return (
        <>
            <LoadingStateContext.Provider value={{ loading, setLoading }}>
                <div className="header flex flex-row justify-between">
                    <div className="title font-bold text-2xl select-none">{gc?.title}</div>
                    <div className="order-form">
                        <OrderForm label={"Add Order"} />
                    </div>
                </div>
                <div className="text-lg greeting mb-2 opacity-80" suppressHydrationWarning>
                    <Greetings />
                </div>
                <div className="calendar-section border-lightBorder border-2 rounded-xl p-4 mb-16 mt-2 mb-2 flex flex-col md:flex-row gap-2 md:gap-8 md:h-[calc(100vh-10rem)] bg-white">
                    {/* <ScrollContext.Provider value={{ topViewRef: topViewRef, setTopViewRef: setTopViewRef }}> */}
                    <SelectedDateContext.Provider value={{ selectedDate, setSelectedDate }}>
                        <SelectedDateInfoContext.Provider value={{ selectedDateInfo, setSelectedDateInfo }}>
                            <Calendar orders={props.orders} />
                            <CalendarSideView orders={props.orders} />
                        </SelectedDateInfoContext.Provider>
                    </SelectedDateContext.Provider>
                    {/* </ScrollContext.Provider> */}
                    {/* <OrderForm /> */}
                </div>
                <SignOutButton />
            </LoadingStateContext.Provider>
        </>
    );
}

// DONE: make images in calendar square