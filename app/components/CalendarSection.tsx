"use client";
import CalendarSideView from "./CalendarSideView";
import React from "react";
import Calendar from "./Calendar";
import OrderForm from "./OrderForm";
import GlobalConfig from "@/app/app.config";
import Greetings from "./Greetings";
import SignOutButton from "./SignOutButton";
import { Provider } from "react-redux";
import { store } from "../store/store";

const defaultLanguage = GlobalConfig.i18n.defaultLanguage || "en";
const gc = GlobalConfig.i18n.translations[defaultLanguage as keyof typeof GlobalConfig.i18n.translations]?.dashboard;

export default function CalendarSection(props: { orders: any[] }) {
    return (
        <>
            <Provider store={store}>
                <div className="header flex flex-row justify-between">
                    <div className="title font-bold text-2xl select-none">{gc?.title}</div>
                    <div className="order-form">
                        <OrderForm label={"Add Order"} />
                    </div>
                </div>
                <div className="text-lg greeting mb-2 opacity-80" suppressHydrationWarning>
                    <Greetings />
                </div>
                <div className="calendar-section border-lightBorder border-2 rounded-xl p-4 mt-2 mb-2 flex flex-col md:flex-row gap-2 md:gap-8 md:h-[calc(100vh-10rem)] bg-white">
                    <Calendar orders={props.orders} />
                    <CalendarSideView orders={props.orders} />
                </div>
                <SignOutButton />
            </Provider>
        </>
    );
}

// DONE: make images in calendar square
// DONE: branch to clean code
// DONE: use redux for state management
// DONE: AddModalContext to redux