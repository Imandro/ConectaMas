'use server';

import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export async function checkUserStatus(email: string) {
    const user = await prisma.user.findFirst({
        where: { email: email.toLowerCase() }
    });

    if (!user) {
        return { exists: false };
    }

    return {
        exists: true,
        hasSecurityAnswer: !!user.securityAnswer
    };
}

export async function resetPasswordWithSecurityAnswer(email: string, answer: string, newPassword: string) {
    const user = await prisma.user.findFirst({
        where: { email: email.toLowerCase() }
    });

    if (!user || !user.securityAnswer) {
        throw new Error("Usuario no encontrado o sin pregunta de seguridad configurada.");
    }

    // Normalize answer check
    const normalizedInput = answer.trim().toLowerCase();
    const normalizedStored = user.securityAnswer.trim().toLowerCase();

    if (normalizedInput !== normalizedStored) {
        throw new Error("La respuesta de seguridad es incorrecta.");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: hashedPassword }
    });

    return { success: true };
}
