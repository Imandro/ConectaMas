"use server";

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createStudyRoom(title: string, theme?: string, description?: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const room = await prisma.studyRoom.create({
            data: {
                title,
                theme,
                description,
                hostId: session.user.id,
                status: "OPEN"
            }
        });

        revalidatePath("/dashboard/study");
        return { success: true, room };
    } catch (error) {
        console.error("Error creating study room:", error);
        return { success: false, error: "Failed to create room" };
    }
}

export async function getOpenStudyRooms() {
    try {
        const rooms = await prisma.studyRoom.findMany({
            where: { status: "OPEN" },
            include: {
                host: {
                    select: { name: true, image: true }
                },
                _count: {
                    select: { messages: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return { success: true, rooms };
    } catch {
        return { success: false, error: "Failed to fetch rooms" };
    }
}

export async function getStudyMessages(roomId: string) {
    try {
        const messages = await prisma.studyMessage.findMany({
            where: { roomId },
            include: {
                user: {
                    select: { name: true, image: true }
                }
            },
            orderBy: { createdAt: "asc" },
            take: 50
        });

        return { success: true, messages };
    } catch {
        return { success: false };
    }
}

export async function sendStudyMessage(roomId: string, content: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const message = await prisma.studyMessage.create({
            data: {
                roomId,
                userId: session.user.id,
                content
            }
        });

        return { success: true, message };
    } catch {
        return { success: false };
    }
}

export async function getRoomDetails(roomId: string) {
    try {
        const room = await prisma.studyRoom.findUnique({
            where: { id: roomId },
            include: {
                host: { select: { name: true, image: true } }
            }
        });
        return { success: true, room };
    } catch {
        return { success: false };
    }
}
