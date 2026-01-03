import { NextResponse } from 'next/server';
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action, email, answer, newPassword } = body;

        if (action === 'check_status') {
            const user = await prisma.user.findFirst({
                where: { email: email.toLowerCase() }
            });

            if (!user) {
                return NextResponse.json({ exists: false });
            }

            return NextResponse.json({
                exists: true,
                hasSecurityAnswer: !!user.securityAnswer
            });
        }

        if (action === 'reset_password') {
            const user = await prisma.user.findFirst({
                where: { email: email.toLowerCase() }
            });

            if (!user || !user.securityAnswer) {
                return NextResponse.json({ error: "Usuario no encontrado o sin pregunta de seguridad configurada." }, { status: 404 });
            }

            const normalizedInput = answer.trim().toLowerCase();
            const normalizedStored = user.securityAnswer.trim().toLowerCase();

            if (normalizedInput !== normalizedStored) {
                return NextResponse.json({ error: "La respuesta de seguridad es incorrecta." }, { status: 401 });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await prisma.user.update({
                where: { id: user.id },
                data: { passwordHash: hashedPassword }
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Acción no válida" }, { status: 400 });

    } catch (error: any) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
