"use client";
import { Calendar as AntdCalendar, ConfigProvider, ConfigProviderProps, CalendarProps } from "antd";
import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import "@/app/css/Calendar.css";
import Image from "next/image";
import itIT from "antd/locale/it_IT";
import "dayjs/locale/it";
import { FaPlus } from "react-icons/fa6";
import { useWindowSize } from "react-use";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store/store';
import { setLoading } from "../features/loading/loadingSlice";
import { setSelectedDate } from "../features/selectedDate/selectedDateSlice";
import { setSelectedDateOrders } from "../features/selectedDateOrders/selectedDateOrdersSlice";
import { setAddModal } from "../features/addModal/addModalSlice";

type Locale = ConfigProviderProps["locale"];

dayjs.locale("it");

export default function Calendar(props: { orders: any[] }) {
    const dispatch = useDispatch();
    const loading = useSelector((state: RootState) => state.loading.value);
    useEffect(() => {
        dispatch(setLoading(false));
    }, [dispatch]);
    const selectedDate = useSelector((state: RootState) => state.selectedDate.value)

    const selectedDateOrdersUnparsed = useSelector((state: RootState) => state.selectedDateOrders.value);
    const selectedDateOrders = Object.keys(selectedDateOrdersUnparsed).length > 0 ? JSON.parse(selectedDateOrdersUnparsed as string) : [];
    const infoIsEmpty = selectedDateOrders && Object.keys(selectedDateOrders).length === 0;

    const [locale] = useState<Locale>(itIT);

    const { width } = useWindowSize();
    const baseSize = 10;
    const increaseStart = 476;
    const increaseEnd = 556;
    const divisor = 20;
    let iconSize = baseSize;
    if (width > increaseStart && width <= increaseEnd) {
        iconSize = baseSize + (width - increaseStart) / divisor;
    } else if (width > increaseEnd) {
        iconSize = baseSize + (increaseEnd - increaseStart) / divisor;
    }

    const getListData = (value: Dayjs): { type: string; content: string; status: string }[] => {
        const ordersOnThisDay = props.orders.filter((order) => value.isSame(order.deliveryDate, "day"));
        return ordersOnThisDay.map((order) => ({
            type: "order",
            content: order.photo,
            status: order.soldStatus,
        }));
    };

    const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value);
        return (
            <ul className="events gap-2 flex flex-row">
                {listData.length === 0 && (
                    <div className="hover-add-button text-center aspect-square w-full p-[2px]" onClick={
                        () => {
                            dispatch(setAddModal(true));
                        }
                    }>
                        <FaPlus size={iconSize} />
                    </div>
                )}
                {listData.map((item, index) => (
                    <li key={index}>
                        <Image src={item.content} alt="Order" width={50} height={50} className={`${item.status}`} />
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
        <div className={`calendar md:overflow-y-auto w-full min-h-[60vh] ${loading ? "flex justify-center items-center" : ""}`}>
            <ConfigProvider locale={locale}>
                <div className={`custom-loading-spinner flex justify-center items-center ${loading ? "" : "hidden"}`}>
                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-newPink-200" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                </div>
                <AntdCalendar
                    className={`bg-white ${loading ? "hidden" : ""}`}
                    cellRender={cellRender}
                    onSelect={async (date, { source }) => {
                        if (source === "date") {
                            if (selectedDate && dayjs(selectedDate).isSame(date, "day") && infoIsEmpty) {
                                // setIsAddModalVisible(true);
                            } else {
                                dispatch(setSelectedDate(date.format()));
                                const filteredOrders = props.orders.filter((order) => dayjs(order.deliveryDate).isSame(date, "day"));
                                dispatch(setSelectedDateOrders(JSON.stringify(filteredOrders)));
                            }
                        }
                    }}
                />
            </ConfigProvider>
        </div>
    );
}

// DONE: use context to set loading to the antd buttons too
// DONE: use next/image for image optimization
// TODO: rename selectedDateOrders to selectedDateOrders