import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUserId } from '@/app/lib/api-auth';

export async function POST() {
    try {
        const userId = await getApiUserId();
        if (!userId) {
            return NextResponse.json({ success: false }, { status: 401 });
        }

        await prisma.user.update({
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
