"use server";

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function searchUsers(query: string) {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    if (!query || query.length < 3) return [];

    const users = await prisma.user.findMany({
        where: {
            OR: [
                { username: { contains: query } }, // Case insensitive in SQLite/Postgres usually needs mode: insensitive, checking DB type
                { name: { contains: query } }
            ],
            NOT: {
                email: session.user.email // Exclude self
            }
        },
        select: {
            id: true,
            name: true,
            username: true,
            image: true,
            spiritualLevel: true
        },
        take: 5
    });

    return JSON.parse(JSON.stringify(users));
}

export async function addFriend(friendId: string) {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    });

    if (!user) throw new Error("User not found");
    if (user.id === friendId) return { error: "No puedes agregarte a ti mismo" };

    // Check if already friends efficiently
    const alreadyFriends = await prisma.user.count({
        where: {
            id: user.id,
            friends: { some: { id: friendId } }
        }
    });

    if (alreadyFriends > 0) return { error: "Ya son amigos" };

    // Symmetric friendship: Connect A to B and B to A in parallel to save time
    await Promise.all([
        prisma.user.update({
            where: { id: user.id },
            data: { friends: { connect: { id: friendId } } }
        }),
        prisma.user.update({
            where: { id: friendId },
            data: { friends: { connect: { id: user.id } } }
        })
    ]);

    revalidatePath("/dashboard/friends");
    return { success: true };
}

export async function sendSupportMessage(friendId: string, message: string) {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const sender = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!sender) throw new Error("User not found");

    if (message.length > 100) {
        return { error: "El mensaje es demasiado largo. Manténlo breve y de apoyo." };
    }

    await prisma.supportMessage.create({
        data: {
            senderId: sender.id,
            receiverId: friendId,
            message: message
        }
    });

    revalidatePath("/dashboard/friends");
    return { success: true };
}

export async function getSupportMessages() {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    });

    if (!user) return [];

    const messages = await prisma.supportMessage.findMany({
        where: { receiverId: user.id },
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 10
    });

    return JSON.parse(JSON.stringify(messages));
}

export async function markSupportMessageRead(messageId: string) {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    await prisma.supportMessage.update({
        where: { id: messageId },
        data: { read: true }
    });

    revalidatePath("/dashboard/friends");
    return { success: true };
}

export async function addFriendByUsername(username: string) {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    // Clear whitespace and @
    const cleanUsername = username.trim().replace("@", "");

    const targetUser = await prisma.user.findUnique({
        where: { username: cleanUsername }
    });

    if (!targetUser) {
        return { error: "Usuario no encontrado" };
    }

    return addFriend(targetUser.id);
}

export async function removeFriend(friendId: string) {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    });
    if (!user) throw new Error("User not found");

    // Disconnect both ways atomically
    await prisma.$transaction([
        prisma.user.update({
            where: { id: user.id },
            data: { friends: { disconnect: { id: friendId } } }
        }),
        prisma.user.update({
            where: { id: friendId },
            data: { friends: { disconnect: { id: user.id } } }
        })
    ]);

    revalidatePath("/dashboard/friends");
    return { success: true };
}

export async function getFriends() {
    const session = await auth();
    if (!session?.user?.email) return [];

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            friends: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                    spiritualLevel: true
                }
            }
        }
    });

    return JSON.parse(JSON.stringify(user?.friends || []));
}
