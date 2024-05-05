import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { id } = await request.json();

    try {
        const result = await sql`
            DELETE FROM public."orders"
            WHERE id = ${id}`;

        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}
