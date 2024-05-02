import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
// import { init } from "@paralleldrive/cuid2";

export async function POST(request: Request) {
    const { id, soldStatus } = await request.json();
    // const id = createId();
    // const userId = "cltyanrp50000rbp159e9j2i8";
    // const createdAt = new Date().toISOString();
    // const updatedAt = new Date().toISOString();

    try {
        const result = await sql`
            UPDATE orders 
            SET sold_status = ${soldStatus}
            WHERE id = ${id}`;
        
        // console.log(result);
        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}