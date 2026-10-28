"use server";

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { memoryPairs } from "@/app/data/games/memoryData";
import { characterEvents } from "@/app/data/games/characterEventData";
import { bibleOrderChallenges } from "@/app/data/games/bibleOrderData";
import { isValidTurnAction, scoreGameTurn } from "@/app/lib/games/gameRules";
import { GAME_MAX_PLAYERS, GAME_TURN_SECONDS, isNewGameType, type GameRoomType, type GameTurnAction, type NewGameType } from "@/app/lib/games/gameTypes";

type RoomQuestionState = {
    type: NewGameType;
    round: number;
    totalRounds: number;
    questionId?: string;
    character?: string;
    hint?: string;
    options?: { id: string; label: string }[];
    items?: { id: string; label: string }[];
    cards?: { id: string; label: string; reference: string }[];
    matchedPairIds?: string[];
};

const nextQuestionId = (type: NewGameType, round: number) => `${type.toLowerCase()}-${round}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

function buildQuestion(type: NewGameType, round: number, matchedPairIds: string[] = []): RoomQuestionState {
    if (type === "MEMORY") {
        return {
            type,
            round,
            totalRounds: memoryPairs.length,
            cards: shuffle(memoryPairs.flatMap((pair) => [
                { id: `${pair.id}-front`, label: pair.front, reference: pair.reference },
                { id: `${pair.id}-back`, label: pair.back, reference: pair.reference },
            ])),
            matchedPairIds,
        };
    }

    if (type === "CHARACTER_EVENT") {
        const question = characterEvents[round % characterEvents.length];
        const options = shuffle([
            question,
            ...characterEvents.filter((item) => item.id !== question.id).slice(round % 4, (round % 4) + 2),
        ]).map((item) => ({ id: item.id, label: item.event }));
        return {
            type,
            round,
            totalRounds: 10,
            questionId: question.id,
            character: question.character,
            hint: question.hint,
            options,
        };
    }

    const question = bibleOrderChallenges[round % bibleOrderChallenges.length];
    return {
        type,
        round,
        totalRounds: 5,
        questionId: question.id,
        items: shuffle(question.items),
    };
}

function parseQuestion(value: string | null): RoomQuestionState | null {
    if (!value) return null;
    try {
        const parsed = JSON.parse(value) as RoomQuestionState;
        return parsed && typeof parsed.type === "string" ? parsed : null;
    } catch {
        return null;
    }
}

function getExpectedAnswer(type: NewGameType, question: RoomQuestionState) {
    if (type === "MEMORY") {
        return {
            pairIdByCard: Object.fromEntries(memoryPairs.flatMap((pair) => [
                [`${pair.id}-front`, pair.id],
                [`${pair.id}-back`, pair.id],
            ])),
        } as const;
    }

    if (type === "CHARACTER_EVENT") return { correctOptionId: question.questionId || "" } as const;

    const challenge = bibleOrderChallenges.find((item) => item.id === question.questionId);
    return { orderedIds: challenge?.orderedIds || [] } as const;
}

async function getNewGameRoom(roomId: string) {
    return prisma.gameRoom.findUnique({
        where: { id: roomId },
        include: {
            players: {
                include: { user: { select: { name: true } } },
                orderBy: { joinedAt: "asc" },
            },
        },
    });
}

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

export async function createGameRoom(name: string, isPrivate: boolean, type: GameRoomType = "HOT_POTATO") {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };
    if (type !== "HOT_POTATO" && !isNewGameType(type)) return { success: false, error: "Unsupported game" };

    try {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        const room = await prisma.gameRoom.create({
            data: {
                code,
                name: name || `Sala de ${session.user.name}`,
                isPrivate,
                status: "WAITING",
                type
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
            const room = await prisma.gameRoom.findUnique({ where: { id: roomId }, include: { _count: { select: { players: true } } } });
            if (!room) return { success: false, error: "Room not found" };
            if (room.status !== "WAITING") return { success: false, error: "Game already started" };
            if (room._count.players >= GAME_MAX_PLAYERS) return { success: false, error: "Room is full" };
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
        let room = await prisma.gameRoom.findUnique({
            where: { id: roomId },
            include: {
                players: {
                    include: {
                        user: {
                            select: { name: true }
                        }
                    },
                    orderBy: { joinedAt: "asc" }
                }
            }
        });

        if (!room) return { success: false, error: "Room not found" };

        if (isNewGameType(room.type)) {
            const question = parseQuestion(room.currentQuestion);
            if (room.status === "PLAYING" && question && room.bombExplodesAt && new Date() > room.bombExplodesAt) {
                const currentRoom = room;
                const nextPlayers = currentRoom.players.filter((player) => player.status === "ALIVE");
                const currentIndex = nextPlayers.findIndex((player) => player.userId === currentRoom.currentTurnUserId);
                const nextPlayer = nextPlayers.length > 0 ? nextPlayers[(currentIndex + 1) % nextPlayers.length] : undefined;
                const nextRound = question.type === "MEMORY" ? question.round : question.round + 1;
                const finished = nextPlayers.length === 0 || nextRound >= question.totalRounds || (question.type === "MEMORY" && (question.matchedPairIds?.length || 0) >= memoryPairs.length);
                const nextQuestion = finished ? null : buildQuestion(question.type, nextRound, question.matchedPairIds || []);
                const update = await prisma.gameRoom.updateMany({
                    where: { id: roomId, status: "PLAYING", activeQuestionId: currentRoom.activeQuestionId || undefined },
                    data: {
                        status: finished ? "FINISHED" : "PLAYING",
                        currentTurnUserId: finished ? null : nextPlayer?.userId || null,
                        bombExplodesAt: finished ? null : new Date(Date.now() + GAME_TURN_SECONDS * 1000),
                        activeQuestionId: finished ? null : nextQuestionId(question.type, nextRound),
                        currentQuestion: nextQuestion ? JSON.stringify(nextQuestion) : null,
                    },
                });
                if (update.count === 1) {
                    const refreshed = await getNewGameRoom(roomId);
                    if (refreshed) room = refreshed;
                }
            }
            return { success: true, room };
        }

        // --- GAME ENGINE LOGIC (Papa Caliente) ---
        if (room.status === "PLAYING") {
            const alivePlayers = room.players.filter(p => p.status === "ALIVE");

            // 1. Check if anyone is winner
            if (alivePlayers.length <= 1) {
                if (alivePlayers.length === 1) {
                    await prisma.gamePlayer.update({
                        where: { roomId_userId: { roomId, userId: alivePlayers[0].userId } },
                        data: { status: "WINNER", score: { increment: 50 } }
                    });
                }
                room = await prisma.gameRoom.update({
                    where: { id: roomId },
                    data: { status: "FINISHED" },
                    include: { players: { include: { user: { select: { name: true } } }, orderBy: { joinedAt: "asc" } } }
                });
            }
            // 2. Check if current turn user is GONE or EXPIRED
            else if (room.currentTurnUserId) {
                const currentPlayer = alivePlayers.find(p => p.userId === room?.currentTurnUserId);
                const isTimeUp = room.bombExplodesAt && new Date() > room.bombExplodesAt;

                if (!currentPlayer || isTimeUp) {
                    // Explode or skip
                    if (currentPlayer) {
                        await prisma.gamePlayer.update({
                            where: { roomId_userId: { roomId, userId: currentPlayer.userId } },
                            data: { status: "ELIMINATED" }
                        });
                    }

                    // Reset bomb and move to next
                    const remainingAlive = room.players.filter(p => p.status === "ALIVE" && p.userId !== room?.currentTurnUserId);
                    if (remainingAlive.length > 0) {
                        const nextPlayer = remainingAlive[Math.floor(Math.random() * remainingAlive.length)];
                        room = await prisma.gameRoom.update({
                            where: { id: roomId },
                            data: {
                                currentTurnUserId: nextPlayer.userId,
                                bombExplodesAt: new Date(Date.now() + (Math.random() * 20000 + 10000))
                            },
                            include: { players: { include: { user: { select: { name: true } } }, orderBy: { joinedAt: "asc" } } }
                        });
                    }
                }
            }
        }
        // ----------------------------------------

        return { success: true, room };
    } catch {
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
        if (isNewGameType(room.type) && room.players.length < 2) return { success: false, error: "At least 2 players are required" };
        if (room.players.length > GAME_MAX_PLAYERS) return { success: false, error: "Room is full" };

        const roomType = room.type as GameRoomType;
        const initialQuestion = isNewGameType(roomType) ? buildQuestion(roomType, 0) : null;
        await prisma.gameRoom.update({
            where: { id: roomId },
            data: {
                status: "PLAYING",
                currentTurnUserId: firstPlayer.userId,
                bombExplodesAt: new Date(Date.now() + (isNewGameType(roomType) ? GAME_TURN_SECONDS * 1000 : (Math.random() * 20000 + 10000))),
                activeQuestionId: isNewGameType(roomType) ? nextQuestionId(roomType, 0) : null,
                currentQuestion: initialQuestion ? JSON.stringify(initialQuestion) : null,
            }
        });

        revalidatePath(`/dashboard/games/${roomId}`);
        return { success: true };
    } catch {
        return { success: false, error: "Failed to start" };
    }
}

export async function submitGameTurn(roomId: string, expectedQuestionId: string, action: unknown) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const room = await getNewGameRoom(roomId);
    if (!room) return { success: false, error: "Room not found" };
    if (!isNewGameType(room.type)) return { success: false, error: "Unsupported game" };
    if (room.status !== "PLAYING") return { success: false, error: "Game is not active" };
    if (room.currentTurnUserId !== session.user.id) return { success: false, error: "Not your turn" };
    if (room.activeQuestionId !== expectedQuestionId) return { success: false, error: "Question expired" };
    if (room.bombExplodesAt && new Date() > room.bombExplodesAt) return { success: false, error: "Turn expired" };
    if (!isValidTurnAction(room.type, action)) return { success: false, error: "Invalid answer" };

    const question = parseQuestion(room.currentQuestion);
    if (!question || question.type !== room.type) return { success: false, error: "Question unavailable" };

    const result = scoreGameTurn(room.type, action as GameTurnAction, getExpectedAnswer(room.type, question));
    const playerIds = room.players.filter((player) => player.status === "ALIVE").map((player) => player.userId);
    const currentIndex = playerIds.indexOf(session.user.id);
    const nextUserId = playerIds[(currentIndex + 1) % playerIds.length];
    const nextRound = room.type === "MEMORY" ? question.round : question.round + 1;
    const matchedPairIds = room.type === "MEMORY" && result.correct && (action as GameTurnAction).kind === "MEMORY"
        ? Array.from(new Set([...(question.matchedPairIds || []), (action as Extract<GameTurnAction, { kind: "MEMORY" }>).cardIds[0].replace(/-(front|back)$/, "")]))
        : question.matchedPairIds || [];
    const finished = nextRound >= question.totalRounds || (room.type === "MEMORY" && matchedPairIds.length >= memoryPairs.length);
    const nextQuestion = finished ? null : buildQuestion(room.type, nextRound, matchedPairIds);
    const nextId = finished ? null : nextQuestionId(room.type, nextRound);

    try {
        const committed = await prisma.$transaction(async (tx) => {
            const claimed = await tx.gameRoom.updateMany({
                where: {
                    id: roomId,
                    status: "PLAYING",
                    currentTurnUserId: session.user.id,
                    activeQuestionId: expectedQuestionId,
                },
                data: {
                    status: finished ? "FINISHED" : "PLAYING",
                    currentTurnUserId: finished ? null : nextUserId,
                    bombExplodesAt: finished ? null : new Date(Date.now() + GAME_TURN_SECONDS * 1000),
                    activeQuestionId: nextId,
                    currentQuestion: nextQuestion ? JSON.stringify(nextQuestion) : null,
                },
            });
            if (claimed.count !== 1) return false;
            await tx.gamePlayer.update({
                where: { roomId_userId: { roomId, userId: session.user.id } },
                data: { score: { increment: result.points } },
            });
            return true;
        });

        if (!committed) return { success: false, error: "Question expired" };
        revalidatePath(`/dashboard/games/${roomId}`);
        return { success: true, correct: result.correct, points: result.points, finished };
    } catch (error) {
        console.error("Error submitting game turn:", error);
        return { success: false, error: "Failed to submit turn" };
    }
}

export async function submitGameAnswer(roomId: string, answer: string) {
    try {
        if (!answer.trim()) return { success: false, error: "Answer required" };
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
