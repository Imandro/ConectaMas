import { auth } from "@/app/lib/auth";
import { getLeagueRanking } from "./actions";
import LeagueRankingView from "./LeagueRankingView";

export default async function LeaguePage() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const { ranking, userLeague, success } = await getLeagueRanking();

    return (
        <div className="container py-4">
            <LeagueRankingView
                initialRanking={ranking || []}
                userLeague={userLeague || "BRONZE"}
                currentUserId={session.user.id}
            />
        </div>
    );
}
