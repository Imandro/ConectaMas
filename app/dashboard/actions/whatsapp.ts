"use server";

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function confirmWhatsappJoin() {
    const session = await auth();
    if (!session?.user?.id) return { success: false };

    await prisma.user.update({
        where: { id: session.user.id },
        data: { hasJoinedWhatsapp: true }
    });

    revalidatePath("/dashboard");
    return { success: true };
}
