import { prisma } from "@/app/api/_base";

export async function getAllOrders() {
    try {
        const orders = await prisma.order.findMany();
        return orders;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Failed to fetch orders");
    }
}