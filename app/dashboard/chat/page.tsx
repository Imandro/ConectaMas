import { redirect } from 'next/navigation';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import SecondaryPageShell from '@/app/components/SecondaryUI';
import ChatView from './ChatView';

export const dynamic = 'force-dynamic';

export default async function ChatPage() {
    const session = await auth();
    if (!session?.user?.id) redirect('/auth/login');

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            name: true,
            mascot: { select: { name: true, level: true } },
            streak: { select: { currentStreak: true } },
        },
    });
    if (!user) redirect('/auth/login');

    return (
        <SecondaryPageShell>
            <ChatView
                firstName={user.name?.trim().split(/\s+/)[0] || 'amigo'}
                mascotName={user.mascot?.name || 'Llami'}
                mascotLevel={user.mascot?.level || 1}
                streak={user.streak?.currentStreak || 0}
            />
        </SecondaryPageShell>
    );
}
