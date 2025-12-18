import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import OnboardingSteps from "./OnboardingSteps";
import { prisma } from "@/app/lib/prisma";

export default async function OnboardingPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    // Double check if already completed
    const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
    });

    if (user?.hasCompletedOnboarding) {
        redirect("/dashboard");
    }

    return <OnboardingSteps />;
}
