"use server";

import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

// Type assertion temporal hasta que se regenere el cliente de Prisma
const prismaWithVideo = prisma as any;

export async function markVideoWatched(videoId: string) {
    const session = await auth();

    if (!session?.user?.email) {
        return { error: "No autenticado" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return { error: "Usuario no encontrado" };
        }

        // Check if already watched
        const existing = await prismaWithVideo.userVideo.findUnique({
            where: {
                userId_videoId: {
                    userId: user.id,
                    videoId: videoId,
                }
            }
        });

        if (!existing) {
            await prismaWithVideo.userVideo.create({
                data: {
                    userId: user.id,
                    videoId: videoId,
                    watchedAt: new Date(),
                    liked: false,
                }
            });
        }

        revalidatePath("/dashboard/videos");
        return { success: true };
    } catch (error) {
        console.error("Error marking video as watched:", error);
        return { error: "Error al guardar" };
    }
}

export async function toggleVideoLike(videoId: string) {
    const session = await auth();

    if (!session?.user?.email) {
        return { error: "No autenticado" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return { error: "Usuario no encontrado" };
        }

        // Find or create user video record
        const existing = await prismaWithVideo.userVideo.findUnique({
            where: {
                userId_videoId: {
                    userId: user.id,
                    videoId: videoId,
                }
            }
        });

        if (existing) {
            // Toggle like status
            await prismaWithVideo.userVideo.update({
                where: {
                    userId_videoId: {
                        userId: user.id,
                        videoId: videoId,
                    }
                },
                data: {
                    liked: !existing.liked,
                }
            });
        } else {
            // Create new record with liked = true
            await prismaWithVideo.userVideo.create({
                data: {
                    userId: user.id,
                    videoId: videoId,
                    watchedAt: new Date(),
                    liked: true,
                }
            });
        }

        revalidatePath("/dashboard/videos");
        return { success: true };
    } catch (error) {
        console.error("Error toggling video like:", error);
        return { error: "Error al guardar" };
    }
}

export async function getUserVideoInteractions(videoId: string) {
    const session = await auth();

    if (!session?.user?.email) {
        return null;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return null;
        }

        const interaction = await prismaWithVideo.userVideo.findUnique({
            where: {
                userId_videoId: {
                    userId: user.id,
                    videoId: videoId,
                }
            }
        });

        return interaction;
    } catch (error) {
        console.error("Error getting video interaction:", error);
        return null;
    }
}

export async function getAllVideos() {
    try {
        const videos = await prismaWithVideo.video.findMany({
            orderBy: {
                publishedAt: 'desc'
            }
        });

        return videos.map((video: any) => ({
            id: video.id,
            title: video.title,
            description: video.description || '',
            videoUrl: video.videoUrl,
            thumbnailUrl: video.thumbnailUrl || '',
            duration: video.duration || 0,
            category: video.category,
            tags: video.tags ? JSON.parse(video.tags) : []
        }));
    } catch (error) {
        console.error("Error getting videos:", error);
        return [];
    }
}

export async function getVideosByCategory(category: string) {
    try {
        const videos = await prismaWithVideo.video.findMany({
            where: category === 'Para ti' ? {} : { category },
            orderBy: {
                publishedAt: 'desc'
            }
        });

        return videos.map((video: any) => ({
            id: video.id,
            title: video.title,
            description: video.description || '',
            videoUrl: video.videoUrl,
            thumbnailUrl: video.thumbnailUrl || '',
            duration: video.duration || 0,
            category: video.category,
            tags: video.tags ? JSON.parse(video.tags) : []
        }));
    } catch (error) {
        console.error("Error getting videos by category:", error);
        return [];
    }
}
