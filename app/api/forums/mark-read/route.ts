import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';

export async function POST() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ success: false }, { status: 401 });
        }

        const userId = (session.user as any).id;

        await (prisma as any).user.update({
            where: { id: userId },
            data: {
                lastForumCheck: new Date()
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Mark Read Error:', error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
