"use server";

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getGameRooms() {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        // Cleanup stale rooms before fetching
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        await prisma.gameRoom.deleteMany({
            where: {
                OR: [
                    { status: "FINISHED" },
                    { createdAt: { lt: tenMinutesAgo }, status: "WAITING" } // Clean up waiting rooms older than 10 mins
                ]
            }
        });

        const rooms = await prisma.gameRoom.findMany({
            where: {
                status: { in: ["WAITING", "PLAYING"] }
                // isPrivate filter removed to show all rooms as requested
            },
            include: {
                _count: {
                    select: { players: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return { success: true, rooms };
    } catch (error) {
        console.error("Error fetching game rooms:", error);
        return { success: false, error: "Failed to fetch rooms" };
    }
}

export async function createGameRoom(name: string, isPrivate: boolean) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        const room = await prisma.gameRoom.create({
            data: {
                code,
                name: name || `Sala de ${session.user.name}`,
                isPrivate,
                status: "WAITING",
                type: "HOT_POTATO"
            }
        });

        // Add creator as player
        await prisma.gamePlayer.create({
            data: {
                roomId: room.id,
                userId: session.user.id,
                status: "ALIVE"
            }
        });

        return { success: true, roomId: room.id };
    } catch (error) {
        console.error("Error creating room:", error);
        return { success: false, error: "Failed to create room" };
    }
}

export async function joinGameRoom(roomId: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        // Check if already in room
        const existing = await prisma.gamePlayer.findUnique({
            where: {
                roomId_userId: {
                    roomId,
                    userId: session.user.id
                }
            }
        });

        if (!existing) {
            await prisma.gamePlayer.create({
                data: {
                    roomId,
                    userId: session.user.id,
                    status: "ALIVE"
                }
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Error joining room:", error);
        return { success: false, error: "Failed to join room" };
    }
}
