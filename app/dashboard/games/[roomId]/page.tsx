import { auth } from "@/app/lib/auth";
import { getRoomStatus } from "../actions";
import HotPotatoView from "../components/HotPotatoView";
import NewGameRoomView from "../components/NewGameRoomView";
import { isNewGameType } from "@/app/lib/games/gameTypes";
import { redirect } from "next/navigation";
import SecondaryPageShell from "@/app/components/SecondaryUI";

export default async function GameRoomPage({ params }: { params: { roomId: string } }) {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth/login");

    const res = await getRoomStatus(params.roomId);
    if (!res.success || !res.room) {
        redirect("/dashboard/games");
    }

    return (
        <SecondaryPageShell>
        <div className="container py-4">
            {isNewGameType(res.room.type) ? (
                <NewGameRoomView initialRoom={res.room} currentUserId={session.user.id} roomId={params.roomId} />
            ) : (
                <HotPotatoView initialRoom={res.room} currentUserId={session.user.id} roomId={params.roomId} />
            )}
        </div>
        </SecondaryPageShell>
    );
}
