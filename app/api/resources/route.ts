import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/resources - Get all resources with optional filtering
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const type = searchParams.get('type');
        const limit = parseInt(searchParams.get('limit') || '50');

        const where: any = {};

        if (category) {
            where.category = category;
        }

        if (type) {
            where.type = type;
        }

        const resources = await prisma.resource.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });

        return NextResponse.json({ resources });
    } catch (error) {
        console.error('Error fetching resources:', error);
        return NextResponse.json(
            { error: 'Error al cargar recursos' },
            { status: 500 }
        );
    }
}

// POST /api/resources/[id]/download - Track resource download
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        await prisma.resource.update({
            where: { id },
            data: {
                downloadCount: {
                    increment: 1,
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking download:', error);
        return NextResponse.json(
            { error: 'Error al registrar descarga' },
            { status: 500 }
        );
    }
}
