import React from "react";
import { SelectedDateContext } from "../utils/SelectedDateContext";
import { SelectedDateInfoContext } from "../utils/SelectedDateInfoContext";

export default function CalendarSideView() {
    // when a date is selected, it will show the orders for that date on the right side
    const { selectedDate } = React.useContext(SelectedDateContext);
    const { selectedDateInfo } = React.useContext(SelectedDateInfoContext);
    if (!selectedDate) {
        return null;
    }
    const { $D, $H, $L, $M, $W, $d, $isDayjsObject, $m, $ms, $s, $u, $x, $y } = selectedDate;
    const month = Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date($y, $M, $D));
    const fullDate = `${month} ${$D}, ${$y}`;

    const selectedDateInfoArray = selectedDateInfo
        ? Object.values(selectedDateInfo).map((order: any) => ({
            customerName: order.customerName,
            customerWechatId: order.customerWechatId,
            amount: order.amount,
            photo: order.photo,
        }))
        : [];

    return (
        <div className="flex flex-col gap-4 min-w-[22rem]">
            <div className="text-2xl font-bold mt-2">{fullDate}</div>
            <div className="flex flex-row gap-4 w-full">
                <div className="flex flex-col gap-4 w-full">
                    {selectedDateInfoArray.map((order: any, index: number) => (
                        <div key={index} className="flex flex-col justify-between border-2 border-lightBorder rounded-md p-4">
                            <div className="flex flex-row">
                                <div className="font-semibold mr-2">Cliente:</div>
                                {order.customerName}
                            </div>
                            <div className="flex flex-row">
                                <div className="font-semibold mr-2">Wechat ID:</div>
                                {order.customerWechatId}
                            </div>
                            <div className="flex flex-row">
                                <div className="font-semibold mr-2">Quantità:</div>
                                {"€ "}
                                {order.amount}
                            </div>
                            <div className="flex flex-row">
                                <div className="font-semibold mr-2">Foto:</div>
                                {order.photo ? <img src={order.photo} alt="order" className="w-20 h-20" /> : "Nessuna foto"}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
