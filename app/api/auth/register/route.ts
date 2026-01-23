import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        console.log('Registration attempt body keys:', Object.keys(body));

        const { name, password, username, securityAnswer } = body;
        const email = body.email?.toLowerCase();

        // Validation
        if (!email) return NextResponse.json({ message: 'El email es requerido' }, { status: 400 });
        if (!password) return NextResponse.json({ message: 'La contraseña es requerida' }, { status: 400 });
        if (!name) return NextResponse.json({ message: 'El nombre es requerido' }, { status: 400 });
        if (!username) return NextResponse.json({ message: 'El nombre de usuario es requerido' }, { status: 400 });
        if (!securityAnswer) return NextResponse.json({ message: 'La respuesta de seguridad es requerida' }, { status: 400 });

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
