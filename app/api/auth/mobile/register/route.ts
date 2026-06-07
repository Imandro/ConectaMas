import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        console.log('Mobile Registration attempt body keys:', Object.keys(body));

        const { name, password, username, securityAnswer } = body;
        const email = body.email?.toLowerCase();

        // Validation
        if (!email) return NextResponse.json({ message: 'El email es requerido' }, { status: 400 });
        if (!password) return NextResponse.json({ message: 'La contraseña es requerida' }, { status: 400 });
        if (!name) return NextResponse.json({ message: 'El nombre es requerido' }, { status: 400 });
        if (!username) return NextResponse.json({ message: 'El nombre de usuario es requerido' }, { status: 400 });
        // securityAnswer optional or required? Repo sends it.

        // Check if user exists (email or username)
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: { equals: username, mode: 'insensitive' } } // Case insensitive check
                ]
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'El usuario o email ya existe' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const normalizedAnswer = securityAnswer ? securityAnswer.trim().toLowerCase() : '';

        // Create user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                username: username, // Store as provided (or lowercase if preferred)
                passwordHash: hashedPassword,
                securityAnswer: normalizedAnswer,
                role: 'USER',
                spiritualLevel: 'Explorador',
                hasCompletedOnboarding: false,
                hasSeenLlamiTutorial: false,
            },
        });

        // Generate JWT Token for immediate login
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            process.env.NEXTAUTH_SECRET || 'fallback_secret',
            { expiresIn: '30d' }
        );

        // Return success with token
        const { passwordHash, ...userWithoutPassword } = newUser;

        return NextResponse.json(
            {
                message: 'Usuario creado exitosamente',
                user: userWithoutPassword,
                token: token
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Mobile Registration Error:', error);
        return NextResponse.json(
            {
                message: 'Error interno del servidor al crear usuario',
                details: error.message
            },
            { status: 500 }
        );
    }
}
