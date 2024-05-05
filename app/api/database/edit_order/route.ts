import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { orderId, deliveryDate, customerName, customerWechatId, advance, amount, productionCost, photo, soldStatus } = await request.json();
    const updatedAt = new Date().toISOString();
    console.log(orderId, deliveryDate, customerName, customerWechatId, advance, amount, productionCost, photo, soldStatus, updatedAt);

    try {
        const result = await sql`
            UPDATE public."orders" 
            SET delivery_date = ${deliveryDate}, 
                customer_name = ${customerName}, 
                customer_wechat_id = ${customerWechatId}, 
                advance = ${advance}, 
                amount = ${amount}, 
                production_cost = ${productionCost}, 
                photo = ${photo}, 
                sold_status = ${soldStatus}, 
                updated_at = ${updatedAt}
            WHERE id = ${orderId}`;

        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}
