import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";

// Helper to get fresh user data for authorization
export async function getAuthUser() {
    const session = await auth();
    if (!session?.user?.id) return null;

    // Fetch fresh role/permissions from DB
    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                role: true, // Need to ensure your Prisma schema has this
                email: true,
                name: true
            }
        });
        return user;
    } catch (error) {
        console.error("Error fetching auth user:", error);
        return null; // Fail safe
    }
}

// Helper to check for admin role
export async function isAdmin() {
    const user = await getAuthUser();
    return user?.role === 'ADMIN';
}
