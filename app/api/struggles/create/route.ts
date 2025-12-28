import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUser } from '@/app/lib/api-auth';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const user = await getApiUser(req);

        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { title } = await req.json();

        if (!title) {
            return NextResponse.json({ message: 'Title is required' }, { status: 400 });
        }

        // --- LIMITES DE RECURSOS (FREE TIER OPTIMIZATION) ---
        if (title.length > 50) return NextResponse.json({ message: 'Título demasiado largo (máx 50)' }, { status: 400 });

        const count = await prisma.userStruggle.count({
            where: { userId: user.id, status: 'ACTIVE' }
        });

        if (count >= 10) {
            return NextResponse.json({ message: 'Has alcanzado el límite de 10 luchas activas' }, { status: 429 });
        }
        // ---------------------------------------------------

        const struggle = await prisma.userStruggle.create({
            data: {
                userId: user.id,
                title,
                status: 'ACTIVE',
                startDate: new Date(),
            }
        });

        return NextResponse.json(struggle, { status: 201 });

    } catch (error) {
        console.error('Create Struggle Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}
