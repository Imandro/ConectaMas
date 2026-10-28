import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUserId } from '@/app/lib/api-auth';

export async function GET(req: Request) {
    try {
        const userId = await getApiUserId(req);
        if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const [dbUser, messages] = await Promise.all([
            prisma.user.findUnique({
                where: { id: userId },
                select: {
                    friends: {
                        select: {
                            id: true,
                            name: true,
                            username: true,

                            spiritualLevel: true
                        }
                    }
                }
            }),
            prisma.supportMessage.findMany({
                where: { receiverId: userId },
                include: {
                    sender: {
                        select: {
                            id: true,
                            name: true,

                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: 10
            })
        ]);

        return NextResponse.json({
            friends: dbUser?.friends || [],
            messages: messages || []
        });

    } catch (error) {
        console.error('Friends Load Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const userId = await getApiUserId(req);
        if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { action, query, friendId, message, messageId, username } = body;

        if (action === 'SEARCH') {
            const users = await prisma.user.findMany({
                where: {
                    OR: [
                        { username: { contains: query } },
                        { name: { contains: query } }
                    ],
                        NOT: { id: userId }
                },
                select: {
                    id: true,
                    name: true,
                    username: true,

                    spiritualLevel: true
                },
                take: 10
            });
            return NextResponse.json(users);
        }

        if (action === 'ADD') {
            let targetId = friendId;
            if (username) {
                const target = await prisma.user.findUnique({ where: { username: username.replace('@', '') } });
                if (!target) return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
                targetId = target.id;
            }

            if (!targetId) return NextResponse.json({ message: 'ID missing' }, { status: 400 });
            if (targetId === userId) return NextResponse.json({ message: 'No puedes agregarte a ti mismo' }, { status: 400 });

            await Promise.all([
                prisma.user.update({
                    where: { id: userId },
                    data: { friends: { connect: { id: targetId } } }
                }),
                prisma.user.update({
                    where: { id: targetId },
                    data: { friends: { connect: { id: userId } } }
                })
            ]);
            return NextResponse.json({ success: true });
        }

        if (action === 'REMOVE') {
            await prisma.$transaction([
                prisma.user.update({
                    where: { id: userId },
                    data: { friends: { disconnect: { id: friendId } } }
                }),
                prisma.user.update({
                    where: { id: friendId },
                    data: { friends: { disconnect: { id: userId } } }
                })
            ]);
            return NextResponse.json({ success: true });
        }

        if (action === 'SEND_SUPPORT') {
            if (!message || message.length > 100) return NextResponse.json({ message: 'Mensaje inválido' }, { status: 400 });
            await prisma.supportMessage.create({
                data: {
                    senderId: userId,
                    receiverId: friendId,
                    message: message
                }
            });
            return NextResponse.json({ success: true });
        }

        if (action === 'MARK_READ') {
            await prisma.supportMessage.update({
                where: { id: messageId },
                data: { read: true }
            });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ message: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Friends Action Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}
