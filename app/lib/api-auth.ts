import { auth } from '@/app/lib/auth';
import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { prisma } from '@/app/lib/prisma';
import { hasCurrentLegalConsent } from '@/app/lib/legal/consent';
import { getJwtSecret } from '@/app/lib/jwt-secret';

type ApiIdentity = { id?: string; email?: string };

const identityCache = new WeakMap<Request, Promise<ApiIdentity | null>>();

async function resolveApiIdentity(req?: Request): Promise<ApiIdentity | null> {
    const authHeader = req?.headers.get('authorization');

    // 1. Try NextAuth Session (Web)
    if (!authHeader?.startsWith('Bearer ')) try {
        const sessionUser = (await auth())?.user as ApiIdentity | undefined;
        if (sessionUser?.id || sessionUser?.email) return sessionUser;
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') console.error("Session auth fail:", error);
    }

    // 2. Try JWT Header (Mobile)
    if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, getJwtSecret()) as { userId?: string };
                if (decoded?.userId) return { id: decoded.userId };
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') console.error("JWT auth fail:", error);
            }
    }

    return null;
}

async function getApiIdentity(req?: Request): Promise<ApiIdentity | null> {
    if (!req) return resolveApiIdentity();
    const cached = identityCache.get(req);
    if (cached) return cached;
    const pending = resolveApiIdentity(req);
    identityCache.set(req, pending);
    return pending;
}

export async function getApiUserId(req?: Request, options: { allowWithoutLegal?: boolean } = {}) {
    const identity = await getApiIdentity(req);
    if (!identity) return null;
    const user = identity.id
        ? { id: identity.id }
        : await prisma.user.findUnique({ where: { email: identity.email! }, select: { id: true } });
    if (!user?.id) return null;
    if (!options.allowWithoutLegal && !(await hasCurrentLegalConsent(user.id))) return null;
    return user.id;
}

export async function getApiUser(req?: Request, select?: Prisma.UserSelect, options: { allowWithoutLegal?: boolean } = {}) {
    const identity = await getApiIdentity(req);
    if (!identity) return null;

    const where: Prisma.UserWhereUniqueInput = identity.id
        ? { id: identity.id }
        : { email: identity.email! };
    const user = select ? await prisma.user.findUnique({ where, select }) : await prisma.user.findUnique({ where });
    if (!user || options.allowWithoutLegal) return user;
    const legalIdentity = await prisma.user.findUnique({ where, select: { id: true } });
    return legalIdentity && await hasCurrentLegalConsent(legalIdentity.id) ? user : null;
}
