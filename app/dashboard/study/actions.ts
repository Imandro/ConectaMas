"use server";

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

const MAX_PARTICIPANTS = 20;

export async function createStudyRoom(title: string, theme?: string, description?: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        // Check if user already has an active room
        const existingRoom = await prisma.studyRoom.findFirst({
            where: {
                hostId: session.user.id,
                status: "OPEN"
            }
        });

        if (existingRoom) {
            return { success: false, error: "Ya tienes una sala activa. Solo puedes crear una sala a la vez." };
        }

        const room = await prisma.studyRoom.create({
            data: {
                title,
                theme,
                description,
                hostId: session.user.id,
                status: "OPEN"
            }
        });

        // Add host as participant
        await prisma.studyRoomParticipant.create({
            data: {
                roomId: room.id,
                userId: session.user.id,
                role: "HOST"
            }
        });

        revalidatePath("/dashboard/study");
        return { success: true, room, roomId: room.id };
    } catch (error) {
        console.error("Error creating study room:", error);
        return { success: false, error: "Failed to create room" };
    }
}

export async function joinStudyRoom(roomId: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const room = await prisma.studyRoom.findUnique({
            where: { id: roomId },
            include: {
                participants: true
            }
        });

        if (!room) return { success: false, error: "Sala no encontrada" };
        if (room.status !== "OPEN") return { success: false, error: "Esta sala está cerrada" };

        // Check if already a participant
        const existing = room.participants.find(p => p.userId === session.user.id);
        if (existing) return { success: true };

        // Check room capacity
        if (room.participants.length >= MAX_PARTICIPANTS) {
            return { success: false, error: "Sala llena. Esta sala ya tiene 20 participantes." };
        }

        await prisma.studyRoomParticipant.create({
            data: {
                roomId: room.id,
                userId: session.user.id,
                role: "MEMBER"
            }
        });

        revalidatePath(`/dashboard/study/${roomId}`);
        return { success: true };
    } catch (error) {
        console.error("Error joining study room:", error);
        return { success: false, error: "Failed to join room" };
    }
}

export async function leaveStudyRoom(roomId: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        await prisma.studyRoomParticipant.deleteMany({
            where: {
                roomId,
                userId: session.user.id
            }
        });

        const remainingParticipants = await prisma.studyRoomParticipant.count({
            where: { roomId }
        });

        if (remainingParticipants === 0) {
            await prisma.studyRoom.delete({
                where: { id: roomId }
            });
        }

        revalidatePath("/dashboard/study");
        return { success: true };
    } catch (error) {
        console.error("Error leaving study room:", error);
        return { success: false, error: "Failed to leave room" };
    }
}

export async function deleteStudyRoom(roomId: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const room = await prisma.studyRoom.findUnique({
            where: { id: roomId }
        });

        if (!room) return { success: false, error: "Room not found" };
        if (room.hostId !== session.user.id) return { success: false, error: "Solo el anfitrión puede eliminar la sala" };

        await prisma.studyRoom.delete({
            where: { id: roomId }
        });

        revalidatePath("/dashboard/study");
        return { success: true };
    } catch (error) {
        console.error("Error deleting study room:", error);
        return { success: false, error: "Failed to delete room" };
    }
}

export async function kickParticipant(roomId: string, userId: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const room = await prisma.studyRoom.findUnique({
            where: { id: roomId }
        });

        if (!room) return { success: false, error: "Room not found" };
        if (room.hostId !== session.user.id) return { success: false, error: "Solo el anfitrión puede expulsar participantes" };

        await prisma.studyRoomParticipant.deleteMany({
            where: {
                roomId,
                userId
            }
        });

        revalidatePath(`/dashboard/study/${roomId}`);
        return { success: true };
    } catch (error) {
        console.error("Error kicking participant:", error);
        return { success: false, error: "Failed to kick participant" };
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
                    select: { messages: true, participants: true }
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
        // Clean up old messages (3 days)
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
        await prisma.studyMessage.deleteMany({
            where: {
                roomId,
                createdAt: { lt: threeDaysAgo }
            }
        });

        const messages = await prisma.studyMessage.findMany({
            where: { roomId },
            include: {
                user: {
                    select: { name: true, image: true }
                }
            },
            orderBy: { createdAt: "asc" },
            take: 100
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
        // Verify user is participant
        const participant = await prisma.studyRoomParticipant.findUnique({
            where: {
                roomId_userId: {
                    roomId,
                    userId: session.user.id
                }
            }
        });

        if (!participant) return { success: false, error: "No eres participante de esta sala" };

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
    const session = await auth();
    if (!session?.user?.id) return { success: false };

    try {
        const room = await prisma.studyRoom.findUnique({
            where: { id: roomId },
            include: {
                host: { select: { id: true, name: true, image: true } },
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                spiritualLevel: true
                            }
                        }
                    }
                }
            }
        });
        return { success: true, room, currentUserId: session.user.id };
    } catch {
        return { success: false };
    }
}
