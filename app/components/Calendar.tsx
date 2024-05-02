"use client";
import { Calendar as AntdCalendar, ConfigProvider } from "antd";
import { SelectedDateContext } from "../utils/SelectedDateContext";
import { SelectedDateInfoContext } from "../utils/SelectedDateInfoContext";
import React, { useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { BadgeProps, CalendarProps } from "antd";
import { Badge } from "antd";
import '@/app/css/Calendar.css';

export default function Calendar(props: { orders: any[] }) {
    const { setSelectedDate } = React.useContext(SelectedDateContext);
    const { setSelectedDateInfo } = React.useContext(SelectedDateInfoContext);

    const getListData = (value: Dayjs) => {
        console.log(props.orders);
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
                        <img src={item.content} alt="Order" className={`${item.status}`} />
                    </li>
                ))}
            </ul>
        );
    };

    // TODO: use next/image for image optimization

    const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
        if (info.type === "date") return dateCellRender(current);
        return info.originNode;
    };

    return (
        <>
            <ConfigProvider>
                <AntdCalendar
                    cellRender={cellRender}
                    onSelect={async (date, { source }) => {
                        if (source === "date") {
                            setSelectedDate(date);
                            // filter orders for the selected date
                            const filteredOrders = props.orders.filter((order) => dayjs(order.deliveryDate).isSame(date, "day"));
                            setSelectedDateInfo(filteredOrders);
                        }
                    }}
                />
            </ConfigProvider>
        </>
    );
}
