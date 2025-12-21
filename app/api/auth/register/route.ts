import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, password, username, securityAnswer } = body;
        const email = body.email?.toLowerCase();

        // Validation
        if (!email || !password || !name || !username || !securityAnswer) {
            return NextResponse.json(
                { message: 'Faltan datos requeridos (nombre, usuario, email, password, pregunta de seguridad)' },
                { status: 400 }
            );
        }

        // Check if user exists (email or username)
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
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
        // Simple hash/normalize answer (lowercase, trim) for basic security, or store as is if user wants exact match. 
        // Let's store normalized (lowercase) for UX.
        const normalizedAnswer = securityAnswer.trim().toLowerCase();

        // Create user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                username,
                passwordHash: hashedPassword,
                securityAnswer: normalizedAnswer,
                role: 'USER',
                spiritualLevel: 'Explorador',
            },
        });

        // Return success (excluding password)
        const { passwordHash, ...userWithoutPassword } = newUser;

        return NextResponse.json(
            { message: 'Usuario creado exitosamente', user: userWithoutPassword },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Registration Error:', error);
        return NextResponse.json(
            {
                message: 'Error interno del servidor al crear usuario',
                details: error.message
            },
            { status: 500 }
        );
    }
}
