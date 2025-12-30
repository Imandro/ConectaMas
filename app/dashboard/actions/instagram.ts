"use server";

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function confirmInstagramFollow() {
    const session = await auth();
    if (!session?.user?.id) return { success: false };

    await prisma.user.update({
        where: { id: session.user.id },
        data: { hasFollowedInstagram: true } as any
    });

    revalidatePath("/dashboard");
    return { success: true };
}
