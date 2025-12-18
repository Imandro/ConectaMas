"use server";

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function resetAccount() {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    // Reset onboarding flag and maybe clear struggles for demo purposes
    await prisma.user.update({
        where: { email: session.user.email },
        data: {
            hasCompletedOnboarding: false,
            spiritualLevel: "EXPLORING"
        }
    });

    // Optionally delete struggles? For now just reset flag so they can go through flow again.
    // await prisma.userStruggle.deleteMany({ where: { userId: ... } });

    revalidatePath("/dashboard");
}

export async function deleteAccount() {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    await prisma.user.delete({
        where: { email: session.user.email }
    });
}
