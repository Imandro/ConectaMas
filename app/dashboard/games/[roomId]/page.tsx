import { auth } from "@/app/lib/auth";
import { getRoomStatus } from "../actions";
import HotPotatoView from "../components/HotPotatoView";
import { redirect } from "next/navigation";

export default async function GameRoomPage({ params }: { params: { roomId: string } }) {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const res = await getRoomStatus(params.roomId);
    if (!res.success || !res.room) {
        redirect("/dashboard/games");
    }

    return (
        <div className="container py-4">
            <HotPotatoView
                initialRoom={res.room}
                currentUserId={session.user.id}
                roomId={params.roomId}
            />
        </div>
    );
}
