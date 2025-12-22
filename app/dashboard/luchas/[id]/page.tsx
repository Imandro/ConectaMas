import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect, notFound } from "next/navigation";
import StrugglePlanContent from "./StrugglePlanContent";

export default async function StrugglePlanPage({
    params
}: {
    params: { id: string }
}) {
    const session = await auth();
    if (!session?.user) {
        redirect("/auth/login");
    }

    const userId = (session.user as any).id;
    const { id } = params;

    const userStruggle = await prisma.userStruggle.findUnique({
        where: {
            id,
            userId
        }
    });

    if (!userStruggle) {
        notFound();
    }

    // Get the struggle plan data
    const prismaAny = prisma as any;
    const plan = await prismaAny.strugglePlan.findFirst({
        where: {
            title: {
                contains: userStruggle.title,
                mode: 'insensitive'
            }
        },
        include: {
            days: {
                orderBy: {
                    dayNumber: 'asc'
                }
            }
        }
    });

    return (
        <div className="container py-0 py-md-4 min-vh-100 animate-fade-in shadow-none border-0">
            <StrugglePlanContent
                userStruggle={userStruggle as any}
                plan={plan as any}
            />
        </div>
    );
}
