import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Update lastChallengeCompleted
        // Also check if we should increase streak (if not already done today)
        // Ideally streak logic is more complex, but for now we just mark the challenge.
        // We can hook into existing Streak logic if it exists, or just update the field.

        await prisma.user.update({
            where: { id: user.id },
            data: {
                lastChallengeCompleted: new Date(),
                weeklyXP: { increment: 10 },
                totalXP: { increment: 10 }
            }
        });

        // Basic Streak update (simplified)
        // If we had a Streak service, we'd call it here.
        // For now, let's just ensure we return success.

        return NextResponse.json({ message: "Challenge completed" });

    } catch (error) {
        console.error("Error completing challenge:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
