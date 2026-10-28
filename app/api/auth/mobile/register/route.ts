import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { evaluateLegalAccess, normalizeCountry, CURRENT_LEGAL_VERSIONS, REQUIRED_CONSENT_DOCUMENTS } from '@/app/lib/legal/policy';
import { isLegalLocale } from '@/app/lib/legal/policy';
import { getJwtSecret } from '@/app/lib/jwt-secret';

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));

        const { name, password, username, securityAnswer, age, country, termsAccepted, privacyAccepted, locale = 'es' } = body;
        const email = body.email?.toLowerCase();

        // Validation
        if (!email) return NextResponse.json({ message: 'El email es requerido' }, { status: 400 });
        if (!password) return NextResponse.json({ message: 'La contraseña es requerida' }, { status: 400 });
        if (!name) return NextResponse.json({ message: 'El nombre es requerido' }, { status: 400 });
        if (!username) return NextResponse.json({ message: 'El nombre de usuario es requerido' }, { status: 400 });
        if (termsAccepted !== true || privacyAccepted !== true) return NextResponse.json({ message: 'Debes aceptar los términos y la política de privacidad' }, { status: 400 });
        const parsedAge = Number(age);
        const normalizedCountry = normalizeCountry(country);
        const legalAccess = evaluateLegalAccess(normalizedCountry, parsedAge);
        if (!legalAccess.allowed) return NextResponse.json({ message: legalAccess.reason === 'AGE_RESTRICTED' ? 'No cumples la edad mínima aplicable a tu país' : 'Tu país no está habilitado todavía' }, { status: 400 });
        if (!isLegalLocale(locale)) return NextResponse.json({ message: 'Idioma legal no válido' }, { status: 400 });
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
        const newUser = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
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
                age: parsedAge,
                country: normalizedCountry,
                preferredLanguage: locale,
              },
            });
            await tx.legalConsent.createMany({
                data: REQUIRED_CONSENT_DOCUMENTS.map((document) => ({
                    userId: user.id,
                    document,
                    version: CURRENT_LEGAL_VERSIONS[document],
                    locale,
                    country: normalizedCountry,
                    source: 'mobile',
                })),
            });
            return user;
        });

        // Generate JWT Token for immediate login
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            getJwtSecret(),
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

    } catch (error: unknown) {
        console.error('Mobile Registration Error:', error);
        return NextResponse.json(
            {
                message: 'Error interno del servidor al crear usuario',
            },
            { status: 500 }
        );
    }
}
