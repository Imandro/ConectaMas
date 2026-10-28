import { auth } from "@/app/lib/auth";
import { getLeagueRanking } from "./actions";
import LeagueRankingView from "./LeagueRankingView";
import { redirect } from "next/navigation";
import SecondaryPageShell from "@/app/components/SecondaryUI";

export default async function LeaguePage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth/login");

    const { ranking, userLeague, success } = await getLeagueRanking();

    return (
        <SecondaryPageShell>
        <div className="container py-4">
            <LeagueRankingView
                initialRanking={ranking || []}
                userLeague={userLeague || "BRONZE"}
                currentUserId={session.user.id}
            />
        </div>
        </SecondaryPageShell>
    );
}
