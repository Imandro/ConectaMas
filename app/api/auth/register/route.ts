import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        // Validation
        if (!email || !password || !name) {
            return NextResponse.json(
                { message: 'Faltan datos requeridos (nombre, email, password)' },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'El usuario ya existe con este email' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
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

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json(
            { message: 'Error interno del servidor al crear usuario' },
            { status: 500 }
        );
    }
}
