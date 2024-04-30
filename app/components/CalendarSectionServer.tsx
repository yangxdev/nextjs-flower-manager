"use server";

import { getAllOrders } from "../api/database/get_orders/orders";
import CalendarSection from "./CalendarSection";

export default async function CalendarSectionServer() {
    const orders = await getAllOrders();

    return (
        <>
            <CalendarSection orders={orders} />
        </>
    )
}