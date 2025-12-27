import { NextRequest, NextResponse } from 'next/server';
import { devotionalsData } from '@/app/lib/devotionalsData';
import { getApiUser } from '@/app/lib/api-auth';
import { prisma } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/devotionals
 * Returns a list of devotionals. 
 * Supports ?categoryId= or ?recommended=true (based on user struggles)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const recommended = searchParams.get('recommended') === 'true';

        let results = devotionalsData;

        // Apply category filter
        if (categoryId && categoryId !== 'Todos' && categoryId !== 'Para ti') {
            results = results.filter(d => d.category === categoryId);
        }

        // Apply recommendation logic if requested
        if (recommended) {
            const user = await getApiUser(request);
            if (user) {
                const sins = user.sinsToOvercome ? JSON.parse(user.sinsToOvercome) : [];
                const problems = user.problemsFaced ? JSON.parse(user.problemsFaced) : [];
                const userStruggles = [...sins, ...problems];

                if (userStruggles.length > 0) {
                    results = results.filter(dev =>
                        userStruggles.some((struggle: string) =>
                            dev.category.toLowerCase().includes(struggle.toLowerCase()) ||
                            dev.title.toLowerCase().includes(struggle.toLowerCase())
                        )
                    );
                }
            }
        }

        // Get completed devotionals for the user to mark them in the UI
        const user = await getApiUser(request);
        let completedIds: string[] = [];
        if (user) {
            const completed = await prisma.userDevotional.findMany({
                where: { userId: user.id },
                select: { devotionalId: true }
            });
            completedIds = completed.map(c => c.devotionalId);
        }

        const data = results.map(d => ({
            ...d,
            completed: completedIds.includes(d.id)
        }));

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching devotionals:', error);
        return NextResponse.json({ error: 'Error fetching devotionals' }, { status: 500 });
    }
}
