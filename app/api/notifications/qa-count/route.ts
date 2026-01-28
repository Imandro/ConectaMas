import { NextResponse } from "next/server";
import { getUnreadQACount } from "@/app/dashboard/actions/notifications";

export async function GET() {
    try {
        const count = await getUnreadQACount();
        return NextResponse.json({ count });
    } catch (error) {
        console.error("Error in qa-count API:", error);
        return NextResponse.json({ count: 0 });
    }
}
