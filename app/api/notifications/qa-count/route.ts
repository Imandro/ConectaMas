import { NextResponse } from "next/server";
import { getUnreadQACount } from "@/app/dashboard/actions/notifications";
import { getApiUserId } from "@/app/lib/api-auth";

export const dynamic = 'force-dynamic';

const PRIVATE_NO_STORE_HEADERS = {
    'Cache-Control': 'private, no-store',
};

export async function GET(request: Request) {
    try {
        const userId = await getApiUserId(request);
        if (!userId) return NextResponse.json({ count: 0 }, { headers: PRIVATE_NO_STORE_HEADERS });

        const count = await getUnreadQACount(userId);
        return NextResponse.json({ count }, { headers: PRIVATE_NO_STORE_HEADERS });
    } catch (error) {
        console.error("Error in qa-count API:", error);
        return NextResponse.json({ count: 0 }, { headers: PRIVATE_NO_STORE_HEADERS });
    }
}
