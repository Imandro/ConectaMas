import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUser } from '@/app/lib/api-auth';

const prismaAny = prisma as any;

export async function PATCH(req: Request) {
    try {
        const user = await getApiUser(req);
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, action, dayNumber } = body;

        if (!id) {
            return NextResponse.json({ message: 'ID is required' }, { status: 400 });
        }

        const userStruggle = await prismaAny.userStruggle.findFirst({
            where: { id, userId: user.id }
        });

        if (!userStruggle) {
            return NextResponse.json({ message: 'Struggle not found' }, { status: 404 });
        }

        let updated;

        if (action === 'START') {
            updated = await prismaAny.userStruggle.update({
                where: { id },
                data: {
                    isStarted: true,
                    startDate: new Date()
                }
            });
        } else if (action === 'ADVANCE') {
            if (!dayNumber) return NextResponse.json({ message: 'Day number is required' }, { status: 400 });

            let completedDaysArray = userStruggle.completedDays ? userStruggle.completedDays.split(',') : [];
            if (!completedDaysArray.includes(dayNumber.toString())) {
                completedDaysArray.push(dayNumber.toString());
            }

            const nextDay = Math.min(Number(dayNumber) + 1, 21);

            updated = await prismaAny.userStruggle.update({
                where: { id },
                data: {
                    completedDays: completedDaysArray.join(','),
                    currentDay: nextDay
                }
            });
        } else if (action === 'OVERCOME') {
            updated = await prismaAny.userStruggle.update({
                where: { id },
                data: {
                    status: "vencido",
                    currentDay: 21
                }
            });
        } else if (action === 'RESET') {
            updated = await prismaAny.userStruggle.update({
                where: { id },
                data: {
                    status: "ACTIVE",
                    currentDay: 1,
                    completedDays: "",
                    isStarted: false,
                    startDate: null
                }
            });
        } else {
            return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json(updated, { status: 200 });

    } catch (error) {
        console.error('Update Struggle Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}
