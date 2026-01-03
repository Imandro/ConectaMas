import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUser } from '@/app/lib/api-auth';

export async function GET(req: Request) {
    try {
        const user = await getApiUser(req);
        if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const [dbUser, messages] = await Promise.all([
            prisma.user.findUnique({
                where: { id: user.id },
                select: {
                    friends: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true,
                            spiritualLevel: true
                        }
                    }
                }
            }),
            prisma.supportMessage.findMany({
                where: { receiverId: user.id },
                include: {
                    sender: {
                        select: {
                            id: true,
                            name: true,
                            image: true
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
        const user = await getApiUser(req);
        if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { action, query, friendId, message, messageId, username } = body;

        if (action === 'SEARCH') {
            const users = await prisma.user.findMany({
                where: {
                    OR: [
                        { username: { contains: query } },
                        { name: { contains: query } }
                    ],
                    NOT: { id: user.id }
                },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
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
            if (targetId === user.id) return NextResponse.json({ message: 'No puedes agregarte a ti mismo' }, { status: 400 });

            await Promise.all([
                prisma.user.update({
                    where: { id: user.id },
                    data: { friends: { connect: { id: targetId } } }
                }),
                prisma.user.update({
                    where: { id: targetId },
                    data: { friends: { connect: { id: user.id } } }
                })
            ]);
            return NextResponse.json({ success: true });
        }

        if (action === 'REMOVE') {
            await prisma.$transaction([
                prisma.user.update({
                    where: { id: user.id },
                    data: { friends: { disconnect: { id: friendId } } }
                }),
                prisma.user.update({
                    where: { id: friendId },
                    data: { friends: { disconnect: { id: user.id } } }
                })
            ]);
            return NextResponse.json({ success: true });
        }

        if (action === 'SEND_SUPPORT') {
            if (!message || message.length > 100) return NextResponse.json({ message: 'Mensaje inválido' }, { status: 400 });
            await prisma.supportMessage.create({
                data: {
                    senderId: user.id,
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
