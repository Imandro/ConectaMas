import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const subscription = await req.json();

        // Save the subscription to the database
        await prisma.pushSubscription.upsert({
            where: {
                endpoint: subscription.endpoint,
            },
            update: {
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
            },
            create: {
                userId: (session.user as any).id,
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error saving subscription:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { endpoint } = await req.json();

        await prisma.pushSubscription.deleteMany({
            where: {
                endpoint: endpoint,
                userId: (session.user as any).id
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting subscription:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
