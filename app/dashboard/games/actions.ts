"use server";

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createGameRoom() {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
        const room = await prisma.gameRoom.create({
            data: {
                code,
                status: "WAITING",
                players: {
                    create: {
                        userId: session.user.id,
                        status: "ALIVE"
                    }
                }
            }
        });

        return { success: true, room };
    } catch (error) {
        console.error("Error creating game room:", error);
        return { success: false, error: "Failed to create room" };
    }
}

export async function joinGameRoom(code: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const room = await prisma.gameRoom.findUnique({
            where: { code },
            include: { players: true }
        });

        if (!room) return { success: false, error: "Room not found" };
        if (room.status !== "WAITING") return { success: false, error: "Game already started" };

        const isAlreadyIn = room.players.some(p => p.userId === session.user.id);
        if (!isAlreadyIn) {
            await prisma.gamePlayer.create({
                data: {
                    roomId: room.id,
                    userId: session.user.id,
                    status: "ALIVE"
                }
            });
        }

        return { success: true, roomId: room.id };
    } catch (error) {
        console.error("Error joining game room:", error);
        return { success: false, error: "Failed to join room" };
    }
}

export async function startGame(roomId: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const room = await prisma.gameRoom.findUnique({
            where: { id: roomId },
            include: { players: true }
        });

        if (!room) return { success: false, error: "Room not found" };
        if (room.players.length < 2) return { success: false, error: "Need at least 2 players" };

        // Randomly pick first player
        const firstPlayer = room.players[Math.floor(Math.random() * room.players.length)];

        // Random bomb time (30-60s)
        const bombExplodesAt = new Date(Date.now() + (30 + Math.random() * 30) * 1000);

        await prisma.gameRoom.update({
            where: { id: roomId },
            data: {
                status: "PLAYING",
                currentTurnUserId: firstPlayer.userId,
                bombExplodesAt
            }
        });

        revalidatePath(`/dashboard/games/${roomId}`);
        return { success: true };
    } catch (error) {
        console.error("Error starting game:", error);
        return { success: false, error: "Failed to start" };
    }
}

export async function submitGameAnswer(roomId: string, answer: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const room = await prisma.gameRoom.findUnique({
            where: { id: roomId },
            include: { players: { where: { status: "ALIVE" } } }
        });

        if (!room || room.status !== "PLAYING") return { success: false, error: "Invalid room state" };
        if (room.currentTurnUserId !== session.user.id) return { success: false, error: "Not your turn" };

        // Check if bomb exploded
        if (room.bombExplodesAt && room.bombExplodesAt.getTime() < Date.now()) {
            // Player eliminated!
            await prisma.gamePlayer.update({
                where: { roomId_userId: { roomId, userId: session.user.id } },
                data: { status: "ELIMINATED" }
            });

            // Check if game ends (only 1 player left)
            const remainingPlayers = room.players.filter(p => p.userId !== session.user.id);
            if (remainingPlayers.length === 1) {
                await prisma.gamePlayer.update({
                    where: { roomId_userId: { roomId, userId: remainingPlayers[0].userId } },
                    data: { status: "WINNER", score: { increment: 50 } }
                });

                await prisma.gameRoom.update({
                    where: { id: roomId },
                    data: { status: "FINISHED" }
                });

                // Award XP to winner
                await awardGameXP(remainingPlayers[0].userId, 50);
            } else {
                // Next turn
                const currentIndex = remainingPlayers.findIndex(p => p.userId === session.user.id); // Should be -1 actually
                // Pick next alive player
                const nextPlayer = remainingPlayers[0]; // Simple logic for now
                const nextBomb = new Date(Date.now() + (20 + Math.random() * 20) * 1000);

                await prisma.gameRoom.update({
                    where: { id: roomId },
                    data: {
                        currentTurnUserId: nextPlayer.userId,
                        bombExplodesAt: nextBomb
                    }
                });
            }

            return { success: true, exploded: true };
        }

        // Correct answer logic (for now just simple "next turn")
        const alivePlayers = room.players.filter(p => p.status === "ALIVE");
        const currentIndex = alivePlayers.findIndex(p => p.userId === session.user.id);
        const nextIndex = (currentIndex + 1) % alivePlayers.length;
        const nextPlayer = alivePlayers[nextIndex];

        await prisma.gameRoom.update({
            where: { id: roomId },
            data: {
                currentTurnUserId: nextPlayer.userId
                // Bomb continues ticking
            }
        });

        return { success: true, exploded: false };
    } catch (error) {
        console.error("Error submitting game answer:", error);
        return { success: false, error: "Failed to submit" };
    }
}

async function awardGameXP(userId: string, amount: number) {
    await prisma.user.update({
        where: { id: userId },
        data: {
            weeklyXP: { increment: amount },
            totalXP: { increment: amount }
        }
    });
}

export async function getRoomStatus(roomId: string) {
    try {
        const room = await prisma.gameRoom.findUnique({
            where: { id: roomId },
            include: {
                players: {
                    include: { user: { select: { name: true, image: true } } }
                }
            }
        });
        return { success: true, room };
    } catch (error) {
        return { success: false };
    }
}
