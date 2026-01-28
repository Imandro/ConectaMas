import { auth } from "@/app/lib/auth";
import { getGlobalPrayers } from "./actions";
import PrayerWallView from "./PrayerWallView";
import { redirect } from "next/navigation";

export default async function PrayerPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const res = await getGlobalPrayers();
    // TS might infer undefined if not narrowed correctly, so we force a fallback
    const prayers = (res.success && res.prayers) ? res.prayers : [];

    return (
        <div className="container py-4">
            <PrayerWallView
                initialPrayers={prayers}
                currentUserId={session.user.id}
            />
        </div>
    );
}
