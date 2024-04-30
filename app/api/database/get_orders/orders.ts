import { prisma } from "@/app/api/_base";

export async function getAllOrders() {
    const orders = await prisma.order.findMany();
    return orders;
}