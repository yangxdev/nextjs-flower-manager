import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { init } from "@paralleldrive/cuid2";

const createId = init({
    length: 10,
})

export async function POST(request: Request) {
    const { deliveryDate, customerName, customerWechatId, amount, productionCost, photo, soldStatus } = await request.json();
    const id = createId();
    // const userId = "cltyanrp50000rbp159e9j2i8";
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    try {
        const result = await sql`
            INSERT INTO orders (id, delivery_date, customer_name, customer_wechat_id, amount, production_cost, photo, sold_status, created_at, updated_at) 
            VALUES (${id}, ${deliveryDate}, ${customerName}, ${customerWechatId}, ${amount}, ${productionCost}, ${photo}, ${soldStatus}, ${createdAt}, ${updatedAt})`;
        
        // console.log(result);
        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}
