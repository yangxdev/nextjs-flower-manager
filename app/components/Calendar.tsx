"use client";
import { Calendar as AntdCalendar } from "antd";
import { SelectedDateContext } from "../utils/SelectedDateContext";
import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { BadgeProps, CalendarProps } from "antd";
import { Badge } from "antd";

const getListData = (value: Dayjs) => {
    let listData;
    switch (value.date()) {
        case 8:
            listData = [
                { type: "warning", content: "This is warning event." },
                { type: "success", content: "This is usual event." },
            ];
            break;
        case 10:
            listData = [
                { type: "warning", content: "This is warning event." },
                { type: "success", content: "This is usual event." },
                { type: "error", content: "This is error event." },
            ];
            break;
        case 15:
            listData = [
                { type: "warning", content: "This is warning event" },
                { type: "success", content: "This is very long usual event......" },
                { type: "error", content: "This is error event 1." },
                { type: "error", content: "This is error event 2." },
                { type: "error", content: "This is error event 3." },
                { type: "error", content: "This is error event 4." },
            ];
            break;
        default:
    }
    return listData || [];
};

const getMonthData = (value: Dayjs) => {
    if (value.month() === 8) {
        return 1394;
    }
};

export default function Calendar(props: { orders: any[] }) {
    const { setSelectedDate } = React.useContext(SelectedDateContext);
    console.log(props.orders);

    

    const monthCellRender = (value: Dayjs) => {
        const num = getMonthData(value);
        return num ? (
            <div className="notes-month">
                <section>{num}</section>
                <span>Backlog number</span>
            </div>
        ) : null;
    };

    const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value);
        return (
            <ul className="events">
                {listData.map((item) => (
                    <li key={item.content}>
                        <Badge status={item.type as BadgeProps["status"]} text={item.content} />
                    </li>
                ))}
            </ul>
        );
    };

    const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
        if (info.type === "date") return dateCellRender(current);
        if (info.type === "month") return monthCellRender(current);
        return info.originNode;
    };

    return (
        <>
            <AntdCalendar
                cellRender={cellRender}
                onSelect={(date, { source }) => {
                    if (source === "date") {
                        setSelectedDate(date);
                    }
                }}
            />
        </>
    );
}
