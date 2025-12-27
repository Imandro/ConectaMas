import { auth } from '@/app/lib/auth';
import jwt from 'jsonwebtoken';
import { prisma } from '@/app/lib/prisma';

export async function getApiUser(req?: Request) {
    // 1. Try NextAuth Session (Web)
    try {
        const session = await auth();
        if (session?.user?.email) {
            const user = await prisma.user.findUnique({
                where: { email: session.user.email }
            });
            if (user) return user;
        }
    } catch (e) {
        console.error("Session auth fail:", e);
    }

    // 2. Try JWT Header (Mobile)
    if (req) {
        const authHeader = req.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback_secret') as any;
                if (decoded && decoded.userId) {
                    const user = await prisma.user.findUnique({
                        where: { id: decoded.userId }
                    });
                    if (user) return user;
                }
            } catch (e) {
                console.error("JWT auth fail:", e);
            }
        }
    }

    return null;
}
