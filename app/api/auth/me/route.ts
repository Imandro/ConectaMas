import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getApiUser } from '@/app/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const user = await getApiUser(req);

        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { passwordHash, securityAnswer, ...userWithoutSensitiveData } = user;

        return NextResponse.json(userWithoutSensitiveData);

    } catch (error) {
        console.error('Auth Me Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}
