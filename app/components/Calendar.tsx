"use client";
import { Calendar as AntdCalendar } from "antd";
import { SelectedDateContext } from "../utils/SelectedDateContext";
import { SelectedDateInfoContext } from "../utils/SelectedDateInfoContext";
import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { BadgeProps, CalendarProps } from "antd";
import { Badge } from "antd";

export default function Calendar(props: { orders: any[] }) {
    const { setSelectedDate } = React.useContext(SelectedDateContext);
    const { setSelectedDateInfo } = React.useContext(SelectedDateInfoContext);

    const getListData = (value: Dayjs) => {
        const ordersOnThisDay = props.orders.filter((order) => value.isSame(order.deliveryDate, "day"));
        return ordersOnThisDay.map((order) => ({ type: "order", content: order.customerName }));
    };

    const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value);
        return (
            <ul className="events">
                {listData.map((item, index) => (
                    <li key={index}>
                        <Badge status={item.type as BadgeProps["status"]} text={item.content} />
                    </li>
                ))}
            </ul>
        );
    };

    const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
        if (info.type === "date") return dateCellRender(current);
        return info.originNode;
    };

    return (
        <>
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
        </>
    );
}
