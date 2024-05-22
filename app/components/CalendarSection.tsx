"use client";
import CalendarSideView from "./CalendarSideView";
import React, { useEffect } from "react";
import Calendar from "./Calendar";
import OrderForm from "./OrderForm";
import GlobalConfig from "@/app/app.config";
import Greetings from "./Greetings";
import SignOutButton from "./SignOutButton";
import { Provider } from "react-redux";
import { store } from "../store/store";
import Image from "next/image";
import Draggable from "react-draggable";
import { useCookies } from "react-cookie";

const defaultLanguage = GlobalConfig.i18n.defaultLanguage || "en";
const gc = GlobalConfig.i18n.translations[defaultLanguage as keyof typeof GlobalConfig.i18n.translations]?.dashboard;

export default function CalendarSection(props: { orders: any[] }) {
    const [cookies, setCookies] = useCookies(["iconPosition"]);
    useEffect(() => {
        console.log("cookies", cookies.iconPosition);
    }, [cookies]);

    // if (cookies.iconPosition === undefined) setCookies("iconPosition", JSON.stringify({ x: 220, y: -20 }));
    const defaultIconPosition = cookies.iconPosition ? cookies.iconPosition : { x: 220, y: -20 };
    // BUG: icon position not aligned after page loading

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
                <div className="calendar-section border-lightBorder border-2 rounded-xl p-4 mt-2 mb-2 flex flex-col md:flex-row gap-2 md:gap-8 md:h-[calc(100vh-10rem)] bg-white relative">
                    {/* <div className="div absolute z-10 left-[24px] -top-[7px] transform -scale-x-100">
                        <Image
                            className=""
                            src="/others/capy_side.png"
                            alt="capybara"
                            width={40}
                            height={40}
                        ></Image>
                    </div> */}
                    <Draggable
                        key={cookies.iconPosition.x + "," + cookies.iconPosition.y}
                        defaultPosition={defaultIconPosition}
                        onStop={(e, data) => {
                            setCookies("iconPosition", JSON.stringify({ x: data.x, y: data.y }));
                        }}
                    >
                        <div className="capy cursor-pointer absolute z-10" style={{}}>
                            <Image src="/others/capy_front.png" alt="capybara" width={40} height={40}></Image>
                        </div>
                    </Draggable>
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
