import { auth } from "@/app/lib/auth";
import { getOpenStudyRooms } from "./actions";
import StudyLobbyView from "./StudyLobbyView";
import { redirect } from "next/navigation";

export default async function StudyPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const res = await getOpenStudyRooms();
    const rooms = (res.success && res.rooms) ? res.rooms : [];

    return (
        <div className="container py-4">
            <StudyLobbyView
                initialRooms={rooms}
            />
        </div>
    );
}
