"use server";

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitLeaderApplication(data: any) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        await prisma.leaderApplication.create({
            data: {
                userId: session.user.id,
                answers: JSON.stringify(data),
                status: "APPROVED" // Auto-approve for MVP
            }
        });

        // Update user profile type to COOPERATOR (Leader)
        await prisma.user.update({
            where: { id: session.user.id },
            data: { profileType: "COOPERATOR" }
        });

        revalidatePath("/dashboard/groups");
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Failed to submit" };
    }
}

export async function createGroup(name: string, motto: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false };

    // Generate random code
    const accessCode = "GRUPO-" + Math.random().toString(36).substring(2, 5).toUpperCase();

    try {
        const group = await prisma.group.create({
            data: {
                name,
                motto,
                leaderId: session.user.id,
                accessCode,
                members: {
                    create: {
                        userId: session.user.id,
                        role: "ADMIN"
                    }
                }
            }
        });
        return { success: true, groupId: group.id };
    } catch (e) {
        return { success: false };
    }
}

export async function getMyGroups() {
    const session = await auth();
    if (!session?.user?.id) return [];

    try {
        const memberships = await prisma.groupMember.findMany({
            where: { userId: session.user.id },
            include: { group: true }
        });
        return memberships.map(m => m.group);
    } catch (e) {
        return [];
    }
}

export async function getGroupDetails(groupId: string) {
    const session = await auth();
    if (!session?.user?.id) return null;

    try {
        const group = await prisma.group.findUnique({
            where: { id: groupId },
            include: {
                leader: { select: { id: true, name: true, image: true } },
                members: { include: { user: { select: { name: true, image: true } } } },
                tasks: {
                    include: {
                        completions: {
                            where: { userId: session.user.id }
                        }
                    }
                },
                needs: true
            }
        });
        return group;
    } catch (e) {
        return null;
    }
}

export async function joinGroup(accessCode: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const group = await prisma.group.findUnique({
            where: { accessCode }
        });

        if (!group) return { success: false, error: "Código inválido" };

        await prisma.groupMember.create({
            data: {
                groupId: group.id,
                userId: session.user.id,
                role: "MEMBER"
            }
        });

        revalidatePath("/dashboard/groups");
        return { success: true, groupId: group.id };
    } catch (e) {
        return { success: false, error: "Ya eres miembro o hubo un error" };
    }
}

export async function submitNeed(groupId: string, content: string, isAnonymous: boolean) {
    const session = await auth();
    if (!session?.user?.id) return { success: false };

    try {
        await prisma.groupNeed.create({
            data: {
                groupId,
                content,
                isAnonymous,
                userId: session.user.id
            }
        });
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}

export async function getGroupNeeds(groupId: string) {
    const session = await auth();
    if (!session?.user?.id) return [];

    try {
        const group = await prisma.group.findUnique({
            where: { id: groupId },
            select: { leaderId: true }
        });

        if (group?.leaderId !== session.user.id) return []; // Only leader can see needs for now

        return await prisma.groupNeed.findMany({
            where: { groupId },
            orderBy: { createdAt: "desc" }
        });
    } catch (e) {
        return [];
    }
}

export async function completeTask(taskId: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false };

    try {
        await prisma.groupTaskCompletion.create({
            data: {
                taskId,
                userId: session.user.id
            }
        });

        // XP Reward
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                weeklyXP: { increment: 20 },
                totalXP: { increment: 20 }
            }
        });

        return { success: true };
    } catch (e) {
        return { success: false };
    }
}

export async function createTask(groupId: string, title: string, type: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false };

    try {
        const group = await prisma.group.findUnique({
            where: { id: groupId },
            select: { leaderId: true }
        });

        if (group?.leaderId !== session.user.id) return { success: false, error: "Unauthorized" };

        await prisma.groupTask.create({
            data: {
                groupId,
                title,
                type,
                date: new Date()
            }
        });
        revalidatePath(`/dashboard/groups/${groupId}`);
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}

export async function removeMember(groupId: string, userId: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false };

    try {
        const group = await prisma.group.findUnique({
            where: { id: groupId },
            select: { leaderId: true }
        });

        if (group?.leaderId !== session.user.id) return { success: false, error: "Unauthorized" };

        await prisma.groupMember.deleteMany({
            where: {
                groupId,
                userId
            }
        });
        revalidatePath(`/dashboard/groups/${groupId}`);
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}


