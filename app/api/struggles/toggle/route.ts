import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUser } from '@/app/lib/api-auth';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { id, status, action, day } = await req.json();

        if (!id) {
            return NextResponse.json({ message: 'ID required' }, { status: 400 });
        }

        const user = await getApiUser(req);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Verify ownership
        const struggle = await prisma.userStruggle.findFirst({
            where: { id, userId: user.id }
        });

        if (!struggle) {
            return NextResponse.json({ message: 'Struggle not found' }, { status: 404 });
        }

        let updateData: any = {};

        if (action === 'start') {
            updateData.isStarted = true;
            updateData.currentDay = 1;
            updateData.startDate = new Date();
        } else if (action === 'complete' && day) {
            const currentCompleted = struggle.completedDays ? struggle.completedDays.split(',') : [];
            if (!currentCompleted.includes(day.toString())) {
                currentCompleted.push(day.toString());
            }
            updateData.completedDays = currentCompleted.join(',');

            // If it was the current day, increment
            if (day === struggle.currentDay && day < 7) {
                updateData.currentDay = struggle.currentDay + 1;
            } else if (day === 7) {
                updateData.status = 'vencido';
            }
        } else if (status) {
            updateData.status = status;
        }

        const updated = await prisma.userStruggle.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(updated, { status: 200 });

    } catch (error) {
        console.error('Toggle Struggle Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}
