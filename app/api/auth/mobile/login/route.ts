import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        console.log('Mobile Login attempt body keys:', Object.keys(body));
        const { identifier, password } = body;

        if (!identifier) {
            return NextResponse.json({ message: 'El email o usuario es requerido' }, { status: 400 });
        }
        if (!password) {
            return NextResponse.json({ message: 'La contraseña es requerida' }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier.toLowerCase() },
                    { username: { equals: identifier, mode: 'insensitive' } }
                ]
            },
        });

        if (!user || !user.passwordHash) {
            return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
            return NextResponse.json({ message: 'Contraseña incorrecta' }, { status: 401 });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.NEXTAUTH_SECRET || 'fallback_secret',
            { expiresIn: '30d' }
        );

        const { passwordHash, securityAnswer, ...userWithoutSensitiveData } = user;

        return NextResponse.json({
            user: userWithoutSensitiveData,
            token
        });

    } catch (error) {
        console.error('Mobile Login Error:', error);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    }
}
