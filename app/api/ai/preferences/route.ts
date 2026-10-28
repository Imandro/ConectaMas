import { NextResponse } from 'next/server';
import { getApiUser } from '@/app/lib/api-auth';
import { prisma } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

function unauthorized() {
    return NextResponse.json({ code: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
}

export async function GET(request: Request) {
    const user = await getApiUser(request, { aiContextEnabled: true, aiContextConsentAt: true });
    if (!user) return unauthorized();
    return NextResponse.json({
        contextEnabled: user.aiContextEnabled,
        consentedAt: user.aiContextConsentAt?.toISOString() || null,
    }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PATCH(request: Request) {
    const user = await getApiUser(request, { id: true });
    if (!user) return unauthorized();
    const body = await request.json().catch(() => ({})) as { contextEnabled?: unknown };
    if (typeof body.contextEnabled !== 'boolean') {
        return NextResponse.json({ code: 'INVALID_CONTEXT_SETTING' }, { status: 400 });
    }

    const updated = await prisma.user.update({
        where: { id: user.id },
        data: {
            aiContextEnabled: body.contextEnabled,
            ...(body.contextEnabled ? { aiContextConsentAt: new Date() } : {}),
        },
        select: { aiContextEnabled: true, aiContextConsentAt: true },
    });
    return NextResponse.json({
        contextEnabled: updated.aiContextEnabled,
        consentedAt: updated.aiContextConsentAt?.toISOString() || null,
    }, { headers: { 'Cache-Control': 'no-store' } });
}
