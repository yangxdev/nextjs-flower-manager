"use client";
import CalendarSideView from "./CalendarSideView";
import React, { useEffect } from "react";
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
import { AddModalContext } from "../utils/AddModalContext";

const defaultLanguage = GlobalConfig.i18n.defaultLanguage || "en";
const gc = GlobalConfig.i18n.translations[defaultLanguage as keyof typeof GlobalConfig.i18n.translations]?.dashboard;

export default function CalendarSection(props: { orders: any[] }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateInfo, setSelectedDateInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    useEffect(() => {
        console.log("orders", props.orders);
    }, [props.orders]);

    return (
        <>
            <LoadingStateContext.Provider value={{ loading, setLoading }}>
                <SelectedDateContext.Provider value={{ selectedDate, setSelectedDate }}>
                    <SelectedDateInfoContext.Provider value={{ selectedDateInfo, setSelectedDateInfo }}>
                        <AddModalContext.Provider value={{ isAddModalVisible, setIsAddModalVisible }}>
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
                                <Calendar orders={props.orders} />
                                <CalendarSideView orders={props.orders} />
                                {/* </ScrollContext.Provider> */}
                                {/* <OrderForm /> */}
                            </div>
                            <SignOutButton />
                        </AddModalContext.Provider>
                    </SelectedDateInfoContext.Provider>
                </SelectedDateContext.Provider>
            </LoadingStateContext.Provider>
        </>
    );
}

// DONE: make images in calendar square

// TODO: branch to clean code
// TODO: use redux for state management