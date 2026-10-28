"use server";

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { isSupportedCountry, normalizeCountry } from "@/app/lib/legal/policy";

export async function updateUserCountry(country: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false };
    const normalizedCountry = normalizeCountry(country);
    if (!isSupportedCountry(normalizedCountry)) return { success: false, error: 'unsupported_country' };

    await prisma.user.update({
        where: { id: session.user.id },
        data: { country: normalizedCountry }
    });

    revalidatePath("/dashboard");
    return { success: true };
}
