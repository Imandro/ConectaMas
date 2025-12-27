import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { identifier, password } = await req.json();

        if (!identifier || !password) {
            return NextResponse.json({ message: 'Credenciales requeridas' }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier.toLowerCase() },
                    { username: identifier }
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
