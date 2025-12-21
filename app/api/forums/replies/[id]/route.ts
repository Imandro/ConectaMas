import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

const prismaClient = prisma as any;

// DELETE /api/forums/replies/[id] - Delete a reply (author or admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prismaClient.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const reply = await prismaClient.forumReply.findUnique({
            where: { id: params.id }
        });

        if (!reply) {
            return NextResponse.json({ error: 'Reply not found' }, { status: 404 });
        }

        // Check ownership or admin role
        if (reply.userId !== user.id && user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prismaClient.forumReply.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting reply:', error);
        return NextResponse.json({ error: 'Error deleting reply' }, { status: 500 });
    }
}
