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

export async function leaveGameRoom(roomId: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        // Remove player from room
        await prisma.gamePlayer.deleteMany({
            where: {
                roomId,
                userId: session.user.id
            }
        });

        // Check if room is now empty and delete if so
        const remainingPlayers = await prisma.gamePlayer.count({
            where: { roomId }
        });

        if (remainingPlayers === 0) {
            await prisma.gameRoom.delete({
                where: { id: roomId }
            });
        }

        revalidatePath("/dashboard/games");
        return { success: true };
    } catch (error) {
        console.error("Error leaving room:", error);
        return { success: false, error: "Failed to leave room" };
    }
}

export async function getRoomStatus(roomId: string) {
    try {
        const room = await prisma.gameRoom.findUnique({
            where: { id: roomId },
            include: {
                players: {
                    include: {
                        user: {
                            select: { name: true, image: true }
                        }
                    },
                    orderBy: { joinedAt: "asc" }
                }
            }
        });
        return { success: true, room };
    } catch (error) {
        return { success: false, error: "Failed to fetch room" };
    }
}

export async function startGame(roomId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const room = await prisma.gameRoom.findUnique({
            where: { id: roomId },
            include: { players: true }
        });

        if (!room) return { success: false, error: "Room not found" };

        // Simple authorized check: Is user in room? Ideally check if creator.
        // For now, anyone inside can start to keep it simple.

        const firstPlayer = room.players.find(p => p.status === 'ALIVE');
        if (!firstPlayer) return { success: false, error: "No players" };

        await prisma.gameRoom.update({
            where: { id: roomId },
            data: {
                status: "PLAYING",
                currentTurnUserId: firstPlayer.userId,
                bombExplodesAt: new Date(Date.now() + (Math.random() * 20000 + 10000)) // 10-30s
            }
        });

        revalidatePath(`/dashboard/games/${roomId}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to start" };
    }
}

export async function submitGameAnswer(roomId: string, answer: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const room = await prisma.gameRoom.findUnique({
            where: { id: roomId },
            include: { players: true }
        });

        if (!room) return { success: false, error: "Room not found" };

        // Check explosion
        if (room.bombExplodesAt && new Date() > room.bombExplodesAt) {
            // Eliminated!
            await prisma.gamePlayer.update({
                where: { roomId_userId: { roomId, userId: session.user.id } },
                data: { status: "ELIMINATED" }
            });

            // Check if game over (1 survivor)
            const alivePlayers = room.players.filter(p => p.status === "ALIVE" && p.userId !== session.user.id);
            if (alivePlayers.length <= 1) {
                if (alivePlayers.length === 1) {
                    await prisma.gamePlayer.update({
                        where: { roomId_userId: { roomId, userId: alivePlayers[0].userId } },
                        data: { status: "WINNER", score: { increment: 50 } }
                    });
                }
                await prisma.gameRoom.update({
                    where: { id: roomId },
                    data: { status: "FINISHED" }
                });
            } else {
                // New round? Or just continue?
                // For Hot Potato usually elimination resets the round.
                // Reset bomb and pick random next player
                const nextPlayer = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
                await prisma.gameRoom.update({
                    where: { id: roomId },
                    data: {
                        currentTurnUserId: nextPlayer.userId,
                        bombExplodesAt: new Date(Date.now() + (Math.random() * 20000 + 10000))
                    }
                });
            }

            revalidatePath(`/dashboard/games/${roomId}`);
            return { success: true, exploded: true };
        }

        // Pass the bomb
        const alivePlayers = room.players.filter(p => p.status === "ALIVE");
        const currentIndex = alivePlayers.findIndex(p => p.userId === session.user.id);
        const nextIndex = (currentIndex + 1) % alivePlayers.length;
        const nextPlayer = alivePlayers[nextIndex];

        await prisma.gameRoom.update({
            where: { id: roomId },
            data: {
                currentTurnUserId: nextPlayer.userId
            }
        });

        revalidatePath(`/dashboard/games/${roomId}`);
        return { success: true, exploded: false };

    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to submit" };
    }
}
