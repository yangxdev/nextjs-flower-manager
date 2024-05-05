"use client";
import { Calendar as AntdCalendar, ConfigProvider } from "antd";
import { SelectedDateContext } from "../utils/SelectedDateContext";
import { SelectedDateInfoContext } from "../utils/SelectedDateInfoContext";
import React, { useEffect, useRef, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { BadgeProps, CalendarProps } from "antd";
import { Badge } from "antd";
import "@/app/css/Calendar.css";
import { ScrollContext } from "../utils/ScrollContext";
import Image from "next/image";

export default function Calendar(props: { orders: any[] }) {
    const { setSelectedDate } = React.useContext(SelectedDateContext);
    const { setSelectedDateInfo } = React.useContext(SelectedDateInfoContext);

    // const topViewRef = useRef<HTMLDivElement>(null);
    // const { setTopViewRef } = React.useContext(ScrollContext);

    // useEffect(() => {
    //     setTopViewRef(topViewRef);
    // }, []);

    const getListData = (value: Dayjs) => {
        //console.log(props.orders);
        const ordersOnThisDay = props.orders.filter((order) => value.isSame(order.deliveryDate, "day"));
        return ordersOnThisDay.map((order) => ({
            type: "order",
            // content: order.customerName
            content: order.photo,
            status: order.soldStatus,
        }));
    };

    const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value);
        return (
            <ul className="events gap-2 flex flex-row">
                {listData.map((item, index) => (
                    <li key={index}>
                        <Image
                            src={item.content}
                            alt="Order"
                            width={50}
                            height={50}
                            className={`${item.status}`}
                        />
                    </li>
                ))}
            </ul>
        );
    };

    // DONE: use next/image for image optimization

    const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
        if (info.type === "date") return dateCellRender(current);
        return info.originNode;
    };

    return (
        <div
        className="calendar md:overflow-y-auto w-full"
        //  ref={topViewRef}
        >
            <ConfigProvider>
                <AntdCalendar
                    cellRender={cellRender}
                    onSelect={async (date, { source }) => {
                        if (source === "date") {
                            setSelectedDate(date);
                            const filteredOrders = props.orders.filter((order) => dayjs(order.deliveryDate).isSame(date, "day"));
                            setSelectedDateInfo(filteredOrders);
                        }
                    }}
                />
            </ConfigProvider>
        </div>
    );
}
