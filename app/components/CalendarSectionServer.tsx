"use server";
import { getAllOrders } from "../api/database/get_orders/orders";
import CalendarSection from "./CalendarSection";

export default async function CalendarSectionServer() {
    const orders = await getAllOrders();
    const statusOrder: { [key: string]: number } = {
        toMake: 1,
        toSell: 2,
        sold: 3,
    };
    orders.sort((a, b) => statusOrder[a.soldStatus] - statusOrder[b.soldStatus]);

    return (
        <>
            <CalendarSection orders={orders} />
        </>
    );
}
